/*
This front end script is injected into compatible web pages.
It has access to the DOM. But limited access to the extensions API.
It cannot persist logic (e.g between page refreshes).
Therefore it must query the background script for state.
It converts background logic to actual changes in the DOM.
*/

// ordering matters - lower level selectors first.
// The function traverses parents of the "star" element until it comes across
// the first selectior in this list. That selector is removed.
var selectors = [
                "div.u-table",                  // for full width posts
                "div.js-trackedPost",           // for posts shown on a grid style
                "div.extremeHero-largeCard",    // main page featured large
                "div.extremeHero-smallCard",    // main page featured small
                "div.extremeHero-post",         // main page featured right large
                "div.streamItem",               // dynamically loaded list
                "li.u-flex"];                   // popular items list on right

var visibility = false; // default visibility assumption

// define function that searches DOM and changes starred articles
function setStars(status) {
    
    starElems = document.getElementsByClassName("svgIcon--star");

    for (var i=0; i<starElems.length; i++) {
        for (var j=0; j<selectors.length; j++) {
            ancestor = starElems[i].closest(selectors[j]);
            if (ancestor != null) {
                ancestor.style.display = status ? "block" : "none";
                // set visibility to false as a contingeny when display cannot
                // be applied due to more specific style selectors elsewhere
                ancestor.style.visibility = status ? "visible" : "hidden";
                break;
            }
        }
    }
}


// toggle visibility if icon clicked
browser.runtime.onMessage.addListener((state) => {
    visibility = state;
    console.log(visibility);
    setStars(visibility)
});


// query background script for visibility state. This triggers onMessage (above)
browser.runtime.sendMessage("queryStatus");


// set up listener for more posts loaded to page
var mutationObserver = new MutationObserver(function() {
    setStars(visibility);
});
var body = document.getElementsByTagName("body")[0];
var config = {childList: true, subtree: true };
mutationObserver.observe(body, config);
