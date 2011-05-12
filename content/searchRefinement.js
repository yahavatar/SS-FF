//1. This javascript code runs in the Firefox chrome level. On
//DomContentLoaded, it will determine if the current page is a Google,
//Yahoo or Bing search results page. If so, it fires off an ajax
//request and puts the refinement links at the top of the page.

// 2. The code does nothing if a div with id ==
// "scTopOfPageRefinementLinks" already exists on the page. This way,
// if the user has more than one extension that tries to add
// refinement links to the page, the first extension to activate is
// the one that displays the links, and the other extensions don't.

// 3. The partner object (on line 3 of the javascript code) has a
// property called "uiLabel", which is the text that is used to label
// the refinements in the UI. Feel free to change that label, or make
// any other UI tweaks, so long as the enclosing div still has id ==
// "scTopOfPageRefinementLinks".

// 4. The code creates one new window-level variable, called
// window.scRefinementQuery.


(function () {

    function refinementsEnabled() {

	var startPoint="extensions.skipscreen.";
	var pref=Components.classes["@mozilla.org/preferences-service;1"].
	  getService(Components.interfaces.nsIPrefService).
	    getBranch(startPoint);
	var enabled = pref.getBoolPref("searchrefinementsactive");
	return enabled;

    }

    function addRefinementLinks() {

	var partner = { uiLabel: 'SkipScreen Refinements', partnerCode: 'skipscreen', authCode: 'hgv27565' };

	// quit if SC or any other extension has already put the refinement links on the page
	if (_content.document.getElementById('scTopOfPageRefinementLinks')) {
	    return;
	}

	if ( !refinementsEnabled() ) {return;}

	try {
	    if (! _content.document.location) {return; }
	    var host = _content.document.location.host;
	    var pathname = _content.document.location.pathname;
	    if (host) {
		var div, insertPoint;
		if (containsSubstring(host, '.google.') && containsSubstring(host,'www') && ((pathname == '/') || (pathname == '/search'))) {
		    window.scRefinementQuery = null;
		    waitForGoogleAjaxToComplete(partner);
		} else if (containsSubstring(host, 'search.yahoo.')) {
		    window.scRefinementQuery = _content.document.getElementById("yschsp").value;
		    div = _content.document.getElementById('web');
		    insertPoint = getDescendents(div, "ol")[0];
		    launchSCAjaxRequestForRefinementLinks(partner, insertPoint, '');
		} else if (containsSubstring(host, '.bing.com') && (pathname == '/search')) {
		    window.scRefinementQuery = _content.document.getElementById("sb_form_q").value;
		    div = _content.document.getElementById('results');
		    insertPoint = getDescendents(div, "ul")[0];
		    launchSCAjaxRequestForRefinementLinks(partner, insertPoint, '');
		}
	    }
	} catch (ex) {
	    // executes on empty tabs, and throws errors....
	    // alert("Refinements error: " + ex);
	}
    }

    function waitForGoogleAjaxToComplete(partner) {
	if (!window.scRefinementQuery) {
	    var aTags = _content.document.getElementsByTagName('a');
	    for (var i = 0; (i < aTags.length) && !window.scRefinementQuery; i++) {
		var aTag = aTags[i];
		var href = aTag.href;
		if (containsSubstring(href, '.google.') && (containsSubstring(href, '/advanced_search?q=') || containsSubstring(href, '/swr?q='))) {
		    window.scRefinementQuery = href.replace(/.*\?q=/, '').replace(/&.*/, '');
		}
	    }

	    if (!window.scRefinementQuery) {
		setTimeout(waitForGoogleAjaxToComplete, 200, partner);
		return;
	    }
	}

	var liTags = _content.document.getElementsByTagName('li');
	for (i = 0; i < liTags.length; i++) {
	    var liTag = liTags[i];
	    var cls = liTag.getAttribute('class');
	    if (cls && ((cls == 'g') || (cls.indexOf('g ') === 0))) {
		var insertPoint = liTag.parentNode;
		launchSCAjaxRequestForRefinementLinks(partner, insertPoint, '');
		break;
	    }
	}
    }

    function launchSCAjaxRequestForRefinementLinks(partner, insertPoint, yStyle) {
	if (_content.document.getElementById('scTopOfPageRefinementLinks')) {
	    return;
	}

	var div = _content.document.createElement("div");
	div.innerHTML = '<div id=scTopOfPageRefinementLinks scTopPos=1 partner="' + partner.partnerCode + '" style="height: 20px; margin-top: 7px; margin-bottom: 7px;' + yStyle + '"></div>';
	insertPoint.parentNode.insertBefore(div, insertPoint);

	var url = 'http://' + partner.authCode + '.surfcanyon.com/queryReformulation?partner=' + partner.partnerCode + '&authCode=' + partner.authCode + '&q=' + window.scRefinementQuery.replace(/ /g, '+');
	var xhr = new window.XMLHttpRequest();
	xhr.open("GET", url, true);
	xhr.onreadystatechange = function() {
	    if (xhr.readyState == 4) {
		var parser = new window.DOMParser();
		var xmlRoot = parser.parseFromString(xhr.responseText, "text/xml");
		var itemNodes = xmlRoot.getElementsByTagName('refinement');

		var items = [];
		var runningLength = 0;
		for (var i = 0; i < itemNodes.length; i++) {
		    try {
			var itemNode = itemNodes[i];
			var refinement = itemNode.textContent.toLowerCase();
			var refinementLength = refinement.length;
			if (runningLength + refinementLength < 80) {
			    runningLength += refinementLength;
			    var query = makeRefinementQuery(refinement).replace(/ /g, '+');
			    items.push('<a href="http://search.surfcanyon.com/search?f=nrl' + i + '&q=' + query + '&partner=' + partner.partnerCode + '">' + refinement + '</a>');
			}
		    } catch (e) {
		    }
		}

		if (items.length > 0) {
		    var div = _content.document.getElementById('scTopOfPageRefinementLinks');
		    if (div && (div.getAttribute('partner') == partner.partnerCode)) {
//                         div.innerHTML = '<font size=-1><b>' + items.join(' &nbsp;') + '</b> &nbsp;'
// 			    + '<style>#apRefinementDesc:hover	{text-decoration:underline;}\n#apRefinementDesc	{text-decoration:none;}</style> '
// 			    + '<span style="color:green" title="help support SkipScreen development &mdash; visit our partner">' + partner.uiLabel + '</span>'
// 			    + '&nbsp;<a id="disableRefinement" class="disableRefinement" href="#" title="Disable SkipScreen Refinements">[x]</a></font>';

			// TODO: poor styling code....
			div.innerHTML = '<font size=-1><b>' + items.join(' &nbsp;') + '</b> &nbsp;'
			    + '<span style="color:green" title="help support SkipScreen development &mdash; visit our partner">' + partner.uiLabel + '</span>'
			    + '&nbsp;<a id="disableRefinement" class="disableRefinement" href="#" title="Disable SkipScreen Refinements" style="text-decoration:none; color:green;">[x]</a></font>';

			var killer = _content.document.getElementById('disableRefinement');
			killer.addEventListener('click', disableRefinement, false);

		    }
		}
	    }
	};
	xhr.send(null);
    }

    var disableRefinement = function(event)
    {
	event.preventDefault();
        if (confirm("Remove SkipScreen Refinement links?\n(You can re-enable them later in the options menu.)"))
        {
	    // from autopager-refinements, as suggested by Surf Canyon
	    var evaluate = function(node,expr,max)
	    {
		var doc = (node.ownerDocument == null) ? node : node.ownerDocument;
		var found = [];
		try{
		    var xpe = new XPathEvaluator();
		    var nsResolver = xpe.createNSResolver(doc.documentElement);
		    var result = xpe.evaluate(expr, node, nsResolver, 0, null);

		    var res;
		    while ((res = result.iterateNext()) && (typeof(max)=='undefined' || found.length<max))
			found.push(res);
		}catch(e) {}
		return found;
	    };

	    var startPoint="extensions.skipscreen.";
	    var pref=Components.classes["@mozilla.org/preferences-service;1"].
	      getService(Components.interfaces.nsIPrefService). getBranch(startPoint);
	    pref.setBoolPref("searchrefinementsactive",false);
	    var rmv = evaluate(event.target.ownerDocument,"//div[@id='scTopOfPageRefinementLinks']",1);
	    for(var i=0;i<rmv.length;i++){
		rmv[i].parentNode.removeChild(rmv[i]);
	    }
        }
    };

    function listenOndisableRefinement(doc) {
        if (!doc.getElementById('scTopOfPageRefinementLinks')) {
            return;
        }
	var links = doc.evaluate("//a[@id='disableRefinement' and not(@class='disableRefinementListented')]",
				 doc, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        for(var i=0;i<links.length;i++)
        {
            links[i].addEventListener("click", disableRefinement, true);
            links[i].setAttribute("class", "disableRefinementListented");
        }

    }


    function getDescendents(node, tagName) {
	var arr = [];
	if (node && node.childNodes) {
	    var childNodes = node.childNodes;
	    for (var i = 0; i < childNodes.length; i++) {
		var child = childNodes.item(i);
		if (child.tagName && (!tagName || (child.tagName.toUpperCase() == tagName.toUpperCase()))) {
		    arr[arr.length] = child;
		}
		if (child.hasChildNodes()) {
		    arr = arr.concat(getDescendents(child, tagName));
		}
	    }
	}
	return arr;
    }

    function containsSubstring(text, substring) {
	return text && substring && (text.indexOf(substring) >= 0);
    }

    function loadHandler() {
	var appcontent = document.getElementById("appcontent");
	if (appcontent) {
	    appcontent.addEventListener("DOMContentLoaded", addRefinementLinks, false);
	}
	window.removeEventListener("load", loadHandler, false);
    }

    function unloadHandler(event) {
	window.removeEventListener("unload", unloadHandler, false);
    }

    // regex in the replace statement befuddles the indenting parser in tested hs-modes
   function makeRefinementQuery(refinement) {
     var query = refinement;
     var words = window.scRefinementQuery.replace(/"'\(\),/g, '').replace(/\+/g, ' ').split(' ');

     for (var i = 0; i < words.length; i++) {
       var word = words[i];
       if (!containsSubstring(query.toLowerCase(), word.toLowerCase())) {
	 query = query + ' ' + word;
       }
     }

     return query;
   }


   window.addEventListener("load", loadHandler, false);
   window.addEventListener("unload", unloadHandler, false);
 })();