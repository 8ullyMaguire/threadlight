package api

// PaginatedResponse wraps a list of items with pagination metadata.
type PaginatedResponse struct {
	Data    interface{} `json:"data"`
	Page    int         `json:"page"`
	Limit   int         `json:"limit"`
	Total   int         `json:"total"`
	HasMore bool        `json:"has_more"`
}

// NewPaginated creates a PaginatedResponse.
// page and limit are 1-based: page=1 means the first page.
func NewPaginated(data interface{}, page, limit, total int) PaginatedResponse {
	hasMore := (page * limit) < total
	return PaginatedResponse{
		Data:    data,
		Page:    page,
		Limit:   limit,
		Total:   total,
		HasMore: hasMore,
	}
}
