
// https://developer.mozilla.org/en/Code_snippets/On_page_load#Running_code_on_an_extension%27s_first_run_or_after_an_extension%27s_update
var SkipScreenOverlay = {

    appName : "",
    appVersion : "",

    // function required for asynchronous AddonManager interaction in 4.x
    // if calling app is NOT FF4, then addon has a single-property : version
    updateVersion: function(addon) {

	var prevExtVersion = -1, firstrun = true;
	var firstSkipScreenUseDate = ""; var dateNotSet = true;
	var showFirsts = true, debugVerbose = false;

	// no need for this var to be in the global name-space
	// NOR to share a potentiall common name. so, ssPrefs
	var svc = Components.classes["@mozilla.org/preferences-service;1"]
	    .getService(Components.interfaces.nsIPrefService);
	var ssPrefs = svc.getBranch("extensions.skipscreen.");

	try {

	    prevExtVersion = ssPrefs.getCharPref("version");
	    firstrun = ssPrefs.getBoolPref("firstrun");
	    firstSkipScreenUseDate = ssPrefs.getCharPref("firstskipdate");
	    dateNotSet = (firstSkipScreenUseDate == "");
	    showFirsts = ssPrefs.getBoolPref("showfirstruns"); // allows start pages to be turned off for partners
	    debugVerbose = ssPrefs.getBoolPref("debugVerbose");

	} catch(e) {

	    alert("SkipScreen error in auxilliary.js: " + e.message
		  + "\n\nextVersion: " + addon.version
		  + "\nprevExtVersion: " + prevExtVersion
		  + "\nfirstrun: " + firstrun
		  + "\nskipdate: " + firstSkipScreenUseDate
		  + "\nshowFirstRuns: " + showFirsts
		  + "\ndebugVerbose: " + debugVerbose);

	} finally {

	    // debugVerbose s/b set to false for AMO and self-builds
	    // leave as manually set for beta-builds
	    if (debugVerbose) {
		alert("appName: " + SkipScreenOverlay.appName +
		      "\nappName version: " + SkipScreenOverlay.appVersion +
		      "\nextVersion extension version: " + addon.version +
		      "\nprevExtVersion: " + prevExtVersion +
		      "\nfirstrun: " + firstrun +
		      "\nshowFirstRuns: " + showFirsts +
		      "\ndebugVerbose: " + debugVerbose +
		      "\nskipdate: " + firstSkipScreenUseDate );
	    }

	    if (dateNotSet) {
		ssPrefs.setCharPref("firstskipdate", Date());
	    }

	    // change this depending on the branch
	    var newPage = "http://www.skipscreen.com/install/whatsnew_beta.html?ver=" + addon.version;

	    // NOTE: showfirst-check is INSIDE both code-blocks, because prefs need to be set no matter what.
	    if (firstrun){
		ssPrefs.setBoolPref("firstrun", false);
		ssPrefs.setCharPref("version", addon.version);

		if (showFirsts) {
		    // Insert code for first run here
		    window.setTimeout(function(){
			gBrowser.selectedTab = gBrowser.addTab("http://www.skipscreen.com/welcome.html");
			gBrowser.selectedTab = gBrowser.addTab(newPage);
		    }, 1500); //Firefox 2 fix - or else tab will get closed (leave it in....)
		}

	    }

	    if (prevExtVersion!=addon.version && !firstrun){ // !firstrun ensures that this section does not get loaded if its a first run.
		ssPrefs.setCharPref("version", addon.version);

		if (showFirsts) {
		    // version is different => upgrade (or conceivably downgrade)
		    // RapidShare is not working in this version - disable it
		    // pref("extensions.skipscreen.rapidshareactive", false);
		    window.setTimeout(function(){
			gBrowser.selectedTab = gBrowser.addTab(newPage + '&prevExtVersion=' + prevExtVersion);
		    }, 1500); //Firefox 2 fix - or else tab will get closed
		}
	    }
	} // end finally

    },

    init: function(){

	var svc = Components.classes["@mozilla.org/preferences-service;1"]
	    .getService(Components.interfaces.nsIPrefService);
	var ssPrefs = svc.getBranch("extensions.skipscreen.");
	var debugVerbose = ssPrefs.getBoolPref("debugVerbose");

	try {
	    const FIREFOX_ID = "{ec8030f7-c20a-464f-9b0e-13a3a9e97384}";
	    // TODO: songbird support?
	    const CONKEROR_ID = "{a79fe89b-6662-4ff4-8e88-09950ad4dfde}";
	    var appInfo = Components.classes["@mozilla.org/xre/app-info;1"]
		.getService(Components.interfaces.nsIXULAppInfo);
	    if(appInfo.ID == FIREFOX_ID) {
		// running under Firefox
		// https://developer.mozilla.org/en/Using_nsIXULAppInfo
		SkipScreenOverlay.appName = "Firefox";
		var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                    .getService(Components.interfaces.nsIVersionComparator);
		if(versionChecker.compare(appInfo.version, "1.5") >= 0) {
		    // running under Firefox 1.5 or later
		    SkipScreenOverlay.appVersion = appInfo.version;
		}

		if (debugVerbose) {
		    var msg = "Version: " + SkipScreenOverlay.appVersion +
			"\ncompare to 4: " + versionChecker.compare(SkipScreenOverlay.appVersion, "4.0b8");
		    alert(msg);
		}

		// https://developer.mozilla.org/en/XPCOM_Interface_Reference/nsIVersionComparator
		if (versionChecker.compare(SkipScreenOverlay.appVersion, "4.0b8") < 0) {
		    // gets the version number for FF 3.x
		    var gExtensionManager = Components.classes["@mozilla.org/extensions/manager;1"]
			.getService(Components.interfaces.nsIExtensionManager);
		    var extVersion = gExtensionManager.getItemForID("SkipScreen@SkipScreen").version;
		    SkipScreenOverlay.updateVersion( { version: extVersion } );
		} else {
		    // gets the version number for FF 4.x
		    Components.utils.import("resource://gre/modules/AddonManager.jsm");
		    AddonManager.getAddonByID("SkipScreen@SkipScreen", function(addon) {
			SkipScreenOverlay.updateVersion(addon);
		    });

		}


	    } else if(appInfo.ID == CONKEROR_ID) {
		// running under Conkeror
		SkipScreenOverlay.appName = "Conkeror";
		SkipScreenOverlay.appVersion = "unknown";
		var extVersion = "unknown";
		SkipScreenOverlay.updateVersion( { version: extVersion } );
	    } else {
		// another appName
	    }

	} catch(e) {
	    if (debugVerbose) { alert("version-check err: " + e.message); }
	}

	window.removeEventListener("load",function(){ SkipScreenOverlay.init(); },true);
    },


    optionMenu: function () {
	try{
	    skipWin = window.openDialog('chrome://skipscreen/content/options.xul', 'SkipScreen Options', 'chrome,titlebar,toolbar,centerscreen,resizable');
	    skipWin.focus();
	} catch (e) {
	    alert(e);
	}
	return true;
    },

    aboutMenu: function () {
	try{
	    skipWin = window.openDialog('chrome://skipscreen/content/about.xul', 'SkipScreen About', 'chrome,titlebar,toolbar,centerscreen,resizable');
	    skipWin.focus();
	} catch (e) {
	    alert(e);
	}
	return true;
    }


};

    // fires on browser launch, which includes open-link-in-new-window
    window.addEventListener("load",function(){ SkipScreenOverlay.init(); },true);
