# syntax=docker/dockerfile:1
FROM golang:1.23-alpine AS builder
RUN apk add --no-cache nodejs npm
WORKDIR /build
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -buildvcs=false -o /polaris ./cmd/polaris
RUN cd web && npm install && npm run build && cd ..

FROM alpine:3.19
RUN apk add --no-cache ca-certificates
COPY --from=builder /polaris /usr/local/bin/polaris
COPY --from=builder /build/web/dist /var/www/polaris
COPY --from=builder /build/docs/book /opt/polaris/docs
EXPOSE 8080
CMD ["polaris"]
