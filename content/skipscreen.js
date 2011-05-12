// for JsLint -- see http://www.jslint.com/lint.html
/* global GM_getValue GM_log unsafeWindow XPathResult */


// @name        SkipScreen
// @namespace   http://www.SkipScreen.com
// @author      Worcester LLC (for the purposes of copyright)
// @developer   Michael Paulukonis
// @developer   Ben Beadle
// @license     see ../license.txt

// start is at the end....

var skipscreen =  {};

skipscreen.lix = function() {

    var button = $x1("//input[@value='continue']");

    if(button) {
        button.click();
        return;
    }

    var iframe = document.getElementsByTagName("iframe");

    if (iframe.length != 0) {
        var href = iframe[0].src;
        window.location.href = href;
        return;
    }
};

skipscreen.filesonic = function() {

    var freeUrl = $id("free_download").href;

    var contFunc = function() {
	if ($id("password")) {
	    document.title = "{SS} Password Protected";
	    return;
	}

	// why - 1 ???
	var time = unsafeWindow.countDownDelay - 1;
	var url = unsafeWindow.downloadUrl;

	var finishFunc = function() {
	    TOOLS.incrSkipCount();
	    window.location.href = url;
	    new share().show();
        };

	genericWaiter(time, 'FileSonic', finishFunc, true);
    };

    // TODO: dangerous: if elements change, this will throw errors
    jQuery("#downloadMode").attr("id", "premiumMessages").html("").load(freeUrl, contFunc);

};

skipscreen.remixshare = function() {

    if(unsafeWindow.noway) {
        window.location.href = unsafeWindow.noway;
        new share().show();
    } else {
        var elements = $x("//td/a");
        var href = Array();

        for(var i = 0; i < elements.snapshotLength; i++)
	    href.push(elements.snapshotItem(i).href.replace(/download\.php/, ""));

        multiDownload(href, "remixshare");
    }
};

skipscreen.multiupload = function() {

   if($id("downloadbutton_")) {
      window.location.href = $x1("//div[@id='downloadbutton_']/a").href;
      new share().show();
      }
};


// added August 2010
// from anonymous coder donor
skipscreen.letitbit = function() {
    var firstSkip = getFirstResult("//div[@id='dvifree']/div[2]/form", document);

    if (firstSkip) {
        firstSkip.submit();
        return;
    }

    var secondSkip = getFirstResult("//div[@id='dvisms']/div/form", document);
    if (secondSkip) {
        secondSkip.submit();
        return;
    }

    // there  is a capcha but it works fine yet if we just submit the form with blank edit box
    var thirdSkip = getFirstResult("//form[@id='dvifree']", document);
    if (thirdSkip) {
        thirdSkip.submit();
        return;
    }

    //last stage waiting for a link
    // we cannot skip it cause  counter start time stored in PHP_SESSION :(
    // TODO: OSD for countdown
    var dlfr = getFirstResult("//frame[@id='topFrame']");
    if (dlfr) {
        var wait;

        var remain = dlfr.contentDocument.getElementById('errt');
        if (remain) {
	    wait = remain.innerHTML;
        } else{
	    wait = 60;
        }

        var adv;
        var fileName;

        var timer = setInterval( function() {
	    wait--;
	    if (wait < 0) {
                clearInterval(timer);

                var adv = dlfr.contentDocument.getElementsByTagName('form');
                if ( adv.length > 0 ) {
		    adv = adv[0];
		    adv.style.display = "none";
                }

                var href = dlfr.contentDocument.getElementsByTagName('a');
                if (href.length > 0) {
		    href = href[0];
		    document.location = href.href;

		    href.setAttribute('onclick', '');

		    document.title = "starting download! {SkipScreen}";
		    var ct = $id("contactText");
		    if (ct) {
                        ct.innerHTML = 'SkipScreen bugs?  Ideas?  Screens that need skipping? <a href="http://getsatisfaction.com/skipscreen/">contact us!</a>';
		    }
		    var prom = $id("prom");
		    if (prom) prom.style.display = "none";
		    new share().soloShow();

                }
	    } else {
                if (!adv) {
		    adv = dlfr.contentDocument.getElementsByTagName('form');
		    if ( adv.length > 0 ) {
                        adv = adv[0];
                        adv.style.display = "none";
		    }
                }

                if ( !fileName ) {
		    fileName = dlfr.contentDocument.getElementsByName('name');
		    if (fileName.length > 0) {
                        fileName = fileName[0].value;
		    } else {
                        fileName = '';
		    }
                }
                document.title = "{SS} " + (wait) + " " + fileName;
	    }
        }, 1000);

    }
}; // end letitbit


// added May 2010
skipscreen.easyshare = function() {
    // <p class="pt15 pb50 px60 family2 c" id="freeTimer">Wait 49 seconds</p>

    ///html/body/div[4]/div[2]/div[2]/form/p/span/input

    if(document.getElementsByClassName("msg-err").length != 0)
    {
        return;
    }

    var download = function() {

        var dl = jQuery('[value=Download]');
        if (dl && dl[0]) {
	    new share().show();
	    dl[0].click();
        }
        // if not found, wait 10 seconds, try again... 6 times?
        var tries = 0;
        var retry = setInterval( function() {
	    var dl = jQuery('[value=Download]');
	    if (dl && dl[0]) {
                clearInterval(retry);
                new share().show();
                tries = 6;
	    }
	    if (++tries >= 6) {
                clearInterval(retry);
	    }
        } , 10000 );


    };

    download();

    // if we get this far, we're attaching everything to the page, so we need to attach the scripts...
    addSharingScripts();

    var timerMatch = /[0-9]+ seconds/;
    var x = jQuery('#freeTimer');
    var seconds = 0;
    if (x[0] && x[0].innerHTML && x[0].innerHTML.match(timerMatch)) {
        seconds = parseInt(x[0].innerHTML.match(/[0-9]+/),10) + TOOLS.randomOffset(20);
    }

    prominence2(seconds, download);

}; // end easyshare


