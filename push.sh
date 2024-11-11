#!/bin/bash

export YARN=/usr/local/bin/yarn
export USER=ubuntu
export HOST=abide.etherfirma.com
export DEST=/var/www/abide-admin
export SCP=/usr/bin/scp

echo "$YARN builld"
echo "$SCP -r build/{*.ico,*.json,*.html,static} $USER@$HOST:$DEST"

$YARN build \
      && $SCP -r build/{*.ico,*.json,*.html,static} $USER@$HOST:$DEST

# EOF
