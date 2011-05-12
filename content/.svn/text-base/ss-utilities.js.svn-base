/* *******************************************

 utility functions
 for skipscreen.js

 ******************************************* */

// declare globals
var TOOLS;

// instantiated as globals TOOLS
function SKIPSCREEN_TOOLS() {

    this.ONE_SECOND = 1000;

    this.minutesToSeconds = function (mins) {
	return mins * 60;
    };

    // returns a time-string like mm:ss
    this.formatSeconds = function (secs) {
	return parseInt(secs/60,10) + ":" + (secs%60 > 9 ? secs%60 : "0" + secs%60);
    };

    // CHANGE: no longer less, will return 1..range
    // note +- the offset, +- half the offset
    // ie, the offset is the range
    this.randomOffset = function (range) {
        //return ( -(range/2) + Math.floor(Math.random() * (range+1)));
	return ( Math.floor(Math.random() * (range+1)));
    };

    this.getSkipCount = function () {
        return GM_getValue('skipcount');
    };

    this.incrSkipCount = function () {
        var curr = this.getSkipCount();
        curr++;
        GM_setValue('skipcount', curr);
    };

}


// straight-up interface, no defaults
function enabled(prefName) {
    return GM_getValue(prefName);
}

function disabled (prefName) {
    // uses the GM-compiler's built-in function, with a redefined root
    var dfault = false; // this means if a pref does not exist, it's the same as disabled -- SO BUILD PREFS!

    // three-bangs = negated flag (it's a negative function name for a positive preference)
    var checker = GM_getValue(prefName+'active', dfault);
    return !!!checker;
}

// return Name, or mask that we use as a preference, if server is known by an alias
function getMask(prefName) {

    var mask = prefName;

    // all the various servers that operate for linkbucks
    var linkbucksreg = /linkbucks|baberepublic|blahetc|linkgalleries|linkseer|picturesetc|placepictures|qvvo|realfiles|seriousfiles|seriousurls|thatsprime|thesefiles|thesegalleries|thosegalleries|tinybucks|uberpicz|ubervidz|ubucks|ugalleries|urlpulse|viraldatabase|youfap|zxxo/i;
    if (linkbucksreg.exec(prefName)) {
        mask = "linkbucks";
    } else if (prefName == '4shared') {
        mask = 'fourshared';
    } else if (prefName.match('mega(upload|porn)')) {
		mask = 'megaupload';
    } else if (prefName == 'vip-file') {
		mask = 'letitbit';
	}

    return mask;

}

// wrapper function, for future expansion
function logIt(message) {
    GM_log(message);
}

function pathSplit(path) {
    return path.split('/');
}

function stripLocation(url) {

    // ditch the protocol (eg, "http://" "https://" "gopher://")
    // and the path (eg "http://sub.domain.tld/this/is/the/path.mp3")
    // leaving only "sub.domain.tld" (in this case)

    // equiv. to location.hostname BUT we use this on arbitrary paths (eg, sharebee)

    var idx = url.indexOf("://")+3;
    var Domain = url.substring(idx);
    idx = Domain.indexOf("/");
    Domain = Domain.substring(0, idx);

    return Domain;

}

// given a valid URL, return the hostname as an array
// http://jim.dandy.org/path/to/something.zip -> ['jim','dandy','org']
function domainToArray (url) {

    var sDomain = stripLocation(url);
    var aDomain = [];
    aDomain = sDomain.split('.');

    return aDomain;

}

// return the second-level domain name
// expects an array derived from splitting domain on "."
function getSecondLevelDomain(hostArray) {

    // scenarios:
    // ["www", "xradiograph", "com"]
    // ["www", "cs", "uofs", "edu"]
    // ["localhost"]

    // as it exists, code only works for the first two scenarios;
    // fails for third

    // TODO: raise a ruckus on unexpected data?
    // TODO: oh, yeah -- clean this up. ugh.
    var mainDomain;

    return hostArray[hostArray.length-2].toLowerCase();
}

// eg "com" "org" "to"
function getTLD(url) {
    // return the top-level domain of supplied url
    // expects an array derived from splitting domain on "."

    return url[url.length-1].toLowerCase();
}


function $id(id) {
    var elem;
    try {
        elem = document.getElementById(id);
    } catch(e) {}
    return elem;
}

function setStatus(text) {
    if(text == "" || text == null)
		return null;

    var ssBanner = $id("contactText"), ssOrig = null;

    if (ssBanner) {
        ssOrig = ssBanner.innerHTML;
        ssBanner.innerHTML = text;
    }

    return ssOrig;
}

// wrapper for getFirstResult - like the FireBug command-line, except only a single elem. returned
function $x1(expr) {
    return getFirstResult(expr, document);
}

