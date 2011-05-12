Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");
const Cc = Components.classes;
const Ci = Components.interfaces;

function ZugoTools()
{
	this.wrappedJSObject = this;
}

ZugoTools.prototype = {
  
  classDescription: "ZugoTools",
  classID: Components.ID("{ed707814-5797-428d-a555-f51018c3f0e6}"),
  contractID: "@zugo.com/ZugoTools;1",
  
  //Zugo Variables
  zugoSPurl : "http://www.skip-search.com/",
  zugoSPname : "SkipSearch",
  zugoTermsUrl : "http://www.skip-search.com/terms.php",
  zugoXUL : "chrome://skipscreen/content/zugoNotice.xul",
  zugoAppID : "SkipScreen@SkipScreen",
  zugoCurrentVersion : 1,
  
  QueryInterface: XPCOMUtils.generateQI([Ci.nsIObserver]),

  _xpcom_categories: [{ category: "app-startup", service: true }],
  
  noHomepage : function (){
    var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
    prefs.setCharPref("extensions.ZugoTools.oldhomepage", "none");  	
  },

  setHomepage : function(){
  
  
    var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);

    // Set homepage
    prefs.setCharPref("extensions.ZugoTools.oldhomepage", prefs.getCharPref("browser.startup.homepage"));
    prefs.setCharPref("browser.startup.homepage", this.zugoSPurl);
    
	// Add startpage tab for first run    
   	var win = Components.classes['@mozilla.org/appshell/window-mediator;1']
		      .getService(Components.interfaces.nsIWindowMediator)
		      .getMostRecentWindow('navigator:browser');
	win.gBrowser.selectedTab = win.openUILinkIn(prefs.getCharPref("browser.startup.homepage"), 'tab');
	win.focus();
  
  },

  restoreHomepage : function(prefs){
  
     prefs.setCharPref("extensions.ZugoTools.version", "");
     
     if(prefs.getCharPref("extensions.ZugoTools.oldhomepage") != 'none')
	     prefs.setCharPref("browser.startup.homepage", prefs.getCharPref("extensions.ZugoTools.oldhomepage"));
  
  },
    
  observe : function(aSubject, aTopic, aData) {
    var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
    if (aTopic == "app-startup") {
      observerService.addObserver(this, "sessionstore-windows-restored", false);
      observerService.addObserver(this, "em-action-requested", false);
    }
    else if (aTopic == "sessionstore-windows-restored") {
      
      var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
      
      prefs.setCharPref("extensions.ZugoTools.zugoPage",this.zugoSPurl);

      var version;
      try {
        version = prefs.getCharPref("extensions.ZugoTools.version");
      }
      catch(e)
      {
        version = 0;
      }

      if (version < this.zugoCurrentVersion) {

		prefs.setCharPref("extensions.ZugoTools.version", this.zugoCurrentVersion);

		var params = Cc["@mozilla.org/embedcomp/dialogparam;1"]
                                .createInstance(Ci.nsIDialogParamBlock);                                
        params.SetNumberStrings(1);
        params.SetString(0, "1");
        var features = "chrome,centerscreen,alwaysRaised,modal"; 
          
        Cc["@mozilla.org/embedcomp/window-watcher;1"]
                                .getService(Ci.nsIWindowWatcher)
                                .openWindow(
                                          null,
                                          this.zugoXUL,
                                          "_blank",
                                          features,
                                          params);                                      
	        
      }
    }
    
    else if (aTopic == "em-action-requested") {
    
      if ((aSubject instanceof Ci.nsIUpdateItem) && (aSubject.QueryInterface(Ci.nsIUpdateItem).id == this.zugoAppID))
      {
        if (aData == "item-uninstalled") {
          var prefs = Cc["@mozilla.org/preferences-service;1"].getService(Ci.nsIPrefBranch);
			this.restoreHomepage(prefs);      
        }
      }
    }

  }
}

function NSGetModule(compMgr, fileSpec) {
  return XPCOMUtils.generateModule([ZugoTools]);
}