skipscreen.filestube = function() {
    //    /html/body/div[4]/div[3]/div[2]/div[3]/table/tbody/tr/td
    var links = $x1('//*[@id="copy_paste_links"]');

    // "http://rapidshare.com/files/292974409/Open_Office-3.1-CW.part1.rar<br>http://rapidshare.com/files/293430853/Open_Office-3.1-CW.part2.rar<br>"
    if (links && links.innerHTML) {

	var a = links.getElementsByTagName("a");
	var ls = Array();

	if(a.length == 0) {
	    //If there is no <br, then that means there is only one link.
	    if ((links.innerHTML.indexOf("\n") > 1)) {
		ls = links.innerHTML.split(/\n/);

		// if empty entry, so delete it
		if (ls[ls.length - 1] == '') {ls.pop(); }
	    }
	    else {
		ls[0] = links.innerHTML;
	    }
	}
	else {
	    for (var i = 0; i < a.length; i++) {
		ls.push(a[i].href);
	    }
	}

	//http://stackoverflow.com/questions/2299604/javascript-convert-textarea-into-an-array
        multiDownload(ls, "filestube");
        return;
	var ln = ls.length;
	var oneOnly = false;
	if (!enabled("filestube_multi_active") && ln != 1) {
	    var text = $id("contact-message");
	    if (text) {
		text.innerHTML = "Multi-part downloads disabled; first link opened in new tab.";
	    }
	    //return;
	    oneOnly = true;
	    ln = 1; // if not multi-part, only do the first link
	}

	for (var link = 0; link < (ln - 1); link++) {
	    if (ls[link].length > 0) {
		GM_openInTab(ls[link]);
	    }
	}
	if (oneOnly) {
	    GM_openInTab(ls[ln-1]);
	} else {
	    // instead of a tab, open in this window (since it can't be closed)
	    document.location = ls[ln - 1];
	}
    }
    // filestube doesn't have a ShareScreen ending, becuase it's an intermediary....
}; // end filetube

skipscreen.netload = function() {

    return; // disabled for 0.3.20091108 release

    unsafeWindow.popunder = {};

    var postC = $x1("//div[@id='changeDiv']/b");
    if (postC && postC.innerHTML && (postC.innerHTML.indexOf("We will prepare your download") > -1) ) {

        var wait = 20; // default
        var s = $x1("//div[@id='changeDiv']/script");

        if (s && s.innerHTML & s.innerHTML.indexOf("countdown(") > -1) {
	    //wait = (parseInt(s.innerHTML.match(/countdown\((\d+),/)[1], 10) / 100 ) + TOOLS.randomOffset(10);
	    wait = 25;
        }

        var endFunction = function () {
	    // post-captcha
	    alert("here");
	    var pcLink = $x1("id('download')/div/a");
	    if (pcLink) { location.href = pcLink.href; }
        };
        genericWaiter(wait, twoLD, endFunction);
        return;
    }

    var downloadLink = getFirstResult("//div[@class='dl_first_btn2']/div/a");
    if (downloadLink) { // pre-captch
        var newL = downloadLink.href;
        location.href = newL;
        // TODO: the next is an inaccurate condition -- it is true on _several_ pages
        // additionally, the timers are not in synch.
    } else if (unsafeWindow.countdown ) { //captcha -- and other pages

        var pMsg = "<div style='background-color: white;'><p style='color:red'>NetLoad is making you wait.</p>"
	    + "<p style='color:green'><strong>SkipScreen should position you in the captcha-field when the timer finishes.</strong></p>"
	    + "</div>";
        prominence(pMsg);
        var seconds = 38;

        var waiter = setInterval( function() {
	    seconds--;
	    if (seconds <= 0) {
                clearInterval(waiter);
                var c = $x1("//input[@class='Download_Captcha']");
                if (c) c.focus();
                var prom = $id("prom");
                if (prom) prom.style.display = "none";
	    }
        } , 1000 );

    }

}; // end netload

