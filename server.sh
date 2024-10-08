#!/bin/sh

set -e

# get secret key from .secret42.txt
KEY=$(<.secret42.txt)

# connect to server with ssh
# $SSH_USER, $SSH_HOST, $ENV_VAR, $ENV_PATH, $REBOOT_CMD
# develop server
echo "dev server updating..."
ssh ec2-user@ec2-3-37-139-62.ap-northeast-2.compute.amazonaws.com << EOF
	sed -i 's|LOGIN_42_API_SECRET=.*|LOGIN_42_API_SECRET=\"$KEY\"|' ./deploy/.env-node
	cd ./deploy && docker-compose up -d --build
EOF
echo "dev server complete"

sleep 5

# deploy server
echo "deploy server updating..."
ssh admin@ec2-43-202-131-46.ap-northeast-2.compute.amazonaws.com << EOF
	sed -i 's|LOGIN_42_API_SECRET=.*|LOGIN_42_API_SECRET=\"$KEY\"|' ./deploy/.env-node
	cd ./deploy && docker-compose up -d --build
EOF
echo "deploy server complete"