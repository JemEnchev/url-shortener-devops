FROM postgres:16-alpine

WORKDIR /migrations
COPY ../migrations ./migrations

CMD ["sh", "-c", "echo 'Use docker compose run migrator'"]