skipscreen.fourshared = function() {
    //Either they are on the get page waiting for download
    //or the "preview" page

    //This is the preview page
    var downloadNow = $x1("//a[contains(.,'Download Now')]");
    if (downloadNow && downloadNow.href)
    {
        if (/4shared.com\/audio/.test(window.location.href) && disabled("fourshared_audio_"))
        {
	    setStatus("Audio Preview enabled; click 'Download Now' to download (or go to Options to change settings).");
        } else {
	    window.location.href = downloadNow.href;
        }
        return;
    }

    //This is the download page
    if (typeof unsafeWindow.fcwait == "function") {
	unsafeWindow.fcwait = function(){};
    }

    var clickHereToDownload = $x1("id('divDLStart')/a");
    if (clickHereToDownload) {
        var finishFunc = function() {
	    new share().show();
	    TOOLS.incrSkipCount();
	    window.location.href = $x1("id('divDLStart')/a").href;
        };
        genericWaiter(parseInt($id("downloadDelayTimeSec").innerHTML), '4Shared', finishFunc, false);
        $id("downloadDelayTimeSec").innerHTML = "--";
        return;
    }


    if (/4shared.com\/dir\//.test(window.location.href)) {
        if (!disabled("fourshared_dir_")) {
	    var downList = getXpathResult("//table[@id='filelist']//a[@target='_blank']");

	    for (var i = 0; i < (downList.snapshotLength - 1); i++)
                GM_openInTab(downList.snapshotItem(i).href);
	    document.location = downList.snapshotItem(downList.snapshotLength - 1).href;
        } else {
	    var text = $id("contact-message");
	    if (text) {
                text.innerHTML = "Auto-download directories is disabled (go to Options to change settings).";
	    }
        }
    }

    return;
    var site = "4Shared";

    unsafeWindow.fcwait = function() {};

    downloadNow = $x1("//a[contains(.,'Download Now')]");
    clickHereToDownload = $x1("id('divDLStart')/a");

    //check if at stage 1
    if (downloadNow && downloadNow.href) {
        if (disabled("fourshared_audio_")) { // if audio _skipping_ is disabled
	    var text = $id("contact-message");
	    if (text) {
                text.innerHTML = "Audio Preview enabled; click 'Download Now' to download (or go to Options to change settings).";
	    }
        } else {
	    //go to stage 2
	    location.href = downloadNow.href;
        }
    }

    // handle stage2
    if (clickHereToDownload) {
        // TODO: better try/catch block? not purely safe, these....
        try {
	    TOOLS.incrSkipCount(); // optimisitc!
	    var cntr = document.createElement("script");
	    document.body.appendChild(cntr).innerHTML = "function getCount() { return " + TOOLS.getSkipCount() + ";}";

	    var dlLink = $x1("id('divDLStart')/a").href;
	    var seconds = parseInt($id("downloadDelayTimeSec").innerHTML);
	    var hostMessage = "4Shared";
	    var endFunction = function(){ new share().show(); location.href = dlLink; };
	    genericWaiter(seconds, hostMessage, endFunction);
        } catch (e) {
	    errorHandler(e, twoLD);
        }
    }

}; // end fourshared


skipscreen.storage = function() {

    //gets rid of popup but not needed with script
    unsafeWindow.popunder = function() {};

    // pass in STATE and LINK
    function parseJSONObj(state, countdown, link){

        var tp = 'ct';

        function skipstore(time) {

	    var ssMsg = "<p style='color:red'>STORAGE.to is making you wait.</p>"
                + "<p style='color:green'><strong>But leave this window open, and SkipScreen will"
                + " download your file automatically when it's available. (in other words, you're free to go)</strong></p>"
                + "<p id='remaining'>Preparing to skip</p>";
	    prominence(ssMsg);

	    TOOLS.incrSkipCount(); // optimistic!
	    var cntr = document.createElement("script");
	    document.body.appendChild(cntr).innerHTML = "function getCount() { return " + TOOLS.getSkipCount() + ";}";
	    // TODO: this method still needs a way to accurately increment the skipCount

	    addSharingScripts();

	    var seconds = time;
	    var waiter = setInterval( function() {
                --seconds;
                if (seconds <= 0) {
		    clearInterval(waiter);
		    var mg = "Preparing to Skip!";
		    var rem = $id("remaining");
		    if (rem) rem.innerHTML = mg;
		    document.title = mg;
		    new share().show();
		    location.href = link;
                } else {
		    var msg = TOOLS.formatSeconds(seconds) + " remaining.";
		    document.title = "{SS} " + msg;
		    var rem = $id("remaining");
		    if (rem) rem.innerHTML = msg;
                }
	    }
				      , 1000 ); // end waiter

        }

        var time;

        if (state == 'failed') {
	    // retry in 5 minutes
	    time = (60 * 5) + TOOLS.randomOffset(60);
	    skipstore(time);
        } else if ( (state == 'wait') || (countdown > 0) ) {
	    var offset = TOOLS.randomOffset(10);
	    time = parseInt(countdown,10) + offset;
	    skipstore(time);
        }
        else if (state == 'ok') {
	    new share().show();
	    location.href = link;
        }
    }

    function getJSONObj(){
        var linkid = location.href.substring(26,34);

        GM_xmlhttpRequest({
	    method: "GET",
	    url: "http://www.storage.to/getlink/" + linkid + "/",
	    headers: {
                "User-Agent": "Mozilla/5.0",            // Recommend using navigator.userAgent when possible
                "Accept": "text/xml"
	    },
	    onreadystatechange: function(req) {
                if (req.readyState != 4)
		    return;

                if (req.status != 200)
		    return;

                //req.responseText will be something like
                //new Object({ 'state' : 'ok',
                //           'countdown' : 60,
                //           'link' : 'http://80.95.157.7/558205e50d0ba3f14d81f7c3637ad3f92cb20cc2/Cornelius - Wataridori 2.mp3',
                //           'linkid' : 'GehTRoYm' });

                var state, countdown, link;
                var res = req.responseText.match(/'state' : '(.*?)',.*?'countdown' : (\d+).*?'link' : '(.*?)',/);
                if (res.length == 4) {
		    state = res[1];
		    countdown = res[2];
		    link = res[3];
                }
                parseJSONObj(state,countdown,link);

	    }
        });

    }

    if(!$id("content") || !/File not found/.test($id("content").innerHTML))
        // start it up
        getJSONObj();
    else {
        document.title = "{SS} File Removed";
        return;
    }


}; // end storage.to


