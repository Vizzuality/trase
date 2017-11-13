#!/bin/bash
ENV_TYPE=$1
ENV_FILE=".env.$ENV_TYPE"

if [ -f "$ENV_FILE" ]
then
  echo "env file found."
else
  echo "$ENV_FILE not found."
  exit
fi

if test "$ENV_TYPE" = "production"
then
  SERVER_URL='trase.earth'
else
  SERVER_URL="${ENV_TYPE}.trase.earth"
fi

echo "DEPLOYING:  $ENV_TYPE ($SERVER_URL)"

read -p "Press enter to continue"

# use correct env file, keep current local env as tmp
cp .env .env.tmp
cp $ENV_FILE .env

# clean up dist and build
rm -rf dist
npm run build

# retrieve local env
cp .env.tmp .env
rm .env.tmp

# clean up remote
ssh ubuntu@$SERVER_URL 'rm -r /var/www/html/*'

# copy built files
scp -pr ./dist/* ubuntu@$SERVER_URL:/var/www/html/
