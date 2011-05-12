#!/bin/bash
# build.sh -- builds JAR and XPI files for mozilla extensions
#   by Nickolay Ponomarev <asqueella@gmail.com>
#   (original version based on Nathan Yergler's build script)
# Most recent version is at <http://kb.mozillazine.org/Bash_build_script>

# This script assumes the following directory structure:
# ./
#   chrome.manifest (optional - for newer extensions)
#   install.rdf
#   (other files listed in $ROOT_FILES)
#
#   content/    |
#   locale/     |} these can be named arbitrary and listed in $CHROME_PROVIDERS
#   skin/       |
#
#   defaults/   |
#   components/ |} these must be listed in $ROOT_DIRS in order to be packaged
#   ...         |
#
# It uses a temporary directory ./build when building; don't use that!
# Script's output is:
# ./$APP_NAME.xpi
# ./$APP_NAME.jar  (only if $KEEP_JAR=1)
# ./files -- the list of packaged files
#
# Note: It modifies chrome.manifest when packaging so that it points to
#       chrome/$APP_NAME.jar!/*

#
# default configuration file is ./config_build.sh, unless another file is
# specified in command-line. Available config variables:
APP_NAME=          # short-name, jar and xpi files name. Must be lowercase with no spaces
CHROME_PROVIDERS=  # which chrome providers we have (space-separated list)
CLEAN_UP=          # delete the jar / "files" when done?       (1/0)
ROOT_FILES=        # put these files in root of xpi (space separated list of leaf filenames)
ROOT_DIRS=         # ...and these directories       (space separated list)
BEFORE_BUILD=      # run this before building       (bash command)
AFTER_BUILD=       # ...and this after the build    (bash command)
VERSION=
BUILDNAME=

#uncomment to debug
#set -x

# the following are required for zugo-tools:
#  /components (entire directory, and the only item that uses is)
#  /skin
#    zugoDisclosure.png
#    zugoNotice.css

# to optionally include zugo, we need to EXCLUDE those items under other conditions
# hrm......


# build file will determine app name, for instanc

if [ -z $1 ]; then
    . ./config_build.sh
else
    . $1
fi

if [ -z $APP_NAME ]; then
    echo "You need to create build config file first!"
    echo "Read comments at the beginning of this script for more info."
    exit;
fi

ROOT_DIR=`pwd`
TMP_DIR=build


# remove any left-over files from previous build
rm -f $APP_NAME.jar $APP_NAME.xpi $BUILDNAME files
rm -rf $TMP_DIR

$BEFORE_BUILD

echo "Buildname: $BUILDNAME"

echo -e -n "\n Okay to proceed (Y/N) ? "
read -e goahead
#if [ /I $goahead != "Y" ]
shopt -s nocaseglob
if [[ "$goahead" != "y" && "$goahead" != "Y" ]]
then
    echo -e "\nGo fix it!!!\n"
    exit;
fi
echo -e "\nYou were warned!\n"




mkdir --parents --verbose $TMP_DIR/chrome

# generate the JAR file, excluding SVN and temporary files
JAR_FILE=$TMP_DIR/chrome/$APP_NAME.jar
echo "Generating $JAR_FILE..."
for CHROME_SUBDIR in $CHROME_PROVIDERS; do

    # EXLCLUDE searchbar and smartlinks
    #find $CHROME_SUBDIR \( -path '*searchbar*' -o -path '*smartlinks*' -o -iname zugo* \) -prune -o -type f \( ! -iname "*.cache" \) -print | grep -v \~ >> files

    # INCLUDE smartlinks EXCLUDE searchbar
    find $CHROME_SUBDIR \( -path '*searchbar*' -o -iname zugo* \) -prune -o -type f \( ! -iname "*.cache" \) -print | grep -v \~ >> files
done

zip -0 -r $JAR_FILE `cat files`
# The following statement should be used instead if you don't wish to use the JAR file
#cp --verbose --parents `cat files` $TMP_DIR/chrome

# prepare components and defaults
echo "Copying various files to $TMP_DIR folder..."
for DIR in $ROOT_DIRS; do
    # zugo-files are NEVER included, at this point, as they are installed separately
    # however, the files still exist in version control as examples, so let's continue to not include them in build

    # FILES="`find $DIR -path '*svn*' -prune -o -name 'zugo*' -prune -o -type f \( ! -iname \"*.cache\" \) -print | grep -v \~`"
    # searchbar and smartlinks need to be parameters.... oh, well, in time....

    # next line EXCLUDES searchbar and smartlinks
    #FILES="`find $DIR \( -path '*searchbar*' -o -path '*smartlinks*' -o -name 'zugo*' \) -prune -o -type f \( ! -iname \"*.cache\" \) -print | grep -v \~`"

    # next line INCLUDES searchbar EXCLUDES smartlinks
    FILES="`find $DIR \( -path '*searchbar*' -o -name 'zugo*' \) -prune -o -type f \( ! -iname \"*.cache\" \) -print | grep -v \~`"
    if [ ! -z $FILES ]; then # only create and populate if a result-set is returned for find
	mkdir $TMP_DIR/$DIR
	echo $FILES >> files
	cp --verbose --parents $FILES $TMP_DIR
    fi
done

# Copy other files to the root of future XPI.
for ROOT_FILE in $ROOT_FILES install.rdf chrome.manifest license.txt; do
    cp --verbose $ROOT_FILE $TMP_DIR
    if [ -f $ROOT_FILE ]; then
	echo $ROOT_FILE >> files
    fi
done

cd $TMP_DIR

if [ -f "chrome.manifest" ]; then
    echo "Preprocessing chrome.manifest..."
  # You think this is scary?
  #s/^(content\s+\S*\s+)(\S*\/)$/\1jar:chrome\/$APP_NAME\.jar!\/\2/
  #s/^(skin|locale)(\s+\S*\s+\S*\s+)(.*\/)$/\1\2jar:chrome\/$APP_NAME\.jar!\/\3/
  #
  # Then try this! (Same, but with characters escaped for bash :)
    sed -i -r s/^\(content\\s+\\S*\\s+\)\(\\S*\\/\)$/\\1jar:chrome\\/$APP_NAME\\.jar!\\/\\2/ chrome.manifest
    sed -i -r s/^\(skin\|locale\)\(\\s+\\S*\\s+\\S*\\s+\)\(.*\\/\)$/\\1\\2jar:chrome\\/$APP_NAME\\.jar!\\/\\3/ chrome.manifest

  # (it simply adds jar:chrome/whatever.jar!/ at appropriate positions of chrome.manifest)
fi

# generate the XPI file
echo "Generating $BUILDNAME..."
zip -r ../$BUILDNAME *

cd "$ROOT_DIR"

echo "Cleanup..."
if [ $CLEAN_UP = 0 ]; then
  # save the jar file
    mv $TMP_DIR/chrome/$APP_NAME.jar .
else
    rm ./files
fi

# remove the working files
rm -rf $TMP_DIR
echo "Done!"

$AFTER_BUILD