skipscreen.uploaded = function() {

    var submit = getFirstResult("//input[@id='download_submit']");

    if (submit) {
        try {
	    unsafeWindow.update = function () {};
	    submit.disabled = false;
	    submit.value = "SkipScreen is working";
	    var form = getFirstResult("//tr[1]/td/form");

	    new share().show();

	    if (form) {form.submit();}

	    return;

        }
        catch (e) { errorHandler(e, twoLD); }
    }


    var limit = getFirstResult("//center/div");

    // 1-hour delay ?
    if (limit && limit.innerHTML && limit.innerHTML.indexOf("your order. (Or wait") > -1 ) {

        try {
	    // check for # of mins...
	    var wait = 0;
	    var time = 0;
	    var seconds = 0;

	    var minute = limit.textContent.match(/(\d+) minute/);
	    if (minute && (minute.length == 2) ) {
                time = parseInt(minute[1], 10);
                seconds = TOOLS.minutesToSeconds(time);
	    }

	    if (!minute) {
                var secs = limit.textContent.match(/(\d+) second/);
                if (secs && (secs.length == 2) ) {
		    time = parseInt(secs[1], 10);
		    seconds = TOOLS.minutesToSeconds(time);
                }
	    }

	    var allText = getFirstResult("//center/div");
	    var ssMsg = "<p style='color:red'>Uploaded.to is making you wait.</p>"
                + "<p><strong style='color:green'>But leave this window open, and "
                + "SkipScreen will download your file automatically when it's available.</strong></p>"
                + "<p>(in other words, you're free to go )</p>"
                + "<p id='remaining'>Waiting for you!</p>";
	    prominence(ssMsg);

	    // handle thing, with timer
	    addSharingScripts();

	    var waiter = setInterval( function () {
                --seconds;
                if (seconds <= 0) {
		    clearInterval(waiter);
		    document.location.href = document.location.href.replace("?view=error_traffic_exceeded_free&id=", "file\/");
                } else {
		    var msg = TOOLS.formatSeconds(seconds) + " remaining";
		    document.title = "{SS} " + msg;
		    var rem = $id("remaining");
		    if (rem) rem.innerHTML = msg;
                }

	    } , TOOLS.ONE_SECOND ) ;

        }
        catch (e) { errorHandler(e, twoLD); }

    }

    // already downloading?
    if (limit && limit.innerHTML.indexOf("already downloading a file") > -1 ) {

        try {

	    var allText = getFirstResult("//center/div");
	    var msg = "<p style='color:red'>Uploaded.to is making you wait.</p>"
                + "<p><strong style='color:green'>But leave this window open, and "
                + "SkipScreen will download your file automatically when it's available.</strong></p>"
                + "<p>(in other words, you're free to go )</p>"
                + "<p><span id='remaining'></span></p>";
	    prominence(msg);

	    addSharingScripts();

	    // TODO: add reload period to the options
	    var seconds = 120 + TOOLS.randomOffset(20);

	    var waiter = setInterval( function () {
                --seconds;
                if (seconds <= 0) {
		    clearInterval(waiter);
		    document.location.href = document.location.href.replace(/\?view=.*&id_b=/, "file/");
                } else {
		    var msg = TOOLS.formatSeconds(seconds) + " remaining";
		    document.title = "{SS} " + msg;
		    var rem = $id("remaining");
		    if (rem) rem.innerHTML = msg;
                }

	    },TOOLS.ONE_SECOND ) ;
        }
        catch (e) { errorHandler(e, twoLD); }

    }

}; // end uploaded


skipscreen.hotfile = function() {

    // Click here to download
    // /html/body/div/div/div[2]/table[2]/tbody/tr/td/a
    //jQuery('a:contains("Click here to download")')[0].href

    var ssit = function () {
        var clickme = $('a:contains("Click here to download")');
        if (clickme && clickme[0] && clickme[0].href) {
	    document.location.href = clickme[0].href;
	    new share().show();
	    return;
        }
    };

    ssit();

    var freeButton = getFirstResult("//tr[2]/td[2]/input");
    var disabledButton = getFirstResult("//tr[2]/td[2]/span/input");

    // the click starts the timer... so we might as well....
    if (freeButton || disabledButton) {


        if (freeButton) { unsafeWindow.starttimer(); }

        // new after timer
        // /html/body/div/div/div[2]/table[2]/tbody/tr/td/a
        var seconds = 0;
        var time = 0;
        var useNativeTimer = true;

        var delay = $('strong span');
        if (delay && delay[0] && delay[0].innerHTML) {
	    delay = delay[0].innerHTML;
	    var minutes = delay.match(/(\d+) minute/);
	    if (minutes && (minutes.length == 2)) {
                time = parseInt(minutes[1],10);
                seconds = TOOLS.minutesToSeconds(time);
                useNativeTimer = false; // minutes are looong, use our active timer
	    }

	    var secs = delay.match(/(\d+) second/);
	    if (secs && (secs.length == 2)) {
                time = parseInt(secs[1],10);
                seconds = time;
	    }

	    //var endFunction = function() { alert('time\'s up!'); };
	    // /html/body/div/div/div[2]/table[2]/tbody/tr[2]/td[2]/span/input
	    // adding time, because hotfile timer seems a just a _little_ slower
	    genericWaiter(seconds+5, 'HotFile', ssit(), useNativeTimer);

        }

    }

}; // end hotfile


