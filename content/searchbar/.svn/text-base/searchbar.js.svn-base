function bingsearch(searchStr){
	if (searchStr == undefined){
		var searchStr = document.getElementById("searchbar-bingsearch-textbox").value;
	}
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIWebNavigation)
		.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		.rootTreeItem
		.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIDOMWindow)
		.content.location.href = "http://www.bing.com/search?q=" + searchStr;
}

function skipscreensearch(searchStr){
	if (searchStr == undefined){
		var searchStr = document.getElementById("searchbar-skipscreensearch-textbox").value;
	}
	var mainWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIWebNavigation)
		.QueryInterface(Components.interfaces.nsIDocShellTreeItem)
		.rootTreeItem
		.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
		.getInterface(Components.interfaces.nsIDOMWindow)
		.content.location.href = "http://tb.skip-search.com/s/?q={" + searchStr + "}&site=Yahoo&src=FF-Toolbar";

}

function toggleSearchbar(toggle){
	var prefManager = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
    var searchbar = document.getElementById("searchbar-toolbar");
    var pref = prefManager.getBoolPref("extensions.skipscreen.searchbardisplay");

	if (pref == true){
		toggle.setAttribute("checked", false);
		searchbar.setAttribute("hidden", true);
		prefManager.setBoolPref("extensions.skipscreen.searchbardisplay", false);
	} else {
		toggle.setAttribute("checked", true);
		searchbar.setAttribute("hidden", false);
		prefManager.setBoolPref("extensions.skipscreen.searchbardisplay", true)
	}
}