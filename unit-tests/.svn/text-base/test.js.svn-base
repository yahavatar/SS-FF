// Andy Langton's show/hide/mini-accordion - updated 18/03/2009
// Latest version @ http://andylangton.co.uk/jquery-show-hide
// http://andylangton.co.uk/articles/javascript/jquery-show-hide-multiple-elements/

// this tells jquery to run the function below once the DOM is ready
$(document).ready(function() {


    runTests();

    // choose text for the show/hide link - can contain HTML (e.g. an image)
    var showText='Show';
    var hideText='Hide';

    // append show/hide links to the element directly preceding the element with a class of "toggle"
    $('.toggle').prev().append(' (<a href="#" class="toggleLink">'+showText+'</a>)');

    // hide all of the elements with a class of 'toggle'
    $('.toggle').hide();

    // capture clicks on the toggle links
    $('a.toggleLink').click(function() {

	// change the link depending on whether the element is shown or hidden
	$(this).html ($(this).html()==hideText ? showText : hideText);

	// toggle the display - uncomment the next line for a basic "accordion" style
	//$('.toggle').hide();$('a.toggleLink').html(showText);
	$(this).parent().next('.toggle').toggle('slow');

	// return false so any link destination is not followed
	return false;

    });
});
