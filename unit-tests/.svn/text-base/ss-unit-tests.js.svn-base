// unit-tests for SkipScreen

function runTests() {

    // TODO: when instantiated, does some stuff on its own. ouch
    var comp = skipscreen_gmCompiler;


    // TODO: better handler
    // notes, caller-function, and expected outcome
    var sb_included = ['http://51175483.linkbucks.com/',
	'http://rapidshare.com/files/258900149/Beastie_Boys_-_Now_Get_Busy.mp3',
	'http://hotfile.com/dl/6620752/76eca7f/Cornelius_-_Wataridori_2.mp3.html',
	'http://www.hotfile.com/dl/6620752/76eca7f/Cornelius_-_Wataridori_2.mp3.html',
	// 'http://ul.to/vqfolq', // this will fail, becuase SS doesn't actually handle
	// it's a redirect to the normal uploaded.to account
	'http://uploaded.to/file/vqfolq',
	'http://depositfiles.com/files/uylki8vjc',
	'http://depositfiles.com/en/files/uylki8vjc'
		      ];

    var sb_excluded = ['',
	'http://www.google.com',
	'http://www.rapidshare.com',
	'http://www.SkipScreen.com',
	'about:config',
	'http://18th.blogs.linkbucks.com/',
	'http://www.linkbucks.com',
	'http://www.hotfile.com/',
	'http://uploaded.to/',
	'http://www.uploaded.to/',
	'http://depositfiles.com',
	'http://www.depositfiles.com'
		      ];

    // function, array of test
    // test = value, expected result
    var func = comp.urlIsAllowed;
    var tests = ["Included URLs", func, [
	['http://51175483.linkbucks.com/', true],
	['http://rapidshare.com/files/258900149/Beastie_Boys_-_Now_Get_Busy.mp3', true],
	['http://hotfile.com/dl/6620752/76eca7f/Cornelius_-_Wataridori_2.mp3.html', true],
	['http://www.hotfile.com/dl/6620752/76eca7f/Cornelius_-_Wataridori_2.mp3.html', true],
	['http://ul.to/vqfolq', false ], // extension doesn't handle this -- it's a redirect on the site to the next value
	['http://uploaded.to/file/vqfolq', true],
	['http://depositfiles.com/files/uylki8vjc', true],
	['http://depositfiles.com/en/files/uylki8vjc', true]
    ]
		];

    var description = tests[0];
    var testFunc = tests[1];
    var testList = tests[2];
    var rep = "";
    for (var i = 0; i < testList.length; i++) {
	var url = testList[i][0];
	var expectedResult = testList[i][1];
	rep+= ((testFunc(url) === expectedResult) ? "passed" : "failed") + ": '" + url + "' = " + expectedResult + "\n";
    }

    alert(description + "\n" + rep);

    var tests = ["Excluded URLS", func, [
	['',false],
	['http://www.google.com', false],
	['http://www.rapidshare.com', false],
	['http://www.SkipScreen.com', false],
	['about:config', false],
	['http://18th.blogs.linkbucks.com/', false],
	['http://www.linkbucks.com', false],
	['http://www.hotfile.com/', false],
	['http://uploaded.to/', false],
	['http://www.uploaded.to/', false],
	['http://depositfiles.com', false],
	['http://www.depositfiles.com', false]
    ]
		];


    var description = tests[0];
    var testFunc = tests[1];
    var testList = tests[2];
    var rep = "";
    for (var i = 0; i < testList.length; i++) {
	var url = testList[i][0];
	var expectedResult = testList[i][1];
	rep+= ((testFunc(url) === expectedResult) ? "passed" : "failed") + ": '" + url + "' = " + expectedResult + "\n";
    }

    alert(description + "\n" + rep);


    function urlTest(url) {

	//    var incl = (comp.urlIsIncluded(url) && comp.urlIsExcluded(url))  ? "" : "not ";
	var incl = (comp.urlIsAllowed(url))  ? "" : "not ";
	return "'" + url + "' is " + incl + "included";

    }

    // well, isn't actually used, yet.....
    function functionName(fn)
    {
	var name=/\W*function\s+([\w\$]+)\(/.exec(fn);
	if(!name)return 'No name';
	return name[1];
    }

    // TODO: better report, and put them all onto the page, instead of an alert
    // HOWEVER -- do an alert for "passed" or "failed"

    var repList = new Array();

    sb_included.forEach( function(url){	repList.push(urlTest(url));} );

    var toggle = document.createElement("ul");
    toggle.className = "toggle";
    for (var i=0; i<repList.length; i++) {
        var el = document.createElement("li");
        el.innerHTML = repList[i];
        toggle.appendChild(el);
    }

    $("#includes .toggle").replaceWith(toggle);

    repList = new Array();
    sb_excluded.forEach( function(url){	repList.push(urlTest(url));} );

    toggle = document.createElement("ul");
    toggle.className = "toggle";
    for (var i=0; i<repList.length; i++) {
        var el = document.createElement("li");
        el.innerHTML = repList[i];
        toggle.appendChild(el);
    }

    $("#excludes .toggle").replaceWith(toggle);

}