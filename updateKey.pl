#!/usr/bin/perl -w
# simple copy of a couple of components

use strict;
use warnings;
use File::Basename;
use File::Copy;


my $xpi = $ARGV[0];
if ($xpi !~ m/xpi/i) {
  die "'$xpi' is not a .xpi file";
}


my $cmd = 'openssl sha1 '.$xpi;
my $sha = `$cmd`; #returns something like ''SHA1(<name>)= 8f77fd6457943f02a81622800ad7b15fa4890c0f'

(my $key = $sha) =~ s/.*?=\s(.*)/$1/i;	# strip out everything but the key
chomp($key);

print "openssl returned: '$key'\n";
if ($key =~ m/SHA1/i) { die "key not extracted from $key\n"; }


my $file = '';

#my $file = ($xpi !~ m/beta/) ? 'skipscreen_update.rdf' : 'skipscreen_beta_update.rdf';
if ($xpi =~ m/b/i) {
  $file = 'skipscreen_beta_update.rdf';
} elsif ($xpi =~ m/s/i) { 
  $file = 'skipscreen_self_update.rdf';
} # elsif ($xpi =~ m//i) {
#   print "\nAMO version does not require update key";
#   # TODO: actually, this means the line should be _removed_ from the insall.rdf
#   # BUT it has to exist for the other versions
#   # oh, BOTHER!
#   exit;
# }


print "Updating version information in $file\n";
my $dirname = dirname($file);
my $basename = basename($file);

chdir $dirname or die "Cannot change to $dirname: $!";
#print "basename: $basename\n";
parseVersionFile($basename);

print " - Removing $basename\n";
unlink $basename or die "Cannot remove $basename: $!";

print " - Renaming new_$basename\n\n";
rename ("new_$basename", $basename) or die "Cannot rename new_$basename: $!";

# now, while the sed version is all fine and dandy...
# can't besure it's actually going to exist on the target system
# and you're mixing up perl and bash again, anyway....
#
# my $sed = 'sed -i "s!<updateHash>.*</updateHash>!<updateHash>SHA1:'.$key.'</updateHash>!" '.$basename;
# print $sed."\n";
# system $sed;


sub parseVersionFile {
  my $filename = shift;

  open INPUT, "< $filename" or die "Cannot open input ($filename): $!";
  my @lines = <INPUT>;
  close INPUT;

  open OUTPUT, "> new_$filename" or die "Cannot open output (new_$filename): $!";

  foreach my $statement (@lines) {
    chomp $statement;
    if ($statement =~ m/^(\s*?)<updateHash>sha1:.*/i) {
      my $wspc = $1;
      print OUTPUT "$wspc<updateHash>sha1:$key</updateHash>\n";
    } else {
      print OUTPUT "$statement\n";
    }
  }

  close OUTPUT;

}
