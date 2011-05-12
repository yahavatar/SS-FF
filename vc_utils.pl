# Michael Paulukonis
# Nov 26, 2007 - Feb 2008
# http://pmwiki.divintech.com/pmwiki.php?n=IT.UsingCVS#Scripting

use strict;
use warnings;

use File::stat;
use Time::localtime;
use Cwd;
use File::Copy;
use File::Path;

use vc_Support;                # no name-space declared


# defined here to avoid clearing below
# unfortunately, this widens the scope. hrm....
my $force_copy = -1;		# true
my $copy_ini = -1;
my $no_copy_ini = 0;
my $no_force_copy = 0;

# default to menu action if no option provided
my $option = $ARGV[0] || "--menu";

## if no options provided, go to a MENU selection, to allow for keyed input (in the absence of params, shortcuts, etc.)
##... hrm. reroute back to parser?
## I guess this will have to be a parser of sorts, a routine in and of itself...

## die with usage info example: http://groups.google.com/group/comp.lang.perl.misc/browse_thread/thread/7cd40697e548fce/2e8890bcf8657fbc?lnk=gst&q=parse+opts#2e8890bcf8657fbc




## handle any provided params
parse_opts($option);

## loop through menu until user exits...
## no, this doesn't work, due to MY WEIRD SETUP....
##while (1) { parse_menu(); }

## may no longer be needed?
wait_for_it();


## SUBROUTINES

sub parse_menu {

  my @menu = get_menu();

  my $count = scalar @menu;

  #print_menu();
  print "\nTools for " .  PROJ_NAME."\n";
  for (my $i=0; $i < $count; $i++) {
    print "\n$i $menu[$i][1]";
  }

  print "\n\n Enter option: ";

  chomp (my $selection = <STDIN>);

  $selection = ($selection < $count) ? $selection : ($count - 1); #if invalid, default to menu (last option)

  my $option = $menu[$selection][0] || '--menu'; # selection, or default to menu

  print "\n\nyou want to $menu[$selection][1]\n"; # doesn't work for unitialized values


  return $option;

}

# TODO: put menu into another program entirely
# use parseopts to perform atomic operations in here
# that will allow for more flexible chaining, and not have this horrid menu interface, as well

#associative array of command-line options, w/ descriptive text
#this is a parallel dependency on the command-line parser (which itself is custom)
sub get_menu {

  my @menu = (["--help",           "Print HELP File."],
              ["--commit",         "Commit project folder to VC (no copy)"],
              ["--freeze-live",    "Create a dated SNAPSHOT/FREEZE dir of code as found in LIVE"],
              ["--freeze-vc",      "Create a dated SNAPSHOT/FREEZE dir of code as found in VC"],
              ["--code-release",   "Create a dated CODE RELEASE dir of code as found in the LIVE"],
              ["--dev-to-project", "Copy files from LIVE to VC"],
              ["--project-to-test","Copy files from VC to LIVE"],
              ["--print-env",      "Print VC, LIVE values."],
              ["--time-list",      "Print time-list."],
              ["--time-compare",   "Compare times (under development)."],
              ["--exit",           "EXIT"],
              ["--menu",           "Print Menu"],
             );

  return @menu;

}

