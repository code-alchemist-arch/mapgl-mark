#!/bin/zsh

FOLDER_PATH="dist"

ENV="${1:-dev}"
if [ -z "$ENV" ]; then
    echo "no env specified"
fi

# build folder path
ENV_PREFIX="$ENV."
if [ "$ENV" = "prod" ]; then
    ENV_PREFIX=""
fi
ENV_PREFIX=""

REMOTE_PATH="/var/www/${ENV_PREFIX}youchoose.space"
echo "deploy to $REMOTE_PATH"

# build and deploy standalone
npm run build
build_result=$?

if [[ $build_result -eq 1 ]]; then
    exit 1
fi

# delete and create directory
ssh root@eventually.io "rm -r $REMOTE_PATH 2>/dev/null"
ssh root@eventually.io "mkdir -p $REMOTE_PATH"
scp -r ./$FOLDER_PATH/* root@eventually.io:$REMOTE_PATH

echo "deployed to: https://${ENV_PREFIX}youchoose.space"

rm -r ./$FOLDER_PATH
