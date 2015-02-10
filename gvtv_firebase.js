// Add connection to firebase data
var fb_current = new Firebase('https://gvtv.firebaseio.com/current');
var fb_slides = new Firebase('https://gvtv.firebaseio.com/slides');
var fb_templates = new Firebase('https://gvtv.firebaseio.com/templates');
var fb_slideshows = new Firebase('https://gvtv.firebaseio.com/slideshows');

// Initialize pages and current index
var slides;
var templates;
var slideshow;
var slideshows;
var current;
var showIndex = 0;

function setCurrent() {
    if (slideshows === undefined || current === undefined)
        return standBy();
    slideshow = slideshows[current];
    if (!slideshow)
        standBy();
    else
        playSlideshow();
}

// Get and watch slides
fb_slides.on('value', function(snapshot) {
    slides = snapshot.val();
});
// Get and watch templates
fb_templates.on('value', function(snapshot) {
    templates = snapshot.val();
});
// Get and watch slideshows
fb_slideshows.on('value', function(snapshot) {
    slideshows = snapshot.val();
    setCurrent();
});
fb_current.on('value', function(snapshot) {
    current = snapshot.val();
    setCurrent();
});

function displaySlide() {
    var slide, template;
    var timeout = 0;
    if (showIndex < 0)
        slide = slides[slideshow[0].slide];
    else {
        slide = slides[slideshow[showIndex].slide];
        timeout = slideshow[showIndex].time;
        showIndex = (showIndex + 1) % slideshow.length;
    }
    template = templates[slide.template];
    $('body').html(Mustache.to_html(template, slide));
    return timeout;
}

// Display the next page based on the currentIndex
// Use a timer to loop through the pages
function playSlideshow() {
    //displayText(pages[currentIndex].body);
    //currentIndex = (currentIndex + 1) % slideshow.length;
    var timeout = displaySlide();
    if (timeout)
        setTimeout(playSlideshow, timeout);
}
    
// Get all data from firebase, and display first page
//function onvalue(snapshot) {
//    fb = snapshot.val();
//    templates = fb.templates;
//    slides = fb.slides;
//    slideshow = fb.slideshows[fb.current];
//    playSlideshow();
//}
//firebase.on('value', onvalue);

function standBy() {
    $('#message').html('<h1>Global Village TV</h1><h2>Standing by...</h2>');
}
