#!/bin/bash
# megacopy.sh -- moved specified mu script into the live SkipScreen content folder

ROOT=`pwd`
MEGA=/mega-scripts/
DEST=/content/
CAPTCHA=mega-captcha.js
# regular is both the name of the non-captcha version, and the host file w/in the extension
REGULAR=megaupload.js

if [ "$1" = "captcha" ]; then
    FILE=$CAPTCHA
elif [ "$1" = "non-captcha" ]; then
    FILE=$REGULAR
else
    echo "Must supply parameter! 'captcha' or 'normal' ...."
    echo "'$1' is not a valid parameter."
    exit;
fi


cp --verbose "$ROOT$MEGA$FILE" "$ROOT$DEST$REGULAR"
