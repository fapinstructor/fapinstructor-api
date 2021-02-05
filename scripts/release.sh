#!/bin/sh

GROUP="fapinstructor"

TASK_DEFINITION_NAME="$GROUP-api"
SERVICE_DESIRED_COUNT=1
DB_TASK_DEFINITION="arn:aws:ecs:$AWS_DEFAULT_REGION:$AWS_ACCOUNT_ID:task-definition/$GROUP"
MIGRATE_TASKDEF="$DB_TASK_DEFINITION-db-migrate"
SEED_TASKDEF="$DB_TASK_DEFINITION-db-seed"
ECS_CLUSTER="$GROUP"
ECS_SERVICE="$GROUP-api"
ECR_REPOSITORY="$GROUP-api"
IMAGE_TAG="latest"

# Environment Variable Checks
if [ -z "$AWS_ACCOUNT_ID" ]
then
  echo "\$AWS_ACCOUNT_ID is NULL"
  exit 1
fi 

if [ -z "$AWS_ACCESS_KEY_ID" ]
then
  echo "\$AWS_ACCESS_KEY_ID is NULL"
  exit 1
fi 

if [ -z "$AWS_SECRET_ACCESS_KEY" ]
then
  echo "\$AWS_SECRET_ACCESS_KEY is NULL"
  exit 1
fi 

if [ -z "$AWS_DEFAULT_REGION" ]
then
  echo "\$AWS_DEFAULT_REGION is NULL"
  exit 1
fi 

echo "Logging in to ECR"
$(aws ecr get-login --no-include-email --region ${AWS_DEFAULT_REGION})

echo "Building docker image $ECR_REPOSITORY:$IMAGE_TAG"
docker build --tag $ECR_REPOSITORY:$IMAGE_TAG .

echo "Pushing docker image to ECR repository"
docker tag $ECR_REPOSITORY:$IMAGE_TAG $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG
DOCKER_PUSH=$(docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_DEFAULT_REGION.amazonaws.com/$ECR_REPOSITORY:$IMAGE_TAG)
DOCKER_PUSH_EXIT_CODE=$?

if ! [ "$DOCKER_PUSH_EXIT_CODE" -eq 0 ]
then
  echo "Docker push failed, status: $DOCKER_PUSH_EXIT_CODE"
  exit 1
fi

echo "Executing database migrations script"
./scripts/db-migrate.sh $ECS_CLUSTER $MIGRATE_TASKDEF
MIGRATE_EXIT_CODE=$?

if ! [ "$MIGRATE_EXIT_CODE" -eq 0 ]
then
  echo "Migrations script failed with exit code $MIGRATE_EXIT_CODE"
  echo "Aborting deployment"
  exit 1
fi

echo "Executing database seed script"
./scripts/db-seed.sh $ECS_CLUSTER $SEED_TASKDEF
SEED_EXIT_CODE=$?

if ! [ "$SEED_EXIT_CODE" -eq 0 ]
then
  echo "Seed script failed with exit code $SEED_EXIT_CODE"
  echo "Aborting deployment"
  exit 1
fi

echo "Updating ECS service with new deployment"
UPDATE_SERVICE=$(aws ecs update-service \
                    --service $ECS_SERVICE \
                    --cluster $ECS_CLUSTER \
                    --desired-count $SERVICE_DESIRED_COUNT \
                    --region $AWS_DEFAULT_REGION \
                    --force-new-deployment)
UPDATE_SERVICE_EXIT_CODE=$?

if ! [ "$UPDATE_SERVICE_EXIT_CODE" -eq 0 ]
then
  echo "ECS service update failed, status: $UPDATE_SERVICE_EXIT_CODE"
  exit 1
fi

echo "ECS service updated successfully"
exit 0