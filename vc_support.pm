# Michael Paulukonis
# Nov 26, 2007

#package Cvs_Support; # commented out for the time-being, to keep things working....

# use strict;
use warnings;

use File::stat;
use Time::localtime;

# subs that replaced file-constants
# possible, local_dev and fw_test could remain constants
# however, PROJ_NAME should be stored over here

use constant ROOT => "c:\\Documents and Settings\\OtherMichael\\My Documents\\My Dropbox\\SkipScreen\\";

sub VC()  { return ROOT."skipscreen_extension\\" } ; # update to match local install

sub LIVE()    { return ROOT."SkipScreen_live\\" } ;

sub SNAPSHOT() { return ROOT };

sub PROJ_NAME()  { return "SkipScreen_Extension" }; #Update to match project


sub get_projectfiles {
  # list of project files (2-d array)
  # ["<sub-dir\\", "<filename.ext>"]

  my @list = (  ["",				 "build.sh"],
                ["",				 "build_check.sh"],
                ["",				 "chrome.manifest"],
                ["",				 "config_build.sh"],
                ["",				 "install.rdf"],
                ["",				 "license.txt"],
                ["",				 "megacopy.sh"],
                ["",				 "moveToWeb.pl"],
                ["",				 "notest_build.sh"],
                ["",				 "run_unit_tests.sh"],
                ["",				 "setVersion.pl"],
                ["",				 "skipscreen_beta_update.rdf"],
                ["",				 "skipscreen_self_update.rdf"],
                ["",				 "updateKey.pl"],
                ["",				 "updatekey.sh"],
                ["",				 "vc_utils.pl"],
                ["",				 "vc_support.pm"],

                # components has been deprecated (used for former zugo implementation)

                ["content\\",			 "about.xul"],
                ["",				 "auxilliary.js"],
                ["",				 "auxilliary.xul"],
                ["",				 "icon32.png"],
                ["",				 "jqDnR.js"],
                ["",				 "jquery-1.3.2.min.js"],
                ["",				 "megaupload.js"],
                ["",				 "options.xul"],
                ["",				 "prefman.js"],
                ["",				 "script-compiler-overlay.xul"],
                ["",				 "script-compiler.js"],
                ["",				 "skipscreen.js"],
                ["",				 "ss-popup.js"],
                ["",				 "ss-utilities.js"],
                ["",				 "xmlhttprequester.js"],

                ["content\\smartlinks\\",        "smartlinks.xul"],

                ["content\\searchbar\\",         "glass.png"],
                ["",				 "search_input_bg.png"],
                ["",				 "searchbar-init.js"],
                ["",				 "searchbar.js"],
                ["",				 "searchbar.css"],
                ["",				 "searchbar.xul"],
                ["",				 "skipscreen_bg.png"],
                ["",				 "skipscreen_Settings.png"],

                ["defaults\\preferences\\",      "skipscreen.js"],

                ["locale\\en-us\\",		 "about.dtd"],
                ["",				 "prefwindow.dtd"],

                ["mega-scripts\\",		 "mega-captcha.js"],
                ["",				 "megaupload.js"],

                ["skin\\",			 "prefwindow.css"],

                ["unit-tests\\",		 "jquery.js"],
                ["",				 "resources.css"],
                ["",				 "ss-unit-tests.js"],
                ["",				 "ss_unit_tests.html"],
                ["",				 "test.js"]

             );


  return @list;
}


1;  ## keep Perl compiler absurdly happy
