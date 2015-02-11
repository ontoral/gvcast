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
var currentShow;
var showIndex = 0;
var timeout = 0;

function setCurrent() {
    if (!slideshows)
        return standBy();
    if (!slideshows[currentShow])
        standBy();
    else {
        slideshow = slideshows[currentShow].show;
        showNextSlide();
    }
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
    console.log('onValue: ' + snapshot.val());
    currentShow = snapshot.val();
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

// Use a timer to loop through the pages
function showNextSlide() {
    var slideDuration = displaySlide();
    if (slideDuration)
        timeout = setTimeout(showNextSlide, slideDuration);
    else
        timeout = 0;
}

// This drops the current show (if any) and displays the standby message
function standBy() {
    if (timeout)
        clearTimeout(timeout);
    $('#message').html('<h1>Global Village TV</h1><h2>Standing by...</h2>');
}
