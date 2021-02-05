.PHONY: %

dev:
	docker-compose up -d
	make install
	make db-migrate
	make seed
	make logs

test:
	docker-compose run fapinstructor-api yarn test

test-watch:
	docker-compose run fapinstructor-api yarn test --watch

build:
	docker-compose build

logs:
	docker logs -f fapinstructor-api | npx pino-pretty

down:
	docker-compose down	

db-migrate:
	docker-compose run fapinstructor-api yarn db-migrate

seed:
	docker-compose run fapinstructor-api yarn db-seed

db-rollback:
	docker-compose run fapinstructor-api yarn db-rollback 

db-reset:
	docker-compose run fapinstructor-api yarn db-rollback --all
	make db-migrate
	make seed

# Syntax: make db-migrate-create NAME=MIGRATION_NAME
db-migrate-create:
	docker-compose run fapinstructor-api yarn db-migrate-make $(NAME)

install:
	docker-compose run -u root fapinstructor-api yarn 

# Run a npx command
# Syntax: make npx RUN="command params" 
npx:
	docker-compose run fapinstructor-api npx $(RUN)
