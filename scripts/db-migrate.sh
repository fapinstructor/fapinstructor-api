#!/bin/sh

CLUSTER=$1
TASKDEF=$2

# Parameter checks
if [ -z "$CLUSTER" ]
then
  echo "\$CLUSTER is NULL"
  exit 1
fi 

if [ -z "$TASKDEF" ]
then
  echo "\$TASKDEF is NULL"
  exit 1
fi 

# Environment Variable Checks
if [ -z "$DB_TASK_SUBNETS" ]
then
  echo "\$DB_TASK_SUBNETS is NULL"
  exit 1
fi 

if [ -z "$DB_TASK_SECURITY_GROUPS" ]
then
  echo "\$DB_TASK_SECURITY_GROUPS is NULL"
  exit 1
fi 

NETWORK_CONFIG="awsvpcConfiguration={subnets=[$DB_TASK_SUBNETS],securityGroups=[$DB_TASK_SECURITY_GROUPS],assignPublicIp=ENABLED}"

echo "Running migrations ECS task"
RUN_TASK=$(aws ecs run-task \
            --cluster $CLUSTER \
            --launch-type FARGATE \
            --task-definition $TASKDEF \
            --network-configuration $NETWORK_CONFIG \
            --output json)

FAILURES=$(echo $RUN_TASK | jq '.failures|length')

if [ "$FAILURES" -eq 0 ]
then
  TASK_ARN=$(echo $RUN_TASK | jq '.tasks[0].taskArn' | sed -e 's/^"//' -e 's/"$//')

  echo "Waiting for migrations task to stop..."
  aws ecs wait tasks-stopped --tasks "$TASK_ARN" --cluster $CLUSTER --output json 2>/dev/null
  WAITER_EXIT_CODE=$?
  echo "Migration task has stopped"

  if [ "$WAITER_EXIT_CODE" -eq 0 ]
  then
    DESCRIBE_TASKS=$(aws ecs describe-tasks \
                    --tasks $TASK_ARN \
                    --cluster $CLUSTER \
                    --output json)
    DESCRIBE_TASKS_EXIT_CODE=$(echo $DESCRIBE_TASKS | jq '.tasks[0].containers[0].exitCode')

    if [ "$DESCRIBE_TASKS_EXIT_CODE" -eq 0 ]
    then
      echo "Migration task exited successfully"
    else
      echo "Migration task failed: $DESCRIBE_TASKS"
      exit 1
    fi
  elif [ "$WAITER_EXIT_CODE" -eq 255 ]
  then
    echo "Migration task waiter timed out, status: 255"
    exit 1
  else
    echo "Migration task waiter failed, status: $WAITER_EXIT_CODE"
    exit 1
  fi
else
  FAILURE_REASON=$(echo $RUN_TASK | jq -r '.failures[0].reason')
  echo "Migration task failed: $FAILURE_REASON"
  exit 1
fi