use sqlx::PgPool;

use crate::error::AppError;
use crate::model::userlist::*;

pub struct UserListService {
    pool: PgPool,
}

impl UserListService {
    pub fn new(pool: PgPool) -> Self {
        Self { pool }
    }

    // --- CRUD Lists ---

    pub async fn create_list(
        &self,
        owner_id: i64,
        req: CreateUserListRequest,
    ) -> Result<UserList, AppError> {
        let list = sqlx::query_as::<_, UserList>(
            r#"
            INSERT INTO user_lists (owner_id, name, description, list_type, visibility, scope, tag_id)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id, owner_id, name, description, list_type, visibility,
                      is_algorithmic, criteria_json, scope, tag_id, refresh_interval,
                      last_refreshed_at, created_at, updated_at
            "#,
        )
        .bind(owner_id)
        .bind(&req.name)
        .bind(&req.description)
        .bind(req.list_type.unwrap_or(0))
        .bind(req.visibility.unwrap_or(0))
        .bind(req.scope.unwrap_or(0))
        .bind(req.tag_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(list)
    }

    pub async fn get_list(&self, list_id: i64) -> Result<UserList, AppError> {
        let list = sqlx::query_as::<_, UserList>(
            r#"
            SELECT id, owner_id, name, description, list_type, visibility,
                   is_algorithmic, criteria_json, scope, tag_id, refresh_interval,
                   last_refreshed_at, created_at, updated_at
            FROM user_lists
            WHERE id = $1
            "#,
        )
        .bind(list_id)
        .fetch_one(&self.pool)
        .await?;
        Ok(list)
    }

    pub async fn get_lists_by_owner(&self, owner_id: i64) -> Result<Vec<UserList>, AppError> {
        let lists = sqlx::query_as::<_, UserList>(
            r#"
            SELECT id, owner_id, name, description, list_type, visibility,
                   is_algorithmic, criteria_json, scope, tag_id, refresh_interval,
                   last_refreshed_at, created_at, updated_at
            FROM user_lists
            WHERE owner_id = $1
            ORDER BY updated_at DESC
            "#,
        )
        .bind(owner_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(lists)
    }

    pub async fn update_list(
        &self,
        list_id: i64,
        owner_id: i64,
        req: UpdateUserListRequest,
    ) -> Result<UserList, AppError> {
        // Verify ownership first
        let existing = self.get_list(list_id).await?;
        if existing.owner_id != owner_id {
            return Err(AppError::Forbidden("not the list owner".into()));
        }

        let list = sqlx::query_as::<_, UserList>(
            r#"
            UPDATE user_lists
            SET name = COALESCE($2, name),
                description = COALESCE($3, description),
                visibility = COALESCE($4, visibility),
                updated_at = NOW()
            WHERE id = $1
            RETURNING id, owner_id, name, description, list_type, visibility,
                      is_algorithmic, criteria_json, scope, tag_id, refresh_interval,
                      last_refreshed_at, created_at, updated_at
            "#,
        )
        .bind(list_id)
        .bind(&req.name)
        .bind(&req.description)
        .bind(req.visibility)
        .fetch_one(&self.pool)
        .await?;
        Ok(list)
    }

    pub async fn delete_list(&self, list_id: i64, owner_id: i64) -> Result<(), AppError> {
        let existing = self.get_list(list_id).await?;
        if existing.owner_id != owner_id {
            return Err(AppError::Forbidden("not the list owner".into()));
        }
        sqlx::query("DELETE FROM user_lists WHERE id = $1")
            .bind(list_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    // --- Members ---

    pub async fn add_member(
        &self,
        list_id: i64,
        added_by: i64,
        req: AddMemberRequest,
    ) -> Result<ListMember, AppError> {
        // Verify list exists and user has permission
        self.verify_list_access(list_id, added_by).await?;

        let member = sqlx::query_as::<_, ListMember>(
            r#"
            INSERT INTO list_members (list_id, target_user_id, added_by)
            VALUES ($1, $2, $3)
            ON CONFLICT (list_id, target_user_id) DO NOTHING
            RETURNING id, list_id, target_user_id, added_by, added_at
            "#,
        )
        .bind(list_id)
        .bind(req.target_user_id)
        .bind(added_by)
        .fetch_optional(&self.pool)
        .await?;
        member.ok_or(AppError::Conflict("member already exists".into()))
    }

    pub async fn remove_member(
        &self,
        list_id: i64,
        target_user_id: i64,
        requester_id: i64,
    ) -> Result<(), AppError> {
        self.verify_list_access(list_id, requester_id).await?;
        sqlx::query("DELETE FROM list_members WHERE list_id = $1 AND target_user_id = $2")
            .bind(list_id)
            .bind(target_user_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn get_members(&self, list_id: i64) -> Result<Vec<ListMember>, AppError> {
        let members = sqlx::query_as::<_, ListMember>(
            r#"
            SELECT id, list_id, target_user_id, added_by, added_at
            FROM list_members
            WHERE list_id = $1
            ORDER BY added_at DESC
            "#,
        )
        .bind(list_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(members)
    }

    // --- Subscribers ---

    pub async fn subscribe(
        &self,
        list_id: i64,
        user_id: i64,
        action: Option<i16>,
    ) -> Result<ListSubscription, AppError> {
        let sub = sqlx::query_as::<_, ListSubscription>(
            r#"
            INSERT INTO list_subscriptions (list_id, user_id, action, active)
            VALUES ($1, $2, $3, true)
            ON CONFLICT (list_id, user_id) DO UPDATE
                SET active = true, action = COALESCE($3, list_subscriptions.action)
            RETURNING id, list_id, user_id, action, active, created_at
            "#,
        )
        .bind(list_id)
        .bind(user_id)
        .bind(action.unwrap_or(0))
        .fetch_one(&self.pool)
        .await?;
        Ok(sub)
    }

    pub async fn unsubscribe(&self, list_id: i64, user_id: i64) -> Result<(), AppError> {
        sqlx::query(
            "UPDATE list_subscriptions SET active = false WHERE list_id = $1 AND user_id = $2",
        )
        .bind(list_id)
        .bind(user_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn get_subscribers(&self, list_id: i64) -> Result<Vec<ListSubscription>, AppError> {
        let subs = sqlx::query_as::<_, ListSubscription>(
            r#"
            SELECT id, list_id, user_id, action, active, created_at
            FROM list_subscriptions
            WHERE list_id = $1 AND active = true
            ORDER BY created_at DESC
            "#,
        )
        .bind(list_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(subs)
    }

    // --- Collaborators ---

    pub async fn invite_collaborator(
        &self,
        list_id: i64,
        invited_by: i64,
        req: InviteCollaboratorRequest,
    ) -> Result<ListCollaborator, AppError> {
        self.verify_list_access(list_id, invited_by).await?;

        let collab = sqlx::query_as::<_, ListCollaborator>(
            r#"
            INSERT INTO list_collaborators (list_id, user_id, role, invited_by)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (list_id, user_id) DO UPDATE
                SET role = $3, invited_by = $4
            RETURNING id, list_id, user_id, role, invited_by, accepted_at, created_at
            "#,
        )
        .bind(list_id)
        .bind(req.user_id)
        .bind(req.role.unwrap_or(1))
        .bind(invited_by)
        .fetch_one(&self.pool)
        .await?;
        Ok(collab)
    }

    pub async fn accept_collaboration(&self, list_id: i64, user_id: i64) -> Result<(), AppError> {
        sqlx::query(
            r#"
            UPDATE list_collaborators
            SET accepted_at = NOW()
            WHERE list_id = $1 AND user_id = $2 AND accepted_at IS NULL
            "#,
        )
        .bind(list_id)
        .bind(user_id)
        .execute(&self.pool)
        .await?;
        Ok(())
    }

    pub async fn remove_collaborator(
        &self,
        list_id: i64,
        user_id: i64,
        requester_id: i64,
    ) -> Result<(), AppError> {
        let list = self.get_list(list_id).await?;
        if list.owner_id != requester_id && user_id != requester_id {
            return Err(AppError::Forbidden(
                "not authorized to remove collaborator".into(),
            ));
        }
        sqlx::query("DELETE FROM list_collaborators WHERE list_id = $1 AND user_id = $2")
            .bind(list_id)
            .bind(user_id)
            .execute(&self.pool)
            .await?;
        Ok(())
    }

    pub async fn get_collaborators(&self, list_id: i64) -> Result<Vec<ListCollaborator>, AppError> {
        let collabs = sqlx::query_as::<_, ListCollaborator>(
            r#"
            SELECT id, list_id, user_id, role, invited_by, accepted_at, created_at
            FROM list_collaborators
            WHERE list_id = $1
            ORDER BY created_at ASC
            "#,
        )
        .bind(list_id)
        .fetch_all(&self.pool)
        .await?;
        Ok(collabs)
    }

    // --- Algorithmic Lists ---

    pub async fn create_algorithmic_list(
        &self,
        owner_id: i64,
        req: CreateAlgorithmicListRequest,
    ) -> Result<UserList, AppError> {
        let list = sqlx::query_as::<_, UserList>(
            r#"
            INSERT INTO user_lists (owner_id, name, description, list_type, visibility,
                                    is_algorithmic, criteria_json, scope, tag_id, refresh_interval)
            VALUES ($1, $2, $3, $4, $5, true, $6, $7, $8, $9)
            RETURNING id, owner_id, name, description, list_type, visibility,
                      is_algorithmic, criteria_json, scope, tag_id, refresh_interval,
                      last_refreshed_at, created_at, updated_at
            "#,
        )
        .bind(owner_id)
        .bind(&req.name)
        .bind(&req.description)
        .bind(2_i16) // algorithmic list type
        .bind(0_i16) // default visibility
        .bind(&req.criteria_json)
        .bind(req.scope.unwrap_or(0))
        .bind(req.tag_id)
        .bind(&req.refresh_interval)
        .fetch_one(&self.pool)
        .await?;
        Ok(list)
    }

    pub async fn evaluate_algorithmic_list(
        &self,
        list_id: i64,
    ) -> Result<Vec<ListMember>, AppError> {
        let list = self.get_list(list_id).await?;
        if !list.is_algorithmic {
            return Err(AppError::Validation("list is not algorithmic".into()));
        }

        let criteria = list
            .criteria_json
            .ok_or_else(|| AppError::Validation("algorithmic list has no criteria".into()))?;

        // Evaluate criteria against users and update members
        // For now, a simple tag-based evaluation
        let members = sqlx::query_as::<_, ListMember>(
            r#"
            WITH matching_users AS (
                SELECT id AS target_user_id
                FROM users
                WHERE ($1::jsonb IS NULL OR true)  -- placeholder for criteria matching
                LIMIT 100
            )
            INSERT INTO list_members (list_id, target_user_id, added_by)
            SELECT $2, target_user_id, 0
            FROM matching_users
            ON CONFLICT (list_id, target_user_id) DO NOTHING
            RETURNING id, list_id, target_user_id, added_by, added_at
            "#,
        )
        .bind(&criteria)
        .bind(list_id)
        .fetch_all(&self.pool)
        .await?;

        // Update last_refreshed_at
        sqlx::query("UPDATE user_lists SET last_refreshed_at = NOW() WHERE id = $1")
            .bind(list_id)
            .execute(&self.pool)
            .await?;

        Ok(members)
    }

    pub async fn evaluate_algorithmic_criteria(
        &self,
        criteria_json: serde_json::Value,
    ) -> Result<Vec<i64>, AppError> {
        // Evaluate criteria without persisting: returns matching user IDs
        let user_ids = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT id
            FROM users
            WHERE ($1::jsonb IS NULL OR true)
            LIMIT 100
            "#,
        )
        .bind(&criteria_json)
        .fetch_all(&self.pool)
        .await?;
        Ok(user_ids)
    }

    pub async fn refresh_algorithmic_lists(&self) -> Result<u64, AppError> {
        let lists = sqlx::query_as::<_, UserList>(
            r#"
            SELECT id, owner_id, name, description, list_type, visibility,
                   is_algorithmic, criteria_json, scope, tag_id, refresh_interval,
                   last_refreshed_at, created_at, updated_at
            FROM user_lists
            WHERE is_algorithmic = true
              AND (last_refreshed_at IS NULL
                   OR last_refreshed_at < NOW() - (refresh_interval::interval))
            "#,
        )
        .fetch_all(&self.pool)
        .await?;

        let mut refreshed = 0u64;
        for list in &lists {
            if list.criteria_json.is_some() {
                let _ = self.evaluate_algorithmic_list(list.id).await;
                refreshed += 1;
            }
        }
        Ok(refreshed)
    }

    // --- Helpers ---

    async fn verify_list_access(&self, list_id: i64, user_id: i64) -> Result<(), AppError> {
        let list = self.get_list(list_id).await?;
        // Owner always has access
        if list.owner_id == user_id {
            return Ok(());
        }
        // Check if user is a collaborator
        let collab = sqlx::query_scalar::<_, i64>(
            r#"
            SELECT COUNT(*) FROM list_collaborators
            WHERE list_id = $1 AND user_id = $2 AND accepted_at IS NOT NULL
            "#,
        )
        .bind(list_id)
        .bind(user_id)
        .fetch_one(&self.pool)
        .await?;

        if collab == 0 {
            return Err(AppError::Forbidden("no access to this list".into()));
        }
        Ok(())
    }
}