// should only be in here if the path is exactly 6-chars
skipscreen.digg = function() {

    var dFrame = $id("diggiFrame");
    if (dFrame) {
        document.location.href = dFrame.src;
    } else {
        var ct = $id("skipscreen");
        if (ct) {
	    var timer = setInterval( function () {
                clearInterval(timer);
                ct.style.display = "none";
	    }, 5000);
        }
    }

}; // end digg


// see megaupload.js -enternal file


skipscreen.limelinx = function() {

    if(!$id("CountDownText")) {
        window.location.href = window.location.href;
        return;
    }

    var finishFunc = function() {
        window.location.href = window.location.href;
    };

    genericWaiter(unsafeWindow.LLCountdownSeconds, 'LimeLinx', finishFunc, true);

    return;

    // there are (at least) three main pages we're clicking on....

    logIt("limelink: entrance");

    //*[@id="CountDown"]


    unsafeWindow.LLCountdownSeconds = 0;
    //It seems that sometimes it loads the page and the function isn't there
    //and the CountDownText div doesn't show up...so reload the page?
    if (unsafeWindow.UpdateTime) { unsafeWindow.UpdateTime(); } else { window.location.reload();}


    /*
     This is what I came up with. It kept reloading the page,
     but never the file. Not sure what's going on.

     var elem = document.getElementById("CountDownText");
     if(elem && elem.getElementsByTagName("a").length > 0) {
     //*[@id="CountDownText"]
     var url = elem.getElementsByTagName("a")[0];
     if (url && url.href) {
     // alert(url[0].href);
     //document.location = url.href;
     }
     } else {

     }

     return;*/


    //*[@id="CountDownText"]
    var url = jQuery('#CountDownText a').click();
    if (url && url[0] && url[0].href) {
        // alert(url[0].href);
        document.location = url[0].href;
    }
    var xpath = "//li[@id='DownloadLI']/a";
    var urlLink = getFirstResult(xpath, document);

    if (urlLink) {
        try {
	    // alert(urlLink.href);
	    document.location = urlLink.href;
        } catch(e) { errorHandler(e, twoLD); }

        return;

    }

    urlLink = document.getElementById('DownloadButton');

    if (urlLink) {
        logIt("limelinx: second-phase");

        document.location = urlLink.href;

        //return;

    } // I hope you're seeing a pattern, here...

    //     // third-phase

    //     xpath = "//a[@id='AdBriteSkipThisAd']";
    //     urlLink = getFirstResult(xpath,document);

    //     if (urlLink) {

    //         logIt("limelinx: p3 intermission");

    //         // this needs to be a click....
    //         document.ADBRITE.INTERMISSION.hide_intermission();
    //         //document.location = urlLink.href;
    //     }

    //     // fourth-phase

    //     xpath = "//p[@id='CountDownText']/a";
    //     xpath = "/html/body/div[@class='Content' and position()=2]/p[@id='CountDownText']/a";
    //     urlLink = getFirstResult(xpath,document);

    //     if (urlLink) {
    //         logIt("limelinx: p4 countdown");
    //         document.location = urlLink.href;
    //     }


}; // end limelinx


skipscreen.divshare = function() {
    // required uncheck Tools > Options > Advanced : General: Browsing: "Warn me when web sites try to redirect or reload the page"
    // now, how to spread THAT word ????

    //It seems even though there are multiple pages "required" to download,
    //all you have to do is redirect the url to the launch.php link and it will
    //automatically start the download. No waiting needed!
    var result = window.location.href.match(/[0-9]{8}-[0-9a-z]{3}/);
    if(result) {
        var splitResult = result.toString().split("-");
        if(splitResult.length == 2)
	    window.location.href = "http://storagestart.divshare.com/launch.php?f=" + splitResult[0] + "&s=" + splitResult[1];
    }

    return;
    var link = jQuery('a[href]:has(img[title="Download"])');
    if (link && link[0] && link[0].href) {
        //<a href="http://storagestart.divshare.com/launch.php?f=10789265&amp;s=fe8">
        if (link[0].href.match('storagestart') != '') {
	    // post-wait....
	    new share().show();
        }
        //document.location = link[0].href;
    }


    // so... if we just hang out here, and there's a flash object on the page at a certain position
    // AND we don't redirect...

    // TIMER: check in 20 seconds
    // if flash obj on page, redirect!
    // to... ?????

    //NERTS! the timer is a flash object!!! waaaah! well, no big deal if we re-direct....


}; // end divshare


skipscreen.linkbucks = function() {

    if(!unsafeWindow.Linkbucks)
        return;

    window.location.href = unsafeWindow.Linkbucks.TargetUrl;
}; // end linkbucks