sub parse_opts {

  my ($option) = @_;

  if ( $option =~ /--exit$/i ) {

    print "\n\nExited normally.";

    exit();

  } elsif ( $option =~ /--h(elp)?$/i ) {
    print_help();

  } elsif ( $option =~ /--menu$/i ) {
    my $new_opt = parse_menu();
    parse_opts($new_opt);

  } elsif ( $option =~ /--commit/i ) {
    $option = "-commit";
    commit_it();

  } elsif ($option =~ /--project-to-test/i ) {
    $option = "-copytest";

    print "Copy project-folder to LIVE Environment; are you sure? Y/N: ";
    chomp (my $confirm = <STDIN>);

    if ($confirm =~ /^y/i ) {
      copy_from_to( VC()."\\", LIVE() );
    }

  } elsif ($option =~ /--dev-to-project|-dtp/i ) {
    $option = "-dev-to-project";
    copy_from_to( LIVE(), VC()."\\" );

  } elsif ( $option =~ /--print-list|pl/i ) {

    print "\nList of all files in project:";
    print_list();

  } elsif ( $option =~ /--freeze-live$/i ) {

    freeze( LIVE() );

  } elsif ( $option =~ /--freeze-vc$/i ) {

    freeze( VC() );

  } elsif ( $option =~ /^--time-list$/i ) {

    print_time( LIVE() );

  } elsif ( $option =~ /^--time-compare$/i ) {

    compare_time( LIVE(), VC() );

  } elsif ( $option =~ /--swap$/i ) {

    # TODO: this is a temporary caller, and not well set up
    # capture additional parameters from command-line

    # pass in the arg-list, and parse out whatever is needed down-stream
    call_it(@ARGV);

  } elsif ( $option =~ /--restore$/i ) {

    # TODO: working on this bit (semi or non-functional)
    restore();

  } elsif ( $ option =~ /--print-env$/i ) {

    # TODO build this up
    print_environment()

  } else {                      #unknown option - print help-file
    print "\nUnkown parameter [$option]\n";
    print_help();
  }

  parse_opts("--menu");

}


# is $name1 newer than $name2
sub is_newer {
  my($name1,$name2) = @_;

  my $date_1 = 0;
  my $date_2 = 0;

  if (-e $name1) {
    $date_1 = stat($name1)->mtime;
  }
  if (-e $name2) {
    $date_2 = stat($name2)->mtime;
  }

  return ($date_1 > $date_2);
}


# wait for keypress, so cmd-window doesn't vanish
sub wait_for_it {
  print "\n\nHit enter to exit.";
  getc;
  print "\n\n";
}

# return list of project files
sub get_files {
  my $local_path = getcwd() . "/"; # script should reside in CVS folder

  # list of project files (2-d array)
  my @project_files = get_projectfiles();

  my $fcount = scalar @project_files; # capture the length of the array

  my @files;
  my $sub_dir;

  for (my $i=0; $i < $fcount; $i++) {

    #retrieve/assign sub_dir
    for ($project_files[$i][0]) {
      if (/--/) {
        $sub_dir = "";
      }                         # file s/b local
      elsif (!(/^$/)) {
        $sub_dir = $project_files[$i][0];
      }                         # not blank, use what we got
    }

    #retrieve/assign name
    my $name = $project_files[$i][1];

    $files[$i][0] = $sub_dir;
    $files[$i][1] = $name;

  }

  return @files;

}

# print list of files
# bulk of below is just some easy-on-the-eyes formatting.
sub print_list {
  my (@files) = get_files();
  my $fcount = scalar @files;
  my $prev_sub_dir = "";

  for (my $i=0; $i< $fcount; $i++) {
    my $sub_dir = $files[$i][0];
    if ($sub_dir ne $prev_sub_dir) {
      $prev_sub_dir = $sub_dir;
      $sub_dir = "\n" . $sub_dir; #add an extra LF to the first one
    }
    my $name = $sub_dir . $files[$i][1];
    print "\n$name";
  }

}

