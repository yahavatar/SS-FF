// for skipscreen.js
// non-captcha mega-family code

//#start-mega
skipscreen.megaupload = function() {

    var host = "MegaUpload"; // for error-handler. etc. maybe make this global....

    var xpath = "//div[@id='downloadlink']/a";
    var urlLink = getFirstResult(xpath, document);

    // wait is bypassed....
    // Oct 11, 2009 -- can no longer bypass wait (outside US/UK ???)
    // how to make this detect the location....
    // maybe an option to manually set???
    if (urlLink) {

        var wait = 0;
        var counter = $id("countdown");
        if (counter && counter.innerHTML) {
            wait = parseInt(counter.innerHTML,10);
            wait = (isNaN(wait) ? 0 : wait);
        }
        try {
            var endFunction = function () {
                new share().show();
                location.href = urlLink.href;
            };

            if (wait > 0) {
                genericWaiter(wait, host, endFunction);
                return;
            } else {
                // no wait needed!
                endFunction();
            }
        } catch(e) { errorHandler(e, twoLD);}
    } else {
        var captcha = $id("captchafield");
        if (captcha) {
            // small timer
            var timer = setInterval( function () {
                clearInterval(timer);
                captcha.focus();
            }, 1000);
        }
    }

}; // end mega-upload NOTE: must have trailing line-feed for script appends to work