// wrapper for getFirstResult - like the FireBug command-line, except only a single elem. returned
function $x(expr) {
    return getXpathResult(expr, document);
}


// Returns null if expr didn't match anything
function getFirstResult(expr, node){
    // if no node provided, default to document
    if (!node) {node = document;}
    var result = document.evaluate(expr, node, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
    return result.singleNodeValue;
}

// Returns null if expr didn't match anything
function getXpathResult(expr, node){
    // if no node provided, default to document
    if (!node) {node = document;}
    var result = document.evaluate(expr, node, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    return result;
}



// "creates" elemenent with supplied attributes
function makeElement(type, attributes){
    var node = document.createElement(type);
    for (var attr in attributes) if (attributes.hasOwnProperty(attr)){
        node.setAttribute(attr, attributes[attr]);
    }
    return node;
}

function multiDownload(array, site) {
	var ln = array.length;
	var oneOnly = false;
	
	//Pointless, so return
	if(ln == 0)
		return;
	
	//If there's more than one element, and
	//The user has multi_active disabled,
	//Just open the first link in a new tab
	if(ln != 1 && !enabled(site + "_multi_active")) {
		setStatus("Multi-part downloads disabled; first link opened in new tab.");
		ln = 1;
		oneOnly = true;
	}
	
	//Loop through all but the first links
	//And open in new tab
	for (var i = 0; i < (ln - 1); i++) {
		GM_openInTab(array[i]);
	}
	
	//If only opening one, open in a new tab
	//Else open the last in the same tab
	if (oneOnly) {
		GM_openInTab(array[ln - 1]);
	} else {
		document.location = array[ln - 1];
	}
}

function addHeaderCode(element, type, code, attributes) {

    var custElm;

    custElm = makeElement(element, attributes);
    if (type) {custElm.type = type;}
    custElm.innerHTML = code;

    document.getElementsByTagName('head')[0].appendChild(custElm);

}

// TODO: it's an action with a noun's name. ouch.
function errorHandler(error, site) {

    if (!site) { site = ""; }

    var msg = "SkipScreen -  " + site + " generated error:\n\n" + error;
    if (enabled("errordisplay")) { alert(msg); }
    logIt(msg);

    // http://www.xs4all.nl/~jlpoutre/BoT/Greasemonkey/gm_openintab.html
    // open messages in a new tab for info....
    //GM_openInTab("data:text/plain;charset=UTF-8," + encodeURI(smsg);


}

// new version, using the redesigned display
function prominence2(seconds, endFunction) {

    // TODO: clean this magic-string nonsense up a bit....
    var content =
	  '<!-- Your content goes here -->\n'
	+ '   <div id="ss-popup-content">\n'
	+ '	<p class="ss-popup-header">SkipScreen is working on your download.</p>\n'
	+ ' \n'
	+ '	<div class="ss-popup-progressbar">\n'
	+ '	  <div id="ss-popup-test" class="ss-progressbar-completed" style="width:0;">\n'
	+ '	    <div>&nbsp;</div>\n'
	+ '	  </div>\n'
	+ '	</div><!-- end progress -->\n'
	+ ' \n'
	+ '	<p id="ss-time">Working....</p>\n'
	+ '\n'
    	+ '    <div>'
	+ '	<br/><p class="ss-popup-message">Leave this window open and your file will download when ready.<br />\n'
	+ '	In other words &mdash; you\'re free to go!</p>\n'
	+ '	<p class="ss-popup-footer">Problems? Questions? Suggestions? <a href="mailto:skipper@skipscreen.com">Email us</a>\n'
	+ '	or <a href="http://getsatisfaction.com/skipscreen/">GetSatisfaction.</a></p>\n'
    	+ '    </div>\n'
	+ ' \n'
	+ '      </div> <!-- end id=ss-popup-content -->\n';

    var popup = makeElement('div', {id: 'ss-popup'});
    popup.innerHTML = content;


    // Append Divs
    var objBody = document.getElementsByTagName("body")[0];
    // exit if no body -- some weird errors...
    if (objBody) {objBody.appendChild(popup);}
    jQuery('#ss-popup').jqDrag();

    addHeaderCode('style', 'text/css', prominentCSS);

    $id('ss-time').innerHTML = ''+seconds;

    // TODO: stop using jQuery for this..
    jQuery('#ss-popup-test').animate({
	width: '300px'
    }, (seconds * 1000), function() {
	// Animation complete.
	$('#ss-time')[0].innerHTML = 'Complete!';
	endFunction();
    });




} // end prominence



function prominence(msg) {

    // create main div
    var prom = makeElement('div', {id: "prom", 'class': 'prom' });
    var anchor = makeElement('a', {href: "#", title: "close (does not cancel download)", 'class': 'closer' });
    anchor.innerHTML = "x";

    var remover = function () {document.getElementById('prom').style.display = "none"; };
    anchor.addEventListener('click', remover, false);

    var cont = makeElement("div", {'id': 'prom-content'});
    cont.innerHTML = msg;

    prom.appendChild(anchor);
    prom.appendChild(cont);

    // Append Divs
    var objBody = document.getElementsByTagName("body")[0];
    // exit if no body -- some weird errors...
    if (objBody) {objBody.appendChild(prom);}

    // if jquery Drag-n-Resize exists, use it
    if (typeof jQuery != 'undefined') $('#prom').jqDrag();

    var prominentCSS = '.prom {'
        + 'position: fixed;'
        + 'z-index: 9999999;'
        + 'top: 50%;'
        + 'left: 50%;'
        + 'margin-top: -100px;'
        + 'margin-left: -150px;'
        + 'width: 300px;'
        + 'height: 200px;'
        + 'background: #C8FFCA;'
        + 'opacity: 0.9;'
        + 'color: #008000;'
        + 'border: 10px solid #349534;'
        + 'text-align: center;'
        + 'font-size: 14px;'
        + 'font-family: verdana;'
        + '}'

        + '.prom-auto {'
        + 'color: #349534;'
        + 'font-weight: bold;'
        + '}'

        + '.prom-host {'
        + 'color: red;'
        + '}'

        + '#prom-content {'
        + 'padding: 10px;'
        + '}'

        + '.prom p {'
        + 'margin: 0;'
        + 'padding: 5px 10px; '
        + 'text-align: center;'
        + '}\n'

        + '.prom a {'
        + 'color: #000;'
        + '}\n'

        + '.prom a.closer {'
        + 'float: right;'
        + 'text-decoration: none;'
        + 'font-weight: bold;'
        + 'color: #fff;'
        + 'background-color: #000;'
        + 'border-left: 1px solid #333;'
        + 'border-bottom: 1px solid #333;'
        + 'line-height: 9px;'
        + 'padding: 0 2px 1px;'
        + 'margin-left: 2px; }';

    addHeaderCode('style', 'text/css', prominentCSS);

} // end prominence


// TODO: optionally use pre-exisiting timer... eg, don't double-display
function genericWaiter(seconds, gwHostStr, endFunction, useNativeTimer) {

    var msg = "<p class='prom-host'>" + gwHostStr + " is making you wait.</p>"
        + "<p class='prom-auto'>But leave this window open, and SkipScreen will"
	+ " download your file automatically when it's available.</p>"
	+ "<p>(in other words, you're free to go)</p>"
        + "<p id='remaining'>Preparing to skip</p>";

    prominence(msg);


    if (jQuery('#ss-time')[0]) {
	jQuery('#ss-time')[0].innerHTML = ''+seconds;

	jQuery('#ss-popup-test').animate({
	    width: '300px'
	}, (seconds * 1000), function() {
	    // Animation complete.
	    jQuery('#ss-time')[0].innerHTML = 'Complete!';
	});
    }


    // NOTE: as this is added to the page
    // TOOLS and $id needed to be added to the namespace, as well...
    var waiter = setInterval( function() {
        --seconds;
        if (seconds <= 0) {
            clearInterval(waiter);
            document.title = "{SS} Download started!";
            var r = $id("remaining");
            if (r) r.innerHTML = "<p style='color: blue'>Download started!</p>";
            endFunction();
        } else {
            var msg = TOOLS.formatSeconds(seconds) + " remaining";
            document.title = "{SS} "+ msg + " (" + gwHostStr + ")";
            var rem = $id("remaining");
            if (rem && !useNativeTimer) rem.innerHTML = msg;
        }
    }
                              , TOOLS.ONE_SECOND );
} // end genericWaiter

function share () {

    this.incrCount = function () {
        var TOOLS = new SKIPSCREEN_TOOLS();
        TOOLS.incrSkipCount();
    };

    this.getCount = function () {
        return TOOLS.getSkipCount();
    };

    this.getDate = function () {
        var dfault = Date();
        var first = new Date(GM_getValue("firstskipdate", dfault ));
	return this.formatDate(first);
    };

    this.formatDate = function(fdate) {
	if (!fdate) fdate = new Date();
	var curr_date = fdate.getDate();
	var curr_month = fdate.getMonth();
	curr_month++;
	var curr_year = fdate.getFullYear();
	return "" + curr_year + "/" + curr_month + "/" + curr_date;
    };

    // wrapper used when calling from page-embedded timers
    this.soloShow = function () {
	//        this.getCount = function() {return ssCount;}; // TODO: cookie-based
        this.getCount = function() {
	    if (typeof getCount == 'undefined') {
		return 2;
	    } else {
		return getCount();
	    } }; // TODO: cookie-based
        this.incrCount = function() {return;}; // TODO: cookie-basedthis.incrCount = function() {
        this.getDate = function() { return this.formatDate(); };
        this.show();
    };

    this.show = function() {

        if (disabled("sharescreen")) {return;}
        addShareStyle();

        // promo-rotator iFrame source
        var ssResource = 'http://www.SkipScreen.com/search/ss-inside.html?skipper&ver=' + ssVersion + '&abp=' + abpEnabled;

        this.incrCount();
        var count = this.getCount();

        var shareText = makeElement('div', {id: 'SS-Share', style: 'display:none'} );
        shareText.innerHTML = '    <div id="top-bar">'

            + '    <div id="top-bar-right">'
            + '     <a href="http://getsatisfaction.com/skipscreen/">Bugs? Suggestions?</a>'
            + '    </div>'

            + '    <div id="top-bar-left">'
            + '     <a href="#" id="close-box">&larr; Close post-download</a>'
            + '    </div>'

            + '    <div id="top-bar-center">'
            + '     <strong><a href="http://www.skipscreen.com">SkipScreen</a></strong>'
            + '     has helped download more than ' + count + ' files since ' + this.getDate()
            + '    </div>'

            + '   </div>'

            + '   <div id="mainContent">'

            + ' <div style="clear: both;"></div>'

            + ' <div id="bottom-section">'
            + '       <div id="rotator">'
	//            + '         <iframe name="ssPromo" id="ssPromo" width="800" height="580" src="' + ssResource + '"'
            + '         <iframe name="ssPromo" id="ssPromo" width="800" height="680" src="' + ssResource + '"'
            + '         frameborder="0" scrolling="no"></iframe>'
            + '       </div>'
            + '     </div>'

            + '   </div>'

            + '   <div id="footer-bar">'
            + ' psyched about skipscreen?'
            + ' tell a friend about SkipScreen on '
            + '<a href="http://www.facebook.com/sharer.php?u=http://www.SkipScreen.com?t=Iskp that Isht" target="_blank">Facebook</a> '
            + 'or <a href="http://twitter.com/home?status=I+use+the+SkipScreen+%23FirefoxExtension+to+speed+my+downloads%3A+http%3A%2F%2Fwww.SkipScreen.com" target="_blank" >Twitter.</a>'
            + '   </div>'

        ;


        document.body.appendChild(shareText);

        var closeit = function () {document.getElementById('SS-Share').style.display = "none";
                                   document.getElementById("skipscreen").style.display = "block"; };


        var cb = document.getElementById("close-box");
        if (cb) {cb.addEventListener('click', closeit, false);}

        setTimeout ( function () { document.getElementById("skipscreen").style.display = "none";
                                   document.getElementById("SS-Share").style.display = "block";
                                   $id('ssPromo').src = ssResource;  // refresh to force display
				 } , 500 ); // two seconds averages out to be around the dl time w/ server differences

    }; // end this.show

} //end var share


function addShareStyle() {
    // Append CSS
    addHeaderCode('style', 'text/css',
                  '#SS-Share {'
                  +      'font-family: helvetica, sans-serif;'
                  +      'font-size: 14px;'
                  +      'background-color: white;'
		  //                  +      'opacity: 0.9;'
                  +      'margin: 0;'
                  +      'padding: 0;'
                  +      'position: fixed;'
		  //                  +      'position: absolute;'
                  +      'top: 0;'
                  +      'left: 0;'
                  +      'top: 0;'
                  +      'left: 0;'
                  +      'width: 100%;'
		  //                  +      'height: 780px;'
                  +      'height: 100%;'
                  +      'z-index: 9999999;'
                  + '}'

                  + '#top-bar {'
                  +     'width: 100%;'
                  +     'background-color: #393;'
                  +     'color: white;'
                  +     'height: 44px;'
                  +     'line-height: 14px;'
                  + '}'

                  + '#top-bar-left {'
                  +     'float: left;'
                  +     'padding: 15px;'
                  + '}'

                  + '#top-bar-center {'
                  +     'width: 500px;'
                  +     'margin: 0 auto 0 auto;'
                  +     'padding: 15px;'
                  +     'text-align: center;'
                  + '}'

                  + '#top-bar-right {'
                  +     'float: right;'
                  +     'padding: 15px; '
                  + '}'

                  + '#top-bar a, top-bar a:visited {'
                  +     'color: white;'
                  + '}'


                  + '#mainContent {'
                  +     ''
                  +     'width: 650px;'
                  +     'margin: 0px auto 0px auto;'
                  +     'color: #444;'
                  +     'line-height: 1.7em;'
                  +     'position: relative;'
                  +     ''
                  + '}'

                  + 'a img {'
                  +     'border: none;'
                  + '}'

                  + 'a, a:visited {'
                  +     'color: #333;'
                  + '}'

                  + '#top-section {'
                  +     'text-align: center;'
                  +     'font-size: 15px;'
                  +     'padding: 40px;'
                  +     'color: #555;'
                  + '}'

                  + '#top-section a, #top-section a:visited {'
                  +     'color: #555;'
                  + '}'

                  + 'h3 {'
                  +     'font-size: 18px;'
                  +     'padding: 0;'
                  +     'margin: 0;'
                  +     'font-weight: normal;'
                  +     'text-align: center;'
                  +     'color: #000;'
                  + '}'

                  + '.small-text {'
                  +     'color: #888;'
                  +     'font-size: 12px;'
                  + '}'

                  + '.small-white {'
                  +     'color: #ded;'
                  +     'font-size: 10px;'
                  +     'padding-top: 7px;'
                  + '}'


                  + 'p {'
                  +     'margin: 0px 0 14px 30px;'
                  + '}'


                  + '#top-left {'
                  +     'margin:  10px 0 0 0px;'
                  +     'font-size: 15px;'
                  +     'width: 220px;'
                  +     'float: left;'
                  + '}'

                  + '.section-topper {'
                  +     'padding: 5px 5px 5px 0px;'
                  +     'line-height: 15px;'
                  +     'font-size: 15px;'
                  +     'color: white;'
                  + '}'
                  + '.section-topper strong {'
                  +     'color: black;'
                  + '}'

                  + 'ul {'
                  +     'margin: 0;'
                  +     'padding: 0;'
                  +     'list-style-type: none;'
                  + '}'

                  + 'li {'
                  +     'padding: 5px;'
                  +     'margin: 0;'
                  +     'line-height: 15px;'
                  +     'color: white;'
                  + '}'

                  + 'li:hover {'
                  +     'color: #333;'
                  +     'background-color: #dfd;'
                  + '}'

                  + 'li a, li a:visited {'
                  + '}'

                  + '#top-middle {'
                  +     'margin:  10px 0 0 20px;'
                  +     'font-size: 13px;'
                  +     'width: 340px;'
                  +     'float: left;'
                  +     'color: #666;'
                  + '}'

                  + '#top-middle a, #top-middle a:visited {'
                  +     'color: #666;'

                  + '}'

                  + 'input {'
                  +     'padding: 3px;'
                  +     'font-size: 13px;'
                  + '}'

                  + '#top-right {'
                  +     'margin:  30px 0 0 0px;'
                  +     'width: 20px;'
                  +     'float: left;'
                  +     'background-color: #fff;'
                  + '}'


                  + '#quotes {'
                  +     'color: #ca2f05;'
                  + '}'

                  + '#bottom-section {'
                  +     'padding: 40px 24px 0 0px;'
                  +     'margin: 0px 0 0px 0;'
                  +     'height: 100%;'
                  + '}'


                  + '#footer-bar {'
                  +      'width: 100%;'
                  +      'background-color: #393;'
                  +      'color: white;'
                  +      'height: 14px;'
                  +      'line-height: 14px;'
                  +      'padding: 15px 0 15px 0;'
                  +      'text-align: center;'
                  +      'margin: 0;'
                  +      'position: absolute;'
                  +      'bottom: 0px;'
                  + '}'

                  + '#footer-bar a, #footer-bar a:visited {'
                  +     'color: white;'
                  + '}'

                 );

}

// add all scripts need for running sharing-code directly on page
function addSharingScripts () {

    addHeaderCode('script', null, share, {language: 'javascript' });
    addHeaderCode('script', null, prominence, {language: 'javascript' });
    addHeaderCode('script', null, SKIPSCREEN_TOOLS, {language: 'javascript' });
    addHeaderCode('script', null, $id, { language: 'javascript' });
    addHeaderCode('script', null, makeElement, { language: 'javascript' });
    addHeaderCode('script', null, addHeaderCode, { language: 'javascript' });
    addHeaderCode('script', null, addShareStyle, { language: 'javascript' });
    // becuase sharescreen (the post-download page) can be disabled, and the disabled check is GM-only
    // we need to add the function as a pre-coded check when adding to page context
    addHeaderCode('script', null, 'function disabled() { return ' + disabled('sharescreen') + '; } ', {language: 'javascript' });
}

// put contact-info on managed pages
function addContactInfo(optionalMessage) {

    if (window != top) {return;}

    logIt("adding contact info: " + document.location);

    // ensure only one instance added to page (to prevent clone-stacking)
    var alreadyExists = getFirstResult("//div[@id='skipscreen']", document);
    if (alreadyExists) {return;}

    var contactLink = "http://getsatisfaction.com/skipscreen/";
    var message = optionalMessage ? optionalMessage : "SkipScreen bugs?  Ideas?  Screens that need skipping?";

    // create main div
    var contactBody= makeElement('div', {id: "skipscreen", 'class': 'msgbox' });
    var anchor = makeElement('a', {href: "#", title: "close SkipScreen info", 'class': 'closer' });
    anchor.innerHTML = "x";

    var removeContact = function () {document.getElementById('skipscreen').style.display = "none"; };
    anchor.addEventListener('click', removeContact, false);

    var contactText = document.createElement('p');
    //'SkipScreen bugs?  Ideas?  Screens that need skipping? <a href="http://getsatisfaction.com/skipscreen/">contact us!</a>'
    message = '<span id="contact-message">' + message + '</span>';
    contactText.innerHTML = message + " <a href='" + contactLink + "'>contact us!</a>";
    contactText.id = 'contactText';

    contactBody.appendChild(anchor);
    contactBody.appendChild(contactText);

    // Append Divs
    var objBody = document.getElementsByTagName("body")[0];
    // exit if no body -- some weird errors...
    if (objBody) {objBody.appendChild(contactBody);}

    // Append CSS
    var contactCSS = '.msgbox {'
        + 'position: fixed;'
        + 'z-index: 9999999;'
        + 'bottom: 0px;'
        + 'left: 0px;'
        + 'background: #C8FFCA;'
        + 'opacity: 0.8;'
        + 'color: #008000;'
        + 'border: 1px solid #349534;'
        + 'text-align: left;'
        + 'font-size: 11px;'
        + 'font-family: verdana;'
        + 'font-weight: bold; }'

        + '.msgbox p {'
        + 'margin: 0;'
        + 'padding: 5px 10px; '
        + 'float: left;'
        + 'max-width: 97%;'
        + '}\n'

        + '.msgbox a {'
        + 'color: #000;'
        + '}\n'

        + '.msgbox a.closer {'
        + 'float: right;'
        + 'text-decoration: none;'
        + 'font-weight: bold;'
        + 'color: #fff;'
        + 'background-color: #000;'
        + 'border-left: 1px solid #333;'
        + 'border-bottom: 1px solid #333;'
        + 'line-height: 9px;'
        + 'padding: 0 2px 1px;'
        + 'margin-left: 2px; }';

    GM_addStyle(contactCSS);

} // addContactInfo


var prominentCSS = '.prom {\n'
    + 'position: fixed;\n'
    + 'z-index: 9999999;\n'
    + 'top: 50%;\n'
    + 'left: 50%;\n'
    + 'margin-top: -100px;\n'
    + 'margin-left: -150px;\n'
    + 'width: 300px;\n'
    + 'height: 200px;\n'
    + 'background: #C8FFCA;\n'
    + 'opacity: 0.9;\n'
    + 'color: #008000;\n'
    + 'border: 10px solid #349534;\n'
    + 'text-align: center;\n'
    + 'font-size: 14px;\n'
    + 'font-family: verdana;\n'
    + '}\n'

    + '.prom-auto {\n'
    + 'color: #349534;\n'
    + 'font-weight: bold;\n'
    + '}\n'

    + '.prom-host {\n'
    + 'color: red;\n'
    + '}\n'

    + '#prom-content {\n'
    + 'padding: 10px;\n'
    + '}\n'

    + '.prom p {\n'
    + 'margin: 0;\n'
    + 'padding: 5px 10px; \n'
    + 'text-align: center;\n'
    + '}\n\n'

    + '.prom a {\n'
    + 'color: #000;\n'
    + '}\n\n'

    + '.prom a.closer {\n'
    + 'float: right;\n'
    + 'text-decoration: none;\n'
    + 'font-weight: bold;\n'
    + 'color: #fff;\n'
    + 'background-color: #000;\n'
    + 'border-left: 1px solid #333;\n'
    + 'border-bottom: 1px solid #333;\n'
    + 'line-height: 9px;\n'
    + 'padding: 0 2px 1px;\n'
    + 'margin-left: 2px; }\n'


    + '#ss-popup {\n'
    + '    position: fixed;\n'
    + '    z-index: 999;\n'
    + '    top: 50%;\n'
    + '    left: 50%;\n'
    + '    margin-left: -300px;\n'
    + '    margin-top: -150px;\n'
    + '    width: 600px;  \n'
    + '    height: 300px; \n'
    + '    opacity: 1;\n'
    + '    color: #000;\n'
    + '}\n'

    + '#ss-popup p {\n'
    + '    margin: 5px 0 5px 0px;\n'
    + '    padding: 0px;\n'
    + '}\n'

    + '#ss-popup-content{\n'
    + '    padding: 15pt 30pt;\n'
    + '    font-family: arial;\n'
    + '    height: 300px;\n'

    + '}\n'

    + '.ss-popup-header {\n'
    + '    font-size: 24px;\n'
    + '    font-family: arial;\n'
    + '    font-weight: bold;\n'
    + '    line-height: 30px;\n'
    + '}\n'

    + '.ss-popup-message {font-size: 14px; \n'
    + '    font-weight: normal;\n'
    + '    color: #fff;\n'
    + '}\n'

    + '.ss-popup-footer {font-size: 12px;\n'
    + '    font-weight: normal;\n'
    + '    color: #fff;\n'
    + '}\n'

    + '.text1 {text-align: center;}\n'

    + '/*= Core CSS progress bar code */\n'
    + '.ss-popup-progressbar {\n'
    + '    width: 300px;\n'
    + '    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAA8CAMAAADrAndoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYBQTFRFMqvpi5GUIq3hasz5BpvQ+/v7Bne7CJXMUsX2FanbCsbhd8LvSa/o2dvce8z1bNH6I53eg8nxCrrbKbHlGqveTcL0xcrNGqPbqa6xstbwXsn6FJLTYc75dMn0EYnNIafeEKHUWcn4abjmVcn1GXuwKaPjZc36Xcz4EJvTHp3aVbnqPrjvOLbsbsb0MLLoNLDqZsr5Ycr6D6XWtdjxFKPYBonCfcXwJaThLq3nSLXp+Pn5Wcz2rtTwSb/zOrLtPLXuKK7kDYLG6uvs8/T1CK/UYcf5Bny/NqPZ9fb3LqjnBYLCDY3K8fLyZtD6NrPrE47QXMH04uPkWMj5Bo/IMZ7aB5/THpLUq9HtpMzpGZTLV8f4MaTkvsTHMJTLDYbHG5fYCKXPt9nx9vb2cMf07/DxF5zYCmqf+fr67u/w/f399/f49PX2/Pz85ufoEKjYbs75N7XrN67sJ6rj5+jp8/PzlpueasLwn6Sntbu99PX1QaffJYe9dLTe/v7+////////E8njFQAAAIB0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA4BUtnAAADRElEQVR42uzWW0MSQRiH8SFTNKG2A0pppGQp29EsazErMMF0CygCFEFTQrNzAipY+9Wb5binmR0QlYv354U3ufP+n6uQZAOMJGRzJxLx+PNWXWUzRfSJ2RQF4xktz4zHEwm3DRUP3W53/1FNs7nYZozPTh95Xz+OdFhERfyrULjXlM266+bOnxCGUzYVmltcKOBMciyeD4fnW/CQoIvqZ9vQ3yFdN9+ScJjncawgj2OtXGM0qXHb3NuqC8ek9v0u81MmdVh3r+BYfBBFeYF39K6QvVcaVZE/M643TKTpR9IoQFLfT37L4DD5XvUC1ThKhF4HzhRFKV4QZh29zdDWHNWakY0bG24bwgPj5ddntDfpUjQ12TErCHwKpQQbrkXjoKB8/6apmZaYfZU+moIaQRCKAo4VjCYR+k32Qu8l0Z0OQ77UYBYlAkLJaDCFSkEumky+0UN6D4y9I/hFcfdIaF8mXUM43mCmQYxkMspFS6jExTiOu0Wl+rtnZu53CNNDVbPoBXCimBzLE4uteTiKpzp/SF4xuNw2LK8RT9WvojXg1mIxTwmNLbtCOBeBR2mw7IapMx3B/M7KHtVEUodYLORaHsOxfC5XKDREUv63nxUGCfoqrnSQ6kmki5WryjOJEUIhl8snx1ry+dIuQ6GK2l9MNMifH5E9Juk7VcSzykfL1yvGNIqUGbdI+3xLOFa6JxDw6aRrlmqGrPKPdUJnRO2RsR/HiPCk5jD95VZreVN9Yn20vkcg0LM4hrKBHq1Aw2LVk4oPDVa1syQfTxDxCM2xihnVYbWdiun6LFmUzQbqLTRJ6hXwHesVr9UuEZw7fYTLNAOqs9YroVUl1U1wxp4skrKAkYQkwAxiQSyIBbEgFsQCEAtiQSyIBbEgFoBYEAtiQSyIBbEAxGoq1gBgJKEB+0Y3YLBhH0Crue5/gEF3bhWtzkEstlhzEKupWPu5rb+AwVZuH2I1FUv0fgEMvOI+coreb4CBV3QiZ2YH/g/FYieDY20vbAEGC9tyrAMvYHCAY+35czuAQc6/h2OJC4CBiGPl/eJXwED051F+NzMHGGR2cayIfxsw8EfyyGKPfAcMInYLsjjtgInTgiQLYCT9F2AA2I48yNMa6GoAAAAASUVORK5CYII%3D)\n'
    + '      no-repeat 0 -40px;\n'
    + '    float: left;\n'
    + '}\n'

    + '.ss-progressbar-completed {\n'
    + '    height: 20px;\n'
    + '    margin-left: -1px;\n'
    + '    background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAA8CAMAAADrAndoAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAYBQTFRFMqvpi5GUIq3hasz5BpvQ+/v7Bne7CJXMUsX2FanbCsbhd8LvSa/o2dvce8z1bNH6I53eg8nxCrrbKbHlGqveTcL0xcrNGqPbqa6xstbwXsn6FJLTYc75dMn0EYnNIafeEKHUWcn4abjmVcn1GXuwKaPjZc36Xcz4EJvTHp3aVbnqPrjvOLbsbsb0MLLoNLDqZsr5Ycr6D6XWtdjxFKPYBonCfcXwJaThLq3nSLXp+Pn5Wcz2rtTwSb/zOrLtPLXuKK7kDYLG6uvs8/T1CK/UYcf5Bny/NqPZ9fb3LqjnBYLCDY3K8fLyZtD6NrPrE47QXMH04uPkWMj5Bo/IMZ7aB5/THpLUq9HtpMzpGZTLV8f4MaTkvsTHMJTLDYbHG5fYCKXPt9nx9vb2cMf07/DxF5zYCmqf+fr67u/w/f399/f49PX2/Pz85ufoEKjYbs75N7XrN67sJ6rj5+jp8/PzlpueasLwn6Sntbu99PX1QaffJYe9dLTe/v7+////////E8njFQAAAIB0Uk5T/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////wA4BUtnAAADRElEQVR42uzWW0MSQRiH8SFTNKG2A0pppGQp29EsazErMMF0CygCFEFTQrNzAipY+9Wb5binmR0QlYv354U3ufP+n6uQZAOMJGRzJxLx+PNWXWUzRfSJ2RQF4xktz4zHEwm3DRUP3W53/1FNs7nYZozPTh95Xz+OdFhERfyrULjXlM266+bOnxCGUzYVmltcKOBMciyeD4fnW/CQoIvqZ9vQ3yFdN9+ScJjncawgj2OtXGM0qXHb3NuqC8ek9v0u81MmdVh3r+BYfBBFeYF39K6QvVcaVZE/M643TKTpR9IoQFLfT37L4DD5XvUC1ThKhF4HzhRFKV4QZh29zdDWHNWakY0bG24bwgPj5ddntDfpUjQ12TErCHwKpQQbrkXjoKB8/6apmZaYfZU+moIaQRCKAo4VjCYR+k32Qu8l0Z0OQ77UYBYlAkLJaDCFSkEumky+0UN6D4y9I/hFcfdIaF8mXUM43mCmQYxkMspFS6jExTiOu0Wl+rtnZu53CNNDVbPoBXCimBzLE4uteTiKpzp/SF4xuNw2LK8RT9WvojXg1mIxTwmNLbtCOBeBR2mw7IapMx3B/M7KHtVEUodYLORaHsOxfC5XKDREUv63nxUGCfoqrnSQ6kmki5WryjOJEUIhl8snx1ry+dIuQ6GK2l9MNMifH5E9Juk7VcSzykfL1yvGNIqUGbdI+3xLOFa6JxDw6aRrlmqGrPKPdUJnRO2RsR/HiPCk5jD95VZreVN9Yn20vkcg0LM4hrKBHq1Aw2LVk4oPDVa1syQfTxDxCM2xihnVYbWdiun6LFmUzQbqLTRJ6hXwHesVr9UuEZw7fYTLNAOqs9YroVUl1U1wxp4skrKAkYQkwAxiQSyIBbEgFsQCEAtiQSyIBbEgFoBYEAtiQSyIBbEAxGoq1gBgJKEB+0Y3YLBhH0Crue5/gEF3bhWtzkEstlhzEKupWPu5rb+AwVZuH2I1FUv0fgEMvOI+coreb4CBV3QiZ2YH/g/FYieDY20vbAEGC9tyrAMvYHCAY+35czuAQc6/h2OJC4CBiGPl/eJXwED051F+NzMHGGR2cayIfxsw8EfyyGKPfAcMInYLsjjtgInTgiQLYCT9F2AA2I48yNMa6GoAAAAASUVORK5CYII%3D)\n'
    + '       no-repeat 1px 0;\n'
    + '}\n'

    + '#ss-time {\n'
    + '    padding: 0 0 0 5px;\n'
    + '}\n'

    + '#ss-popup-content {\n'
    + '      background :url(data:image/png;base64,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jYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbBKBgFo2BEAoAAGm0EjYJRMApGwSgYBaNgRAKAABptBI2CUTAKRsEoGAWjYEQCgAAabQSNglEwCkbB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%3D%3D) \n'
    + '      no-repeat 100% 0;\n'
    + '}\n';