# copy files from one place to another
sub copy_from_to {

    my @copied; #holds list of files actually copied, for eye-candy reports

    my $source_path = $_[0];
    my $dest_path = $_[1];
    my $copy_ini = defined $_[2] ? $_[2] : -1; # default to true, if not passed in (standard behavior)
    my $force_copy = defined $_[3] ? $_[3] : 0; # default to false (standard behavior - copy newer files only)

    if ($force_copy) {
      print "\n\nCOPY IS FORCED!!!\n";
    } else {
      print "\n\nCOPY NEW FILES ONLY (no force)\n";
    }

    if (! -d $dest_path) { mkdir $dest_path };


    my (@files) = get_files();
    my $fcount = scalar @files; # capture the length of the array

    for (my $i=0; $i < $fcount; $i++) {

      my $sub_dir = $files[$i][0] || "";
      my $name = $files[$i][1];
      my $source = $source_path . $sub_dir . $name;
      my $destination = $dest_path . $sub_dir  . $name;

      if ((! $sub_dir eq "")  && (! -e $dest_path.$sub_dir)) {
        mkpath($dest_path.$sub_dir, 1, 0777) || die "cannot mkpath $dest_path$sub_dir: $!";
        print "\n\nCreated $dest_path$sub_dir";
      }

      ## TODO: check $copy_ini, and wether target file is ini....
      # hrm....

      if (! -e $source) {
        # if sourcedoesn't exist, something is wrong with the setup.
        die "\n\nCan't find $source - check project files: $!";
      } else {
        # do not copy ini unless $copy_ini is set
        if ( $copy_ini || ( ! $copy_ini && ($source !~ m/\.ini$/ ))) {
          if ( (is_newer($source, $destination)) || $force_copy ) {
            if (-e $destination) {
              unlink($destination); # if exists (-e) delete
            }
            copy($source, $destination) or die "Copy failed: $!";
            print "\ncopied $name\t to $dest_path$sub_dir...";
            @copied = (@copied, $name);
          } else {
            # ignore this file, as the local copy (CVS vers.) is newer than the server
            print "\nNothing new under the sun for $name";
          }
        }
      }
    }

    print "\n\ncopied:\n";
    foreach my $file (@copied) {
      print "\t$file\n";
    }

    #    wait_for_it();

  }

# commit
sub commit_it {

  print "comments for commit: ";
  chop (my $comments = <STDIN>);

  # commit entire repository to server
  # NOTE: comments same for all files, so prompted at beginning.
  my $cvs_command = "cvs -q -x commit -m \"$comments\" ";
  print "\n$cvs_command\n";
  system($cvs_command);

  #  wait_for_it();

}

# add a time-stamp to make sure we're generating a unique name
sub getUniqueName {

  my $unique = sprintf("%02d%02d%02d", localtime->hour(), localtime->min(), localtime->sec() );

  return getFreezeName() . "_" . $unique;

}


sub yyyymmdd {

  my $year =  localtime->year() + 1900;		  # counts from 1900
  my $day =  sprintf("%02d", localtime->mday() ); # counts from 1
  my $month = sprintf("%02d", localtime->mon() +1 ); # counts from 0

  return $year.'-'.$month.'-'.$day;

}



# freeze name base
sub getFreezeName {

  my $year =  localtime->year() + 1900;		  # counts from 1900
  my $day =  sprintf("%02d", localtime->mday() ); # counts from 1
  my $month = sprintf("%02d", localtime->mon() +1 ); # counts from 0


  # drop everything into the FREEZE dir, then subdivided by project and date
  # not using a time-stamp, as it's so infrequent you can do that manually
  my $new_dir = "SNAPSHOT\\".PROJ_NAME()."_SNAPSHOT_$year-$month-$day";

  return $new_dir;

}

# code-release pathname is NOT the same as freeze......
# it's path, date, project-name, folders
# otherwise, same actions....
# default to unique neame w/o asking....
# would be nice if it compared files to production, and only copied newer files....
sub coderelease {

  my $from = $_[0];
  my $to = $_[1];

  my $crDir = yyyymmdd().'\\'.PROJ_NAME().'\\';

  #check if $crDir already exists, and take appropriate action
  if (-e $to.$crDir) {
    $crDir = getUniqueName($crDir);
  }

  #won't work, this smoothly, as CR is one folder up....
  copy_from_to($from, $to.$crDir."\\");

  return $to.$crDir;		# return the new code-release location


}