skipscreen.sharebee = function() {

    // sharebee offers no direct downloads, so never displays the share-flag

    // this is untested, as I'm not getting these ads anymore....
    // they so seldom appear
    // leave it in, in case it shows up....
    var urlLink = $id("AdBriteSkipThisAd");
    if (urlLink) { // we're in an interstitial ad-page
        try {
	    unsafeWindow.ADBRITE.INTERMISSION.hide_intermission();
        } catch(e) { errorHandler(e, twoLD); }
        return;
    }

    // returns all the randomly-ordered links
    var sb_xpath = "//table[@class='links']/tbody/tr/td/div/a";
    var sb_table = document.evaluate(sb_xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    if (sb_table) {

        for (var i=0; i < sb_table.snapshotLength; i++) {
	    var target = sb_table.snapshotItem(i);

	    var url = domainToArray(target.href);

	    // select a known -- and working -- handler
	    // not prioritized -- just in order provided
	    // TODO: test links first, to see if they exist?
	    // or (easier) allow user to select priority....
	    var dom = getSecondLevelDomain(url);

	    switch (dom) {
	    case 'megaupload' :
	    case 'zshare' :
                document.location = target.href;
                break;
	    }

        }
    }

}; //end sharebee


skipscreen.zshare = function(aPath){

    if (aPath[1]=='audio') {

        // audio is handled differently, as it has a built-in player (for previews)
        // and maybe people want to listen, y'know?

        if (disabled("zshare_audio_")) { // if the _skipping_ is disabled
	    var text = $id("contact-message");
	    if (text) {text.innerHTML = "Audio Preview enabled; click \"Continue Skipping\" to download.";}

	    // TODO: make this a clickable on-screen display
	    var onward = getFirstResult("//tbody/tr[1]/td/div/table/tbody/tr/td[2]/a");
	    if (onward) {onward.innerHTML = "<span style='color:green'>Continue Skipping!</span>";}

        } else {

	    var audio_xpath = "//div/table/tbody/tr/td[2]/a";
	    var urlLink = getFirstResult(audio_xpath, document);

	    if (!urlLink) {return;} // either not audio, or not found

	    document.location = urlLink.href;
        }
    } else { // we're not dealing with audio

        var dl_element = $id('download');
        if (dl_element && (dl_element.type != 'hidden') )  {// this is our download page

	    var seconds = unsafeWindow.time;

	    var endFunction = function(){ new share().show(); location.href = unsafeWindow.link; };
	    var useNativeTimer = true;
	    //genericWaiter(seconds, twoLD, endFunction, useNativeTimer);
	    prominence2(seconds, endFunction);

        } else if (dl_element) {
	    // page that links to download page
	    var form = document.forms.namedItem("form1");
	    form.submit();
        }
    }

}; //end zShare



// somewhat working, but iffy
skipscreen.sendspace = function() {

    // link, etc. is at bottom of screen....
    unsafeWindow.scrollTo(0,9999999);

    logIt("sendspace");

    // link will not appear until ads are loaded...
    var downloadLink = $id('downlink');

    if (downloadLink) {
        document.location = downloadLink.href;
    } else {

        addSharingScripts();

        var freedom = function () {

	    var timer = setInterval( function () {
                if (link_updated == 1) {
		    clearInterval(timer);
		    var downloadLink = document.getElementById('downlink');
		    if (downloadLink) {
                        new share().show();
                        document.location = downloadLink.href;
		    }
                } }, 1000);

        };

        var noHassler = document.createElement("script");
        document.body.appendChild(noHassler).innerHTML = "(" + freedom + ")()";

    }

}; // end sendspace

skipscreen.mediafire = function() {

    var loc = document.location.href;
    if (loc.indexOf("mediafire.com/download.php") > -1) {
        document.location.href = loc.replace(/download\.php/, "");
        return;
    }

    // http://www.mediafire.com/file/4tjxjfz1tyw
    if (loc.indexOf("mediafire.com/file/") > -1) {
        document.location.href = loc.replace(/file\//, "?");
        return;
    }

    //Check to make sure the file is not password protected
    if($id("pprotected")) {
        if ($id("pprotected").style.display == "none") {
	    document.title = "{SS} Waiting";

	    var mf = function() {
                var element = getXpathResult('div[@style="display: block;"]', $id("pprotected").parentNode);

                if (element.snapshotLength != 0 && !/Processing download request.../.test(element.snapshotItem(0).innerHTML)) {
		    document.title = "{SS} Download started!";
		    new share().show();
		    window.location.href = element.snapshotItem(0).getElementsByTagName("a")[0].href;
                } else {
		    setTimeout(mf, 1000);
                }
	    };
	    mf();
        } else if ($id("pprotected")) {
	    document.title = "{SS} Password Protected";
	    //The file is password protected
        }
    } else {
        var elements = $x("//a[starts-with(@id, 'ancfilename')]");

        var href = Array();

        for(var i = 0; i < elements.snapshotLength; i++)
	    href.push(elements.snapshotItem(i).href.replace(/download\.php/, ""));

        multiDownload(href, "mediafire");
    }
}; // end MediaFire


skipscreen.link_protector = function() {

    var xpath = "//form/input";
    var button = getFirstResult(xpath, document);

    if (button) {
        try {
	    var content = button.wrappedJSObject.onclick;
	    if (content) {
                var reg = /.*"(.*)".*/;
                var parse = reg.exec(content);
                if (parse) {
		    var newLink = parse[1];
		    document.location = newLink;
                }
	    } else {
                var form = getFirstResult("//form");
                if (form) {
		    form.submit();
                }
	    }
	    // NOTE: there is no Share, because link-protector is an intermediary to other sites
        } catch(e) { errorHandler(e, twoLD); }
    }

}; // end link_protector


skipscreen.depositfiles = function() {

    // handles mp3s differently than other files
    var dfSubmit = function () {
        try {
	    new share().show();
	    link.submit();
        } catch(e) { errorHandler(e, twoLD); }
    };

    var xpath = "//td[2]/form";
    var link = getFirstResult(xpath, document);

    if (link) {
        // mp3-type download
        dfSubmit();
        return;
    }

    xpath = "//div[@id='download_url']/form";
    link = getFirstResult(xpath, document);

    if (link) {
        dfSubmit();
        return;
    }

    var already1 = getFirstResult("//body/p/text()");
    var already2 = getFirstResult("//div/p[1]/strong", document);
    var already = ( (already1 && already1.indexOf('You are trying to download') > -1)
		    || (already2 && already2.innerHTML.indexOf('already downloading') > -1) );

    if (already) {

        var concurrent = (already1 ? already1 : already2) ;
        var ssMsg = "<p style='color:red'>DepositFiles is making you wait.</p>"
	    + "<p><strong style='color:green'>But leave this window open, and "
	    + "SkipScreen will download your file automatically when it's available.</strong></p>"
	    + "<p>(in other words, you're free to go )</p>"
	    + "<p id='remaining'>Preparing to skip</p>";
        //concurrent.appendChild(ssMsg);
        prominence(ssMsg);

        // wait for a minute (+- random amount), then try again....
        var seconds = 60 + TOOLS.randomOffset(20);
        var waiter = setInterval( function () {
	    --seconds;
	    if (seconds <= 0) {
                clearInterval(waiter);
                var rem = $id("remaining");
                if (rem) rem.innerHTML = "If your download doesn't start, please try again.";
                document.location = document.location;
	    } else {
                var msg = TOOLS.formatSeconds(seconds) + " remaining until automatic retry.";
                var rem = $id("remaining");
                if (rem) rem.innerHTML = msg;
	    }

        }, TOOLS.ONE_SECOND );
        return;
    }

    var limit = getFirstResult("//div[@class='ipbg']/strong", document);
    if (limit && limit.innerHTML && limit.innerHTML.indexOf("used up your limit") > -1) {

        // may make us wait for minutes OR seconds...

        var time = 0;
        var seconds = 0;

        var minute = limit.innerHTML.match(/(\d+) minute/);
        if (minute && (minute.length == 2) ) {
	    time = parseInt(minute[1],10);
	    seconds = TOOLS.minutesToSeconds(time);
        }

        if (! minute) {
	    var secs = limit.innerHTML.match(/(\d+) second/);
	    if (secs && (secs.length == 2)) {
                time = parseInt(secs[1],10);
                seconds = time;
	    }
        }

        var f = "<p style='color:red'>DepositFiles is making you wait.</p>"
	    + "<p><strong style='color:green'>But leave this window open, and "
	    + "SkipScreen will download your file automatically when it's available.</strong></p>"
	    + "<p>(in other words, you're free to go )</p>"
	    + "<p id='remaining'>Preparing to skip</p>";
        //limit.appendChild(f);
        prominence(f);

        var waiter = setInterval( function () {
	    --seconds;
	    if (seconds <= 0) {
                clearInterval(waiter);
                var rem = $id("remaining");
                if (rem) rem.innerHTML = "Preparing to Skip!";
                document.location = document.location;
	    } else {
                var msg = TOOLS.formatSeconds(seconds) + " remaining to wait";
                document.title = "{SS} " + msg;
                var rem = $id("remaining");
                if (rem) rem.innerHTML = msg;
	    }
        } , 1000 ) ;

    } // end limit checks

}; // end depositfiles

skipscreen.uploading = function()    {

    //Click the free user button if it exists
    var freeForm = document.forms.namedItem("downloadform");
    if(freeForm)
    {
        freeForm.submit();
        return;
    }

    var ip = getXpathResult('//div[@class="file_download"]');

    //Only one download per session
    if(ip.snapshotLength == 0 || !/Your IP address is currently downloading a file/.test(ip.snapshotItem(0).innerHTML)) {
        //var ssOrig = setStatus("SkipScreen will download your file as soon as it is available!");

        if(!unsafeWindow.timer_count) {
	    document.title = "{SS} File Removed";
	    return;
        }

        var finishFunc = function() {
	    unsafeWindow.get_link();

	    var checkFile = function() {
                if(unsafeWindow.file_link != "") {
		    new share().show();
		    window.location.href = unsafeWindow.file_link;
                }
                else {
		    var setHTML = function() {
                        var count = unsafeWindow.timer_count + "";
                        $id("waitblock").innerHTML = ' wait for <font id="timer_count">' + count + '</font>&nbsp;seconds...';
                        var elements = getXpathResult('//div[starts-with(@id, "dhtml")]');
                        for(var i = 0; i < elements.snapshotLength; i++) {
			    unsafeWindow.close_notification(elements.snapshotItem(i).id);
                        }
		    };

		    setTimeout(setHTML, 1000);
		    genericWaiter(5, 'Uploading', finishFunc, false);
                }
	    };

	    setTimeout(checkFile, 1000);
        };

        genericWaiter(unsafeWindow.timer_count, 'Uploading', finishFunc, false);
    }
    else
    {
        var ssMsg = "<p style='color:red'>Uploading only allows one<br />download at a time.</p>"
	    + "<p><strong style='color:green'>But leave this window open, and "
	    + "SkipScreen will refresh the page to try again.</strong></p>"
	    + "<p>(in other words, you're free to go )</p>"
	    + "<h2><span id='remaining'></span></h2>";
        prominence(ssMsg);

        var seconds = 60;

        var waiter = setInterval( function() {
	    --seconds;

	    if (seconds <= 0)
	    {
                var msg = "Reloading";
                document.title = "{SS} " + msg;
                var remain = $id("remaining");
                if (remain) remain.innerHTML = msg;
                clearInterval(waiter);
                window.location.reload();
	    }
	    else
	    {
                var msg = TOOLS.formatSeconds(seconds) + " remaining";
                document.title = "{SS} Waiting: " + msg;
                var remain = $id("remaining");
                if (remain) remain.innerHTML = msg;
	    }
        } , 1000) ;

        var msg = TOOLS.formatSeconds(seconds) + " remaining";
        document.title = "{SS} Waiting: " + msg;
        var remain = $id("remaining");
        if (remain) remain.innerHTML = msg;
    }
}; // end uploading


// TODO: rebuild to handle all cases since RS rebuild in Sept, 2010
skipscreen.rapidshare = function() {

    // trap for iframe issues
    if (! document.body) return;

    // with the ajax page refreshing, we've got only one page-load
    // BUT all the code has to execute w/in the page context, right?

  addSharingScripts();

  function rs_start() {
	GM_log("Start()");

	var btn = document.getElementById("js_free-download_btn");
	if (btn){
		GM_log("the button exists");

		//Make sure there are no other counters showing
		var t = document.getElementById("js_download-timer_counter").innerHTML;
		GM_log("t: " + t);
		if (t == "" || t == null || t == undefined || t == "29"){
			GM_log("Pushing the button");
			//Push the button
			window.location = "javascript:void( RSPage['CDownloadPage'].startFreeDl() );";
		}
	}

	var btn2 = document.getElementById("js_downloadnowlink");
	if (btn2){
		if (btn2.href.search(/\/$/) == -1){
			//GM_log("btn2.search: " + btn2.href.search(/\.$/));
			//GM_log("btn2.search: " + btn2.href.search(/\/$/));
			//GM_log("btn2: " + btn2);
			//GM_log("btn2.href: " + btn2.href);
			//GM_log("btn:js_downloadnowlink exists: " + btn2.href);
			//Make sure there are no other counters showing
			var t1 = document.getElementById("js_download-timer_counter").innerHTML;
			GM_log("t1: " + t1);
			if (t1 == "" || t1 == null || t1 == undefined || t1 == "29" || t1 == "0"){
				GM_log("clicking downloadnowlink button.");
				new share().show();
				window.location = btn2.href;
				clearTimeout(rsTimer);
				return;
			}
		}
	}

	//Look for

	//Watch the download timer: <span id='js_download-timer_counter'>xx</span> = 79sec wait
	//js_downloadnowlink

	//js_wait4freedl-timerbox = 2:00 minute download box = Falls back to the 79sec downloader

	var rsTimer = setTimeout(rs_start, 5000); //Loop back when not done.
  }

  rs_start();

}; // end rapidshare


skipscreen.start = function() {
	// log them directly to the page for future reference (ugh)
	unsafeWindow.ssVersion = ssVersion;
	unsafeWindow.abpEnabled = abpEnabled;

	TOOLS = new SKIPSCREEN_TOOLS();
	var url = "" + document.location;
	var aDomain = domainToArray(url);
	twoLD = getSecondLevelDomain(aDomain);
	logIt("SkipScreen: " + twoLD );

	// some servers (linkbucks, for now) fall under the same preference and handler function
	var maskTwoLD = getMask(twoLD);
	logIt("disabled?: " + maskTwoLD + " " + disabled(maskTwoLD));

	// basic check activation prefs
	if (disabled(maskTwoLD)) {return;}

	addContactInfo();
	var found = true;

	switch( maskTwoLD ) {

	case 'depositfiles'         : this.depositfiles          () ; break;
	case 'digg'                 : this.digg                  () ; break;
	case 'divshare'             : this.divshare              () ; break;
	case 'easy-share'           : this.easyshare             () ; break;
	case 'filesonic'            : this.filesonic             () ; break;
	case 'filestube'            : this.filestube             () ; break;
	case 'fourshared'           : this.fourshared            () ; break;
	case 'hotfile'              : this.hotfile               () ; break;
	case 'letitbit'             : this.letitbit              () ; break;
	case 'limelinx'             : this.limelinx              () ; break;
	case 'link-protector'       : this.link_protector        () ; break;
	case 'linkbucks'            : this.linkbucks             () ; break;
	case 'lix'                  : this.lix                   () ; break;
	case 'mediafire'            : this.mediafire             () ; break;
	case 'megaupload'           : this.megaupload            () ; break;
	case 'multiupload'          : this.multiupload           () ; break;
	case 'netload'              : this.netload               () ; break;
	case 'rapidshare'           : this.rapidshare            () ; break;
	case 'remixshare'           : this.remixshare            () ; break;
	case 'sendspace'            : this.sendspace             () ; break;
	case 'sharebee'             : this.sharebee              () ; break;
	case 'storage'              : this.storage               () ; break;
	case 'uploaded'             : this.uploaded              () ; break;
	case 'uploading'            : this.uploading             () ; break;
	case 'zshare'               : this.zshare                (pathSplit(location.pathname) ) ; break;

	default                     : found = false; break;

	}

	if(!found) {
            alert("Page not found: " + maskTwoLD);
	}
};

    //start();
