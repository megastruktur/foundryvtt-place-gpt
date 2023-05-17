#!/bin/bash

# CLI parameter should be OPENAI_TOKEN
# If not, exit
if [ -z "$1" ]
  then
    echo "No OPENAI_TOKEN supplied"
    exit 1
fi

OPENAI_TOKEN=$1

# Read the CHANGELOG.txt and take the first line. Thi is the VERSION
VERSION=$(head -n 1 CHANGELOG.txt)

# Create a directory releases/$VERSION
# Copy all files and directories to releases/$VERSION except .git and releases
mkdir -p releases/"$VERSION"
rsync -av --exclude='.git/*' --exclude='releases/*' --exclude='.*' --exclude='placegpt-build.sh' . releases/$VERSION

# Search string OPENAITEMPDEMO in releases/$VERSION/ai-classes/chatgpt-temporary-demo.js
# Replace it with the value $OPENAI_TOKEN
echo "Replacing the token in releases/${VERSION}/ai-classes/chatgpt-temporary-demo.js"
sed -i "s/OPENAITEMPDEMO/${OPENAI_TOKEN}/g" "releases/${VERSION}/ai-classes/chatgpt-temporary-demo.js"


#zip -r releases/place-gpt-${VERSION}.zip place-gpt -x ".*" ".git/*" "releases/*"

echo "Creating zip file"
cd releases
zip -r place-gpt-${VERSION}.zip ${VERSION}

echo "Done"