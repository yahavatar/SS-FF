var skipscreen_gmCompiler={

    // getUrlContents adapted from Greasemonkey Compiler
    // http://www.letitblog.com/code/python/greasemonkey.py.txt
    // used under GPL permission
    //
    // most everything else below based heavily off of Greasemonkey
    // http://greasemonkey.devjavu.com/
    // used under GPL permission

    urlIsIncluded: function(href) {

	var included =   ( /http:\/\/.*depositfiles\.com\/files\/.*/.test(href)
			   || /http:\/\/.*depositfiles\.com\/([a-z]{2})\/files\/.*/.test(href)
			   || /http:\/\/.*depositfiles\.com\/auth-.*/.test(href)
			   || /http:\/\/www\.divshare\.com\/.*/.test(href)
 			   || /http:\/\/www\.filestube\.com\/.*?\/details\.html/.test(href)
 			   || /http:\/\/www\.filestube\.com\/[a-z0-9A-Z]{20}.*/.test(href)
			   || /http:\/\/hotfile\.com\/dl\/.*/.test(href)
			   || /http:\/\/www\.hotfile\.com\/dl\/.*/.test(href)
			   || /http:\/\/.*letitbit\.net\/download\/.*/.test(href)
			   || /http:\/\/.*letitbit\.net\/download[0-9]\.php/.test(href)
			   || /http:\/\/.*vip-file\.com\/downloadl\/.*/.test(href)
			   || /http:\/\/.*limelinx\.com\/files\/.*/.test(href)
			   // linkbucks-family is broken-out, below
			   || /http:\/\/link-protector\.com\/.*/.test(href)
			   || /http:\/\/([a-zA-Z0-9]){6}\.link-protector\.com\//.test(href)
			   || /http:\/\/.*mediafire\.com\/\?.*/.test(href)
			   || /http:\/\/.*mediafire\.com\/download\.php\?.*/.test(href)
			   || /http:\/\/.*mediafire\.com\/file\/.*/.test(href)
			   || /http:\/\/.*megashare\.com\/.*/.test(href)
			   || /http:\/\/.*megashares\.com\/.*/.test(href)
			   || /http:\/\/.*megaupload\.com\/\?.*/.test(href)
			   || /http:\/\/.*megaporn\.com\/\?.*/.test(href)
			   || /http:\/\/.*rapidshare\.com\/files\/.*/.test(href)
			   || /http:\/\/.*rapidshare\.com\/#!download.*/.test(href)
			   || /http:\/\/www\.sendspace\.com\/.*/.test(href)
			   || /http:\/\/sharebee\.com\/.*/.test(href)
			   || /http:\/\/.*zshare\.net\/download\/.*/.test(href)
			   || /http:\/\/.*zshare\.net\/audio\/.*/.test(href)
			   || /http:\/\/digg\.com\/(.{5}|.{6})$/.test(href)
			   || /http:\/\/www\.digg\.com\/(.{5}|.{6})$/.test(href)
			   || /http:\/\/uploaded\.to\/file\/.*/.test(href)
			   || /http:\/\/uploaded\.to\/\?view/.test(href)
			   || /http:\/\/www\.storage\.to\/get\/.*/.test(href)

			   || /http:\/\/lix.in.*/.test(href)
			   || /http:\/\/(www.)?filesonic.com\/file\/.*/.test(href)
			   || /http:\/\/(www.)?remixshare.com\/(download|dl|container)\/.*/.test(href)
			   || /http:\/\/(www.)?remixshare.com\/dl\/.*/.test(href)
			   || /http:\/\/(www.)?multiupload.com\/.*/.test(href)

			   || /http:\/\/www\.4shared\.com\/(get|audio|file|document|dir)\/.*/.test(href)


			   //|| /http:\/\/www\.easy-share\.com\/[0-9]+\/.*/.test(href)
			   // removed for 0.3.200911xx release
			   //|| /http:\/\/netload.in\/(index.php\?id=10|date).*/.test(href)

			   || /http:\/\/uploading.com\/files\/[a-z0-9A-Z]{8}\/.*/.test(href)
			   || /http:\/\/uploading.com\/files\/get\/[a-z0-9A-Z]{8}/.test(href)

			   // || /https://www.furk.net\/(.*).html/.test(href)

			   // the following are all for the linkbucks family
 			   || /http:\/\/(([0-9a-z]+)|(www))\.linkbucks\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.baberepublic\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.blahetc\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.linkgalleries\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.linkseer\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.picturesetc\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.placepictures\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.qvvo\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.realfiles\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.seriousfiles\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.thatsprime\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.thesefiles\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.thesegalleries\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.thosegalleries\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.tinybucks\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.uberpicz\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.ubervidz\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.ubucks\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.ugalleries\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.urlpulse\.net\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.viraldatabase\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.youfap\.com\/(link\/[0-9]+)?/.test(href)
			   || /http:\/\/(([0-9a-z]+)|(www))\.zxxo\.net\/(link\/[0-9]+)?/.test(href)
			 ) ;
	return included;
    },


    megaUrlIsIncluded: function(href) {

	var megaIncl = ( /http:\/\/.*megaupload\.com\/\?.*/.test(href)
			 || /http:\/\/.*megaporn\.com\/\?.*/.test(href)

		       ) ;

	return megaIncl;

    },


    urlIsExcluded: function(href) {

	return ! ( /http:\/\/ad\.yieldmanager\.com\/.*/.test(href)
		   || /http:\/\/transition\.adtrgt\.com\/.*/.test(href)
		   || /http:\/\/.*adbrite\.com\/.*/.test(href)
		   || /http:\/\/www\.addthis\.com\/.*/.test(href)

		 );

    },

    urlIsAllowed: function(href) {

	var allowed =  skipscreen_gmCompiler.urlIsIncluded(href)
	    && skipscreen_gmCompiler.urlIsExcluded(href);
	return allowed;

    },

    getUrlContents: function(aUrl){
	var	ioService = Components.classes["@mozilla.org/network/io-service;1"]
	    .getService(Components.interfaces.nsIIOService);
	var	scriptableStream = Components
	    .classes["@mozilla.org/scriptableinputstream;1"]
	    .getService(Components.interfaces.nsIScriptableInputStream);
	var unicodeConverter = Components
	    .classes["@mozilla.org/intl/scriptableunicodeconverter"]
	    .createInstance(Components.interfaces.nsIScriptableUnicodeConverter);
	unicodeConverter.charset="UTF-8";

	try {
	    var	channel = ioService.newChannel(aUrl, null, null);
	    var	input = channel.open();
	    scriptableStream.init(input);
	    var	str = scriptableStream.read(input.available());
	    scriptableStream.close();
	    input.close();
	} catch(e) {
	    alert("SkipScreen compiler failed on attempt to include " + aUrl);
	}

	try {
	    return unicodeConverter.ConvertToUnicode(str);
	} catch (e) {
	    return str;
	}
    },

    isGreasemonkeyable: function(url) {
	var scheme = Components.classes["@mozilla.org/network/io-service;1"]
	    .getService(Components.interfaces.nsIIOService)
	    .extractScheme(url);
	return (
	    (scheme == "http" || scheme == "https" || scheme == "file") &&
		!/hiddenWindow\.html$/.test(url)
	);
    },

    contentLoad: function(e) {
	var unsafeWin = e.target.defaultView;
	if (unsafeWin.wrappedJSObject) unsafeWin = unsafeWin.wrappedJSObject;

	var unsafeLoc = new XPCNativeWrapper(unsafeWin, "location").location;
	var href = new XPCNativeWrapper(unsafeLoc, "href").href;
	if (skipscreen_gmCompiler.isGreasemonkeyable(href) && skipscreen_gmCompiler.urlIsAllowed(href)) {
	    var script = skipscreen_gmCompiler.getUrlContents('chrome://SkipScreen/content/skipscreen.js');
	    skipscreen_gmCompiler.injectScript(script, href, unsafeWin);
	}
    },

    injectScript: function(script, url, unsafeContentWin) {

	var sandbox, logger, xmlhttpRequester;
	var safeWin = new XPCNativeWrapper(unsafeContentWin);

	sandbox = new Components.utils.Sandbox(safeWin);

	var storage = new skipscreen_ScriptStorage();
	xmlhttpRequester = new skipscreen_xmlhttpRequester(
	    unsafeContentWin, window
	);

	sandbox.window = safeWin;
	sandbox.document = sandbox.window.document;
	sandbox.unsafeWindow = unsafeContentWin;

	// patch missing properties on xpcnw
	sandbox.XPathResult = Components.interfaces.nsIDOMXPathResult;

	// add the GM APIs
	sandbox.GM_addStyle = function(css) { skipscreen_gmCompiler.addStyle(sandbox.document, css); };
	sandbox.GM_setValue = skipscreen_gmCompiler.hitch(storage, "setValue");
	sandbox.GM_getValue = skipscreen_gmCompiler.hitch(storage, "getValue");
	sandbox.GM_openInTab = skipscreen_gmCompiler.hitch(this, "openInTab", unsafeContentWin);
	sandbox.GM_xmlhttpRequest = skipscreen_gmCompiler.hitch(xmlhttpRequester, "contentStartRequest");

	//sandbox.GM_log = function(){};
	sandbox.GM_log = function(logStr){
	var logg = Components.classes["@mozilla.org/consoleservice;1"].getService(Components.interfaces.nsIConsoleService);
	    logg.logStringMessage("SkipScreen: " + logStr);
	};

	// http://dev.iceburg.net/jquery/jqDnR/
	// Drag-n-Resize for jQuery
	var jDNR = skipscreen_gmCompiler.getUrlContents('chrome://SkipScreen/content/jqDnR.js');
	var jQuery = skipscreen_gmCompiler.getUrlContents('chrome://SkipScreen/content/jquery-1.3.2.min.js');

	var jq = "(function(){"+jQuery+"})()";
	var jd = "(function(){"+jDNR+"})()";
	sandbox.jq = jq;
	sandbox.jd = jd;

	// mega-upload file may be swapped based on build-type.....
	var mega = "";
	if (skipscreen_gmCompiler.megaUrlIsIncluded(url)) {
	    // only include codebase if we're working w/ a mega-page
	    mega = skipscreen_gmCompiler.getUrlContents('chrome://SkipScreen/content/megaupload.js');
	}

	// adBlockPlus awareness
	// extensions.adblockplus.enabled
	var svc = Components.classes["@mozilla.org/preferences-service;1"]
	    .getService(Components.interfaces.nsIPrefService);
	var abp = svc.getBranch("extensions.adblockplus.");
	sandbox.abpEnabled = ( abp && (abp.getPrefType("enabled") != 0) && abp.getBoolPref("enabled"));

	// externalized files for easier testing/editing
	var utils = skipscreen_gmCompiler.getUrlContents('chrome://SkipScreen/content/ss-utilities.js');

	sandbox.ssVersion = sandbox.GM_getValue('version');

	sandbox.__proto__ = sandbox.window;

	try {

	    this.evalInSandbox(
		"(function(){" + jQuery + jDNR + utils + script + mega + " skipscreen.start();})()",
		url,
		sandbox);

	} catch (e) {
	    var e2 = new Error(typeof e=="string" ? e : e.message);
	    e2.fileName = script.filename;
	    e2.lineNumber = 0;
	    // TODO: can we add a timer to make this go away?????
	    if (e2 == 'Error: Security Manager vetoed action') {
		// ignore it
	    } else {
		alert("SkipScreen cmp: " + e2);
	    }
	}
    },

    evalInSandbox: function(code, codebase, sandbox) {
	if (Components.utils && Components.utils.Sandbox) {
	    // DP beta+
	    Components.utils.evalInSandbox(code, sandbox);
	} else if (Components.utils && Components.utils.evalInSandbox) {
	    // DP alphas
	    Components.utils.evalInSandbox(code, codebase, sandbox);
	} else if (Sandbox) {
	    // 1.0.x
	    evalInSandbox(code, sandbox, codebase);
	} else {
	    throw new Error("Could not create sandbox.");
	}
    },

    openInTab: function(unsafeContentWin, url) {
	var tabBrowser = getBrowser(), browser, isMyWindow = false;
	for (var i = 0; browser = tabBrowser.browsers[i]; i++)
	    if (browser.contentWindow == unsafeContentWin) {
		isMyWindow = true;
		break;
	    }
	if (!isMyWindow) return;

	var loadInBackground, sendReferrer, referrer = null;
	loadInBackground = tabBrowser.mPrefs.getBoolPref("browser.tabs.loadInBackground");
	sendReferrer = tabBrowser.mPrefs.getIntPref("network.http.sendRefererHeader");
	if (sendReferrer) {
	    var ios = Components.classes["@mozilla.org/network/io-service;1"]
		.getService(Components.interfaces.nsIIOService);
	    referrer = ios.newURI(content.document.location.href, null, null);
	}
	tabBrowser.loadOneTab(url, referrer, null, null, loadInBackground);
    },

    hitch: function(obj, meth) {
	var unsafeTop = new XPCNativeWrapper(unsafeContentWin, "top").top;

	for (var i = 0; i < this.browserWindows.length; i++) {
	    this.browserWindows[i].openInTab(unsafeTop, url);
	}
    },

    apiLeakCheck: function(allowedCaller) {
	var stack = Components.stack;

	var leaked = false;
	do {
	    if (2==stack.language) {
		if ('chrome'!=stack.filename.substr(0, 6) &&
		    allowedCaller!=stack.filename
		   ) {
		    leaked = true;
		    break;
		}
	    }

	    stack = stack.caller;
	} while (stack);

	return leaked;
    },

    hitch: function(obj, meth) {
	if (!obj[meth]) {
	    throw "method '" + meth + "' does not exist on object '" + obj + "'";
	}

	var hitchCaller = Components.stack.caller.filename;
	var staticArgs = Array.prototype.splice.call(arguments, 2, arguments.length);

	return function() {
	    if (skipscreen_gmCompiler.apiLeakCheck(hitchCaller)) {
		return;
	    }

	    // make a copy of staticArgs (don't modify it because it gets reused for
	    // every invocation).
	    var args = staticArgs.concat();

	    // add all the new arguments
	    for (var i = 0; i < arguments.length; i++) {
		args.push(arguments[i]);
	    }

	    // invoke the original function with the correct this obj and the combined
	    // list of static and dynamic arguments.
	    return obj[meth].apply(obj, args);
	};
    },

    addStyle: function(doc, css) {
	var head, style;
	head = doc.getElementsByTagName('head')[0];
	if (!head) { return; }
	style = doc.createElement('style');
	style.type = 'text/css';
	style.innerHTML = css;
	head.appendChild(style);
    },

    onLoad: function() {
	var	appcontent = window.document.getElementById("appcontent");
	if (appcontent && !appcontent.greased_skipscreen_gmCompiler) {
	    appcontent.greased_skipscreen_gmCompiler = true;
	    appcontent.addEventListener("DOMContentLoaded", skipscreen_gmCompiler.contentLoad, false);
	}
    },

    onUnLoad: function() {
	//remove now unnecessary listeners
	window.removeEventListener('load', skipscreen_gmCompiler.onLoad, false);
	window.removeEventListener('unload', skipscreen_gmCompiler.onUnLoad, false);
	window.document.getElementById("appcontent")
	    .removeEventListener("DOMContentLoaded", skipscreen_gmCompiler.contentLoad, false);
    }

}; //object skipscreen_gmCompiler


    function skipscreen_ScriptStorage() {
	this.prefMan = new skipscreen_PrefManager();
    }

    skipscreen_ScriptStorage.prototype.setValue = function(name, val) {
	this.prefMan.setValue(name, val);
    };

    skipscreen_ScriptStorage.prototype.getValue = function(name, defVal) {
	return this.prefMan.getValue(name, defVal);
    };


    window.addEventListener('load', skipscreen_gmCompiler.onLoad, false);
    window.addEventListener('unload', skipscreen_gmCompiler.onUnLoad, false);