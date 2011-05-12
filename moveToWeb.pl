#!/usr/bin/perl -w
# simple copy of a couple of components

use strict;
use warnings;
use File::Copy;



my $file = $ARGV[0];
if ($file !~ m/xpi/i) { die "'$file' is not a .xpi file"; }

# TODO: make this smarter, more parameterized
# exercise some perl knowledge....
# eg, have an ini-file that specifies what files to be moved
# extra params at run-time, etc.

# also, remember, this is an absolute path, because who know where these project are on YOUR system.....
my $dest = 'C:/www/skipscreen_web/install/';

print "name: $file\n";
print "copying all files to $dest\n\n";


my ($generic, $update);

if ($file =~ m/b/i) {
 $generic = 'skipscreen_beta.xpi';
 $update = 'skipscreen_beta_update.rdf';
} else {
  $generic = 'skipscreen_latest_self.xpi';
  $update = 'skipscreen_self_update.rdf';
}



# most recent for updating
copy $file, $dest.$file || die "couldn't copy $file: $!";
print "copied $file to $file\n";

# generic name for download links

copy $file, $dest.$generic  || die "couldn't copy $file (as $generic): $!";
print "copied $file to $generic\n";

# copy update
copy $update, $dest.$update  || die "couldn't copy $update: $!";
print "copied $update to $update\n";
