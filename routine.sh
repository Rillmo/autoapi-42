#!/bin/sh

source .env

# crawling 42intra
echo "start crawling 42intra..."
node crawling.js
if [ ! -f ./.secret42.txt ]; then
	echo "[ERROR] crawling error...quit"
	exit 1
fi
echo "finished crawling!"

# apply secret to server's .env
echo "start applying secret to server's .env"
/bin/sh server.sh
echo "finished applying"

# delete .secret42.txt
echo "delete secret file from host"
rm .secret42.txt
echo "deleted"

echo "routine complete"

