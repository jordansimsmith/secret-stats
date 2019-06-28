# build stage
FROM golang AS builder

WORKDIR /app

COPY api/go.mod .
COPY api/go.sum .

RUN go mod download

COPY api/. .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build

# serve stage
FROM alpine

COPY --from=builder /app/api /app/

EXPOSE 3000
ENTRYPOINT ["/app/api"]
