# Threadlight SMTP / Email — Setup Guide

## Current state on Orange Pi (192.168.1.138)

| Item | Status | Path |
|------|--------|------|
| Postfix | **Installed and running** (default config) | |
| OpenDKIM | **Installed and running** (no keys yet) | |
| New polaris binary | **Deployed** (arm64, with email code) | `/home/user/code/go/polaris/bin/polaris` |
| SMTP env vars | **Written** | `/home/user/code/go/polaris/.env.smtp` |
| Systemd unit file | **Written** (uses EnvironmentFile) | `/home/user/code/go/polaris/polaris.service` |
| Postfix config | Ready to install | `/tmp/postfix-main.cf` |
| DKIM setup script | Ready to run | `/tmp/dkim-keys-setup.sh` |

## Commands to run (in order)

### Step 1 — Install Postfix config
```bash
sudo cp /tmp/postfix-main.cf /etc/postfix/main.cf
sudo systemctl restart postfix
```

### Step 2 — Set up DKIM (recommended so emails don't land in spam)
```bash
sudo bash /tmp/dkim-keys-setup.sh
```
It prints a DKIM public key. Add it to your domain's DNS as a TXT record:
```
mail._domainkey.yourdomain.com  IN  TXT  "v=DKIM1; h=sha256; k=rsa; p=..."
```
Without DKIM + SPF, emails from a residential IP will be flagged as spam by Gmail/Outlook.

### Step 3 — Deploy the new polaris binary
```bash
sudo cp /home/user/code/go/polaris/polaris.service /etc/systemd/system/polaris.service
sudo systemctl daemon-reload
sudo systemctl restart polaris
```

### Step 4 — Verify it works
```bash
# Watch the logs for the email queue worker
journalctl -u polaris -f --no-pager | grep -E "email|scheduler"

# Test local mail delivery
echo "Test body" | mail -s "Test from Threadlight" your.email@example.com

# Test the forgot-password API
curl -X POST http://localhost:8080/api/v1/auth/forgot \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'

# Check the queue table
psql postgres://polaris@/polaris?host=/run/postgresql \
  -c "SELECT id, to_email, subject, status, created_at FROM email_queue ORDER BY id DESC LIMIT 5;"
```

## If port 25 is blocked by your ISP

Edit `/home/user/code/go/polaris/.env.smtp` and set an external relay:

```bash
# Example with Mailgun
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your.domain
SMTP_PASS=your-smtp-password
SMTP_FROM=Threadlight <noreply@your.domain>
```

Then `sudo systemctl restart polaris`.

Free relay providers: Mailgun (5k/mo), SendGrid (100/day), SMTP2GO (1k/mo).

## New API endpoints

| Method | Path | Purpose |
|--------|------|---------|
| POST | `/api/v1/auth/forgot` | Request password reset |
| POST | `/api/v1/auth/reset` | Submit new password with token |
| GET | `/api/v1/verify_email/:token` | Verify email address from link |
