package services

import (
	"bytes"
	"context"
	"fmt"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/disintegration/imaging"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/minio/minio-go/v7"
	"github.com/minio/minio-go/v7/pkg/credentials"
	"github.com/opencode-ai/polaris/internal/model"
)

type MediaService struct {
	pg       *pgxpool.Pool
	minio    *minio.Client
	bucket   string
	endpoint string
}

func NewMediaService(pg *pgxpool.Pool) (*MediaService, error) {
	endpoint := lookupEnv("MINIO_ENDPOINT", "http://127.0.0.1:9000")
	accessKey := lookupEnv("MINIO_ACCESS_KEY", "tl-images")
	secretKey := lookupEnv("MINIO_SECRET_KEY", "27kCGLzoYXoqr74TyuWvUywlbgzqyw")
	bucket := lookupEnv("MINIO_BUCKET", "threadlight-images")

	client, err := minio.New(endpoint, &minio.Options{
		Creds:  credentials.NewStaticV4(accessKey, secretKey, ""),
		Secure: false,
	})
	if err != nil {
		return nil, fmt.Errorf("media_service: failed to create minio client: %w", err)
	}

	return &MediaService{pg: pg, minio: client, bucket: bucket, endpoint: endpoint}, nil
}

func lookupEnv(key, fallback string) string {
	if val := os.Getenv(key); val != "" {
		return val
	}
	return fallback
}

// MinioClient returns the underlying MinIO client for health checks.
func (s *MediaService) MinioClient() *minio.Client {
	return s.minio
}

// UploadImage uploads a file to MinIO with image optimization:
// - Resizes images wider than 1920px to 1920px (preserving aspect ratio)
// - Compresses JPEG/PNG to 85% quality
// - Generates a 150x150 thumbnail for use as avatars
// Records the media metadata in the database and returns the stored Media object.
func (s *MediaService) UploadImage(ctx context.Context, uploaderID int64, file multipart.File, header *multipart.FileHeader) (*model.Media, error) {
	// Read the entire file into memory for processing
	var buf bytes.Buffer
	if _, err := io.Copy(&buf, file); err != nil {
		return nil, fmt.Errorf("media_service: failed to read file: %w", err)
	}
	fileBytes := buf.Bytes()

	ext := strings.ToLower(filepath.Ext(header.Filename))
	mimeType := header.Header.Get("Content-Type")

	// Process image if it's a supported format
	var processedBytes []byte
	var thumbnailBytes []byte
	width, height := 0, 0
	var thumbObjectName string

	mimeType, processedBytes, thumbnailBytes, width, height, err := s.processImage(fileBytes, mimeType, ext)
	if err != nil {
		// If processing fails, use the original bytes
		processedBytes = fileBytes
	}

	// Generate a unique object path
	objectName := fmt.Sprintf("uploads/%d/%s%s", uploaderID, time.Now().Format("20060102150405"), ext)

	// Upload processed image to MinIO
	_, err = s.minio.PutObject(ctx, s.bucket, objectName, bytes.NewReader(processedBytes), int64(len(processedBytes)), minio.PutObjectOptions{
		ContentType: mimeType,
	})
	if err != nil {
		return nil, fmt.Errorf("media_service: failed to upload to minio: %w", err)
	}

	// Upload thumbnail if generated
	if thumbnailBytes != nil {
		thumbExt := ext
		if thumbExt == "" {
			thumbExt = ".jpg"
		}
		thumbObjectName = fmt.Sprintf("uploads/%d/%s_thumb%s", uploaderID, time.Now().Format("20060102150405"), thumbExt)
		_, err = s.minio.PutObject(ctx, s.bucket, thumbObjectName, bytes.NewReader(thumbnailBytes), int64(len(thumbnailBytes)), minio.PutObjectOptions{
			ContentType: mimeType,
		})
		if err != nil {
			// Thumbnail upload failure is non-fatal
			thumbObjectName = ""
		}
	}

	// Record in database
	media := &model.Media{}
	err = s.pg.QueryRow(ctx,
		`INSERT INTO media (uploader_id, file_path, original_name, mime_type, file_size, width, height)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)
		 RETURNING id, post_id, uploader_id, file_path, original_name, mime_type, file_size, width, height, created_at`,
		uploaderID, objectName, header.Filename, mimeType, int64(len(processedBytes)), width, height,
	).Scan(&media.ID, &media.PostID, &media.UploaderID, &media.FilePath,
		&media.OriginalName, &media.MimeType, &media.FileSize, &media.Width, &media.Height, &media.CreatedAt)
	if err != nil {
		return nil, fmt.Errorf("media_service: failed to insert media record: %w", err)
	}

	media.ThumbnailPath = thumbObjectName

	return media, nil
}

