package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/opencode-ai/polaris/internal/model"
	"github.com/opencode-ai/polaris/internal/services"
)

type ReportHandler struct {
	reportSvc *services.ReportService
}

func NewReportHandler(reportSvc *services.ReportService) *ReportHandler {
	return &ReportHandler{reportSvc: reportSvc}
}

type createReportRequest struct {
	PostID   int64  `json:"post_id" binding:"required"`
	Category int16  `json:"category" binding:"required"`
	Reason   string `json:"reason" binding:"required"`
}

type resolveReportRequest struct {
	Status int16 `json:"status" binding:"required"`
}

// @Summary      Create a report
// @Description  Report a post for moderation review
// @Tags         reports
// @Param        body body createReportRequest true "Report details"
// @Success      201 {object} model.PostReport
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /reports [post]
func (h *ReportHandler) Create(c *gin.Context) {
	var req createReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	uid, _ := c.Get("user_id")
	reporterID := uid.(int64)

	report := model.PostReport{
		PostID:     req.PostID,
		ReporterID: reporterID,
		Category:   req.Category,
		Reason:     req.Reason,
	}

	created, err := h.reportSvc.CreateReport(c.Request.Context(), report)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, created)
}

// @Summary      List reports
// @Description  List all reports for moderation
// @Tags         reports
// @Success      200 {object} []model.PostReport
// @Failure      401 {object} map[string]interface{}
// @Router       /reports [get]
func (h *ReportHandler) List(c *gin.Context) {
	reports, err := h.reportSvc.ListReports(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	if reports == nil {
		reports = []model.PostReport{}
	}
	c.JSON(http.StatusOK, model.NewPaginated(reports, 1, len(reports), len(reports)))
}

// @Summary      Get a report
// @Description  Get a single report by ID
// @Tags         reports
// @Param        id path int true "Report ID"
// @Success      200 {object} model.PostReport
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Failure      404 {object} map[string]interface{}
// @Router       /reports/{id} [get]
func (h *ReportHandler) Get(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid report id"})
		return
	}

	report, err := h.reportSvc.GetReport(c.Request.Context(), id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "report not found"})
		return
	}
	c.JSON(http.StatusOK, report)
}

// @Summary      Resolve a report
// @Description  Resolve a report with a given status
// @Tags         reports
// @Param        id path int true "Report ID"
// @Param        body body resolveReportRequest true "Resolution status"
// @Success      200 {object} map[string]interface{}
// @Failure      400 {object} map[string]interface{}
// @Failure      401 {object} map[string]interface{}
// @Router       /reports/{id}/resolve [put]
func (h *ReportHandler) Resolve(c *gin.Context) {
	id, err := strconv.ParseInt(c.Param("id"), 10, 64)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid report id"})
		return
	}

	var req resolveReportRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	uid, _ := c.Get("user_id")
	resolvedBy := uid.(int64)

	if err := h.reportSvc.ResolveReport(c.Request.Context(), id, req.Status, resolvedBy); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "report resolved"})
}
