# build stage
FROM golang AS builder

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build

# serve stage
FROM alpine

RUN apk --no-cache add ca-certificates

COPY --from=builder /app/api /app/

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.5.0/wait /wait
RUN chmod +x /wait

EXPOSE 3000
ENTRYPOINT /wait && /app/api 