// processImage decodes, resizes (if >1920px), compresses, and generates a thumbnail.
// Returns the processed image bytes, thumbnail bytes, actual mime type, dimensions, and any error.
func (s *MediaService) processImage(data []byte, mimeType, ext string) (string, []byte, []byte, int, int, error) {
	// Try to decode the image
	src, err := imaging.Decode(bytes.NewReader(data), imaging.AutoOrientation(true))
	if err != nil {
		return mimeType, data, nil, 0, 0, fmt.Errorf("cannot decode image: %w", err)
	}

	bounds := src.Bounds()
	origWidth := bounds.Dx()
	origHeight := bounds.Dy()

	// Resize if wider than 1920px (preserve aspect ratio)
	var processed image.Image
	if origWidth > 1920 {
		newHeight := int(float64(origHeight) * (1920.0 / float64(origWidth)))
		processed = imaging.Resize(src, 1920, newHeight, imaging.Lanczos)
	} else {
		processed = src
	}

	// Update dimensions after resize
	resizedBounds := processed.Bounds()
	width := resizedBounds.Dx()
	height := resizedBounds.Dy()

	// Encode processed image at 85% quality
	processedBytes, err := encodeImage(processed, ext, 85)
	if err != nil {
		return mimeType, data, nil, width, height, fmt.Errorf("encode processed image: %w", err)
	}

	// Generate 150x150 thumbnail
	thumb := imaging.Fit(processed, 150, 150, imaging.Lanczos)
	thumbnailBytes, err := encodeImage(thumb, ext, 80)
	if err != nil {
		thumbnailBytes = nil // thumbnail generation is best-effort
	}

	// Determine actual mime type
	if mimeType == "" || mimeType == "application/octet-stream" {
		switch ext {
		case ".jpg", ".jpeg":
			mimeType = "image/jpeg"
		case ".png":
			mimeType = "image/png"
		case ".gif":
			mimeType = "image/gif"
		case ".webp":
			mimeType = "image/webp"
		}
	}

	return mimeType, processedBytes, thumbnailBytes, width, height, nil
}

// encodeImage encodes an image to JPEG or PNG at the specified quality.
func encodeImage(img image.Image, ext string, quality int) ([]byte, error) {
	var buf bytes.Buffer

	switch ext {
	case ".png":
		// PNG doesn't support quality in the standard encoder; use default compression
		enc := &png.Encoder{CompressionLevel: png.DefaultCompression}
		if err := enc.Encode(&buf, img); err != nil {
			return nil, err
		}
	case ".jpg", ".jpeg":
		fallthrough
	default:
		if err := jpeg.Encode(&buf, img, &jpeg.Options{Quality: quality}); err != nil {
			return nil, err
		}
	}

	return buf.Bytes(), nil
}

// GetImageURL returns the public URL for an image.
func (s *MediaService) GetImageURL(ctx context.Context, mediaID int64) (string, error) {
	var filePath string
	err := s.pg.QueryRow(ctx,
		`SELECT file_path FROM media WHERE id = $1`, mediaID,
	).Scan(&filePath)
	if err != nil {
		return "", fmt.Errorf("media_service: media not found: %w", err)
	}

	// Construct a direct MinIO URL
	baseURL := strings.TrimSuffix(s.endpoint, "/")
	return fmt.Sprintf("%s/%s/%s", baseURL, s.bucket, filePath), nil
}

// GetThumbnailURL returns the public URL for an image's thumbnail.
func (s *MediaService) GetThumbnailURL(ctx context.Context, mediaID int64) (string, error) {
	var filePath string
	err := s.pg.QueryRow(ctx,
		`SELECT file_path FROM media WHERE id = $1`, mediaID,
	).Scan(&filePath)
	if err != nil {
		return "", fmt.Errorf("media_service: media not found: %w", err)
	}

	// Construct thumbnail path and URL
	ext := filepath.Ext(filePath)
	thumbPath := strings.TrimSuffix(filePath, ext) + "_thumb" + ext
	baseURL := strings.TrimSuffix(s.endpoint, "/")
	return fmt.Sprintf("%s/%s/%s", baseURL, s.bucket, thumbPath), nil
}

// LinkImageToPost associates a media item with a post.
func (s *MediaService) LinkImageToPost(ctx context.Context, mediaID, postID int64) error {
	_, err := s.pg.Exec(ctx,
		`UPDATE media SET post_id = $1 WHERE id = $2`,
		postID, mediaID)
	if err != nil {
		return fmt.Errorf("media_service: failed to link image to post: %w", err)
	}
	return nil
}

// GetPostImages returns all images for a post.
func (s *MediaService) GetPostImages(ctx context.Context, postID int64) ([]model.Media, error) {
	rows, err := s.pg.Query(ctx,
		`SELECT id, post_id, uploader_id, file_path, original_name, mime_type,
		        file_size, width, height, created_at
		 FROM media WHERE post_id = $1
		 ORDER BY created_at DESC`, postID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var images []model.Media
	for rows.Next() {
		var m model.Media
		if err := rows.Scan(&m.ID, &m.PostID, &m.UploaderID, &m.FilePath,
			&m.OriginalName, &m.MimeType, &m.FileSize, &m.Width, &m.Height, &m.CreatedAt); err != nil {
			return nil, err
		}
		images = append(images, m)
	}
	return images, nil
}
