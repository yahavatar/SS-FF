#!/usr/bin/perl -w
# http://www.borngeek.com/samples/toolbar-tutorial/build_script.txt
# http://www.borngeek.com/firefox/toolbar-tutorial/chapter-7/
#
# Modified August 2009
# Michael Paulukonis
# I'm using the Mozilla-provided bash build script
# and keeping the version components from here

use strict;
use warnings;
use Cwd;
use File::Basename;
use File::Copy;
use Getopt::Long;

# An array of relative file paths in which a version number should be updated
my @VERSION_FILES = qw/content\/about.xul content\/auxilliary.js install.rdf skipscreen_self_update.rdf skipscreen_beta_update.rdf/;

my $version = '';

GetOptions("version=s" => \$version,
	   "help" => sub { usageMessage() });

print "+--------------------------------+\n";
print "| Firefox Extension Build Script |\n";
print "| Written by Jonah Bishop        |\n";
print "+--------------------------------+\n";

my $homeDir = getcwd();

if (!$version) {
  print "Skipping version update.\n";
} else {
  updateVersion();
}

sub parseVersionFile  {
  my $filename = shift;

  open INPUT, "< $filename" or die "Cannot open input ($filename): $!";
  my @lines = <INPUT>;
  close INPUT;

  open OUTPUT, "> new_$filename" or die "Cannot open output (new_$filename): $!";

  foreach my $statement (@lines) {
    chomp $statement;
    if ($statement =~ m/^(\s*?)<em:version>/) {
      my $whitespace = $1;
      print OUTPUT "$whitespace<em:version>$version</em:version>\n";
      # value="&version; 0.1.08302009"
    } elsif ($statement =~ m/value="&version; [0-9\.]+.*?"/) {
      $statement =~ s/value="[^"]+?"/value="&version; $version"/;
      print OUTPUT "$statement\n";
    } elsif ($statement =~ m/^(\s*?)<version>/) {
      my $whitespace = $1;
      print OUTPUT "$whitespace<version>$version</version>\n";
    } elsif ($statement =~ m/^(\s*?)<updateLink>.*/) {
      # <updateLink>https://www.skipscreen.com/install/SkipScreen_0.3.20091018_beta.xpi</updateLink>
      my $whitespace = $1;
      print OUTPUT "$whitespace<updateLink>https://www.skipscreen.com/install/skipscreen_$version.xpi</updateLink>\n";
    } elsif ($statement =~ m/^(\s*?)var newPage =/) {
      # must be auxialliary.js
      my $whitespace = $1;
      my $root = 'var newPage = "http://www.skipscreen.com';
      my $var = '';
      my $finish = '?ver=" + current;';

      if ($version =~ m/b/i) {
	# if ANY beta, then install/whatsnew_beta.html
	$var = '/install/whatsnew_beta.html';
      } elsif ($version =~ m/s$/i) {
	# if self, then install/whatsnew_self.html
	$var = '/install/whatsnew_self.html';
      } else {
	# if amo, then whatsnew.html
	$var = '/whatsnew.html';
      }

      print OUTPUT $whitespace.$root.$var.$finish."\n";

    } elsif ($statement =~ m/something-else/) {
      # TODO: implement fix for post-download params
    } else {
      print OUTPUT "$statement\n";
    }
  }

  close OUTPUT;

}

sub updateVersion  {

  foreach my $file (@VERSION_FILES) {

    print "version: $version \tfile: $file\n";

    #     # if beta-version, only update the beta.rdf....
    #     if (($version =~ m/bs/i) && ($file !~ m/beta/i)) {
    #       next;
    #       # $file = 'skipscreen_beta_update.rdf';
    #     }

    #     #only update self for self....
    #     if (($version =~ m/s/i) && ($file !~ m/self/i)) {
    #       next;
    #     }

    print "Updating version information in $file\n";
    my $dirname = dirname($file);
    my $basename = basename($file);

    chdir $dirname or die "Cannot change to $dirname: $!";
    &parseVersionFile($basename);

    print " - Removing $basename\n";
    unlink $basename;

    print " - Renaming new_$basename\n\n";
    rename ("new_$basename", $basename);

    chdir $homeDir or die "Cannot change to $homeDir: $!";
  }


  # AUTO-set megaupload script 
  # if self-branches, use mega-captha; if not, not
  my $opt = '';
  if ($version =~ m/s/i) {
    $opt = 'captcha';
  } else {
    $opt = 'non-captcha';
  }

  print " - setting version of MegaUpload to $opt version\n\n";

  system("megacopy.sh ".$opt);



}

sub usageMessage {
  print "Options:\n";
  print "  --version <VERSION>\n";
  print "    Specify the version string to use for this extension\n";
  exit();
}

