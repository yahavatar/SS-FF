//onLoad, hide or display the search bar
window.addEventListener('load', function(){
    var pref = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch).getBoolPref("extensions.skipscreen.searchbardisplay");
    var searchbar = document.getElementById("searchbar-toolbar");
    var toggle = document.getElementById("Skipscreen_tools_toggle_searchbar");

    if (pref == true){
		searchbar.setAttribute("hidden", false);
		toggle.setAttribute("checked", true);
	} else if (pref == false){
		searchbar.setAttribute("hidden", true);
		toggle.setAttribute("checked", false);
	}
}, false);
