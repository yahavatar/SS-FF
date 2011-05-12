#!/bin/bash
# Build config for build.sh
APP_NAME=skipscreen
CHROME_PROVIDERS="content locale skin"
CLEAN_UP=1
ROOT_FILES=
ROOT_DIRS="defaults"
BEFORE_BUILD=build_check.sh
VERSION=`grep -w "\(&\|em:\)version" install.rdf | sed -e "s/<em:version>//g;s/<\/em:version>//g;s/ //g"`
BUILDNAME=$APP_NAME"_"$VERSION.xpi
AFTER_BUILD=updatekey.sh" "-v" "$VERSION" "-b" "$BUILDNAME