########################################################################
#
# code-freeze
# take all VBPs (at this point) and make copies in a prefix'd, dated-director
# eg, IC_FREEZE_03132008
# returns new location
#
########################################################################
sub freeze {

  # uses "copy_from_to" with a generated "to" directory....
  # localtime notes at http://homepage.mac.com/corrp/macsupt/macperl/localtime.html

  my $loc = $_[0];

  my $freeze_dir = getFreezeName();

  my $new_loc = $loc.$freeze_dir."\\";

  #check if $freeze_dir already exists, and take appropriate action
  if (-e $loc.$freeze_dir) {
    print "\n\n $loc$freeze_dir already exists. Overwrite (Y/N)?: ";
    chomp (my $confirm = <STDIN>);

    if ($confirm =~ /^n/i ) {
      $freeze_dir = getUniqueName($freeze_dir);
    }
    # else - just ignore it, and overwite, right?

  }

  copy_from_to($loc, $loc.$freeze_dir."\\");

  # don't use "wait_for_it()" here, as copy_from_to executes it, as well....

  return $loc.$freeze_dir; # return the new freeze location for routines like swap, etc.

}

## this is a dummy-stub that calls the swap-routine w/ pre-set vars for testing purposes.
sub call_it {

  #TODO: how to decide this?
  my $copy_ini = -1;
  my $no_copy_ini = 0;

  my @args = @_;

  my $source_dir =  $args[1] || die "Missing source param: $!";
  my $dest_dir = $args[2] || die "Missing dest param: $!";
  my $ini_param = int($args[3])|| $no_copy_ini; #if present but not int, will be cast to 0 - default of no ini copy

  printf("\n%s %s %s %s %s %d", "source: ", $source_dir, " dest: ", $dest_dir, " ini:", $ini_param);

  ##  swap(  FW_PROD(), LIVE(), $no_copy_ini );

}

########################################################################
#
# swap environment
#
# free source and destination
# copy source to destination (optionally copy ini files for db access duplication)
# prepare script-file to restore dest from freeze
#
########################################################################
sub swap {                      # source, target

  # target environment will be backed-up and replaced with the source environment
  # eg, swap(prod,test) will put a duplicate of the prod environment into test
  # while allowing test to be restored from a dated_freeze dir

  my ($source, $target, $copy_ini) = @_;

  print "\n\nPreparing to place $source into the $target environment.\n Are you Sure (Y/N)? ";
  chomp (my $confirm = <STDIN>);

  if ($confirm =~ /^y/i ) {

    my $target_freeze_loc = freeze($target)."\\"; #save location as a side-effect of freeze

    print "\nTarget freeze_loc : $target_freeze_loc";

    # how to specify swaps? provide absolute paths in the params (ugh)
    # keywords? TEST, DEV, PROD?  --> I think I prefer this
    # how about reversing? read a file?
    # sub ... undo_swap ()

    store_reverse($source, $target, $target_freeze_loc, $copy_ini);

    my $force_copy = -1;        # true

    copy_from_to($source, $target, $copy_ini, $force_copy);

  } else {
    print "\n\nOperation cancelled.";
  }

  #  wait_for_it;

}

# store the location (and other data?) of the last freeze
sub store_reverse {

  my ($source, $target, $target_freeze_loc, $copy_ini) = @_;

  ## TODO: pick a place to dump this file
  ## decide on the interior content
  ## swap should check to see if such a file already exists?
  ## if so.. does it even want to swap?
  ## or is that in the caller routine?
  ## hrm.

  unless (open (SWAPLOG, ">>swaplog.txt")) {
    die "ERROR: couldn't create swaplog\n";
  }

  my $record = sprintf "%s::%s::%s::%s", $source, $target, $target_freeze_loc, $copy_ini;

  print SWAPLOG $record . "\n";
  close(SWAPLOG);


}

