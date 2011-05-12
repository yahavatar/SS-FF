#
# Script to build a self-hosted, non-AMO release of skipscreen
#
# Load the .zip library
[System.Reflection.Assembly]::LoadFrom("Ionic.Zip.dll") | out-null

# Blow away the old local build directory
Remove-Item build -Recurse | out-null



#$directoryToZip = "content";
#$zipfile =  new-object Ionic.Zip.ZipFile;
#$e= $zipfile.AddEntry("install.rdf", "Installer File")
#$e= $zipfile.AddDirectory($directoryToZip, "Content")
#$zipfile.Save("powershell_build.zip");
#$zipfile.Dispose();