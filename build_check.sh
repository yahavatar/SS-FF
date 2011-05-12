#!/bin/bash

# output potential removables
#       present existing versions (in all locations - install.rdf and about.xul, or about.dtd?)
#       possibly prompt for a new version?
echo -e "Note the following: \n"
grep -n -w '\(&\|em:\)version' content/about.xul install.rdf 
echo -e "\n"
grep -n -w 'TODO:' content/skipscreen.js
echo -e "\n"
grep -n -w 'alert' content/skipscreen.js
# echo -e -n "\n Okay to proceed (Y/N) ? "
# read -e goahead
# if [ $goahead != "Y" ]
# then
#     echo -e "\nGo fix it!!!\n"
#     exit;
# fi
# echo -e "\nYou were warned!\n"

# TODO: duh, if sep script execution will not quit -- passes back to parent script