# check the swaplog, and place the last entry into target environment
sub restore {

  my ($target) = @_;

  my $source;
  my $target_freeze_loc;
  my $copy_ini;

  open (SWAPLOG, "swaplog.txt") || die "ERROR: couldn't open swaplog $!";
  while (<SWAPLOG>) {
    chomp;
    ($source, $target, $target_freeze_loc, $copy_ini) = split(/::/);
  }
  ;

  my $did = ($copy_ini) ? "" : "not";

  print "\n\nplaced $source at $target_freeze_loc, and did $did copy the ini-file.";

  print "\n\nPreparing to place $source into the $target_freeze_loc.\n Are you Sure (Y/N)? ";
  chomp (my $confirm = <STDIN>);

  if ($confirm =~ /^y/i ) {

    my $new_source = $target_freeze_loc;
    my $new_target = $target;

    # $new_target is innacurate -- needs to be derived from ....
    # C:\FWShare\FormWare\FREEZE\IntraCorp_SNAPSHOT_07-16-200
    # everything to the left of Freeze... or should we just store that, as well???
    my $force_copy = -1; # true, so we can restore older files if requested
    copy_from_to($new_source, $new_target, $copy_ini, $force_copy);
  } else {
    #    wait_for_it();
  }

}


# prints major definitions
sub print_environment {

  print "\n\nEnvironment: \n";
  print "\nLIVE: ".LIVE;
  print "\nVC: ".VC;
  print "\nProject: ".PROJ_NAME;
  print "\n\n";

}


  sub print_help {
    print "\nCopy-and-Commit utilities for DIT/FormWare/InputAccel";

    print "\n\nCommand Line Options:";
    print "\n  -commit               Commit project folder to CVS (no copy)";
    print "\n  -c[opy] | ttp         Copy files from test server to project.";
    print "\n  -copydev  | cd | ptd  Copy files from project to C:\\FwShare\\FormWare\\";
    print "\n  -copytest | ct | ptt  Copy files from  project to \\\\Pascricf1\\FW2\\FwShare\\FormWare\\";
    print "\n  -dev-to-project | -dtp  Copy from LocalDevServer to Project";
    print "\n  -h[elp]  (default)    Print this help File.";
    print "\n  -pl                   Print list of all files included in project.";
    print "\n                        NOTE: may not include local files such as helpers, etc.";
    print "\n  -freeze-test, -dev, -prod";
    print "\n                          Create a dated dir of code as found in serverat this point.";
    print "\n";
    print "\nThere are no options to add files/folders; please do manually.";
    print "\n";
    print "\nIf you're reading this file from Explorer, you probably want to create shortcuts";
    print "\nfor the above options. If your command-path is enclosed in quotation marks, the ";
    print "\nparameter will be _outside_ the quotes.";

  }

  # prints time-stamps for all files in provided project
  # print_time($environment)
  sub print_time {

    my $target_env = $_[0];

    print "\n$target_env:\n";

    my $sub_dir = "";
    my (@files) = get_files();
    my $fcount = scalar @files;	# capture the length of the array

    for (my $i=0; $i < $fcount; $i++) {

      $sub_dir = $files[$i][0] || "";
      my $name = $files[$i][1];
      my $target = $target_env . $sub_dir  . $name;

      my $modTime = stat($target)->mtime;
      print ctime($modTime) . " : $name\n";
    }

  }

  # prints time-stamps for all files in provided project
  # print_time($environment)
  sub compare_time {

    my ($env1, $env2) = @_;

    print "\nfirst env: $env1\nsecond env: $env2\n";
    print "listing differences only....\n";

    my (@files) = get_files();
    my $fcount = scalar @files;	# capture the length of the array

    for (my $i=0; $i < $fcount; $i++) {

      my $sub_dir = $files[$i][0] || "";
      my $name = $files[$i][1];
      my $path1 = $env1 . $sub_dir  . $name;
      my $path2 = $env2 . $sub_dir . $name;

      my $time1 = stat($path1)->mtime;
      my $time2 = stat($path2)->mtime;

      if ($time1 != $time2) {
	print ctime($time1) . " : $path1\n";
	print ctime($time2) . " : $path2\n";
      } else {
	print "$name has identical time-stamps\n";
      }

    }

  }
