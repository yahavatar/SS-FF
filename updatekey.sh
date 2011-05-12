#!/bin/bash

# four branches
#
# s  : self
# bs : beta-self
# ba : beta-amo
# a  : amo

# if $VERSION contains s or bs

#VERSION=0.3.3bs

VERSION=
BUILDNAME=
while getopts 'v:b::' OPTION
do
  case $OPTION in
  v)    VERSION="$OPTARG"
        ;;
  b)    BUILDNAME="$OPTARG"
        ;;
  ?)    printf "Usage: %s: [-v version] [-b buildname] \n" $(basename $0) >&2
        exit 2
        ;;
  esac
done


echo "buildname = "$BUILDNAME
echo "version = "$VERSION

shopt -s extglob
if [[ "${VERSION}" == *@(s|bs|ba) ]] #only update for self and beta-self branches
then
    echo "updating the key....."
    updateKey.pl $BUILDNAME
else
    echo "no update-key for version ${VERSION}"
fi
