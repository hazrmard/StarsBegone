/*
The background script manages persistent logic for the extension.
It has access to the WebExtensions API (changing icon, menus etc.).
It does not have any access to the document/DOM.
Therefore it must communicate changes in logic to the front-end script.
*/

// tab-wise record of toggles (in case multiple medium tabs are open)
var visibility = {};

// event listener for whenever the extension icon is clicked. Toggles visibility
// logic. Communicates it to front-end script that modifies the DOM.
browser.pageAction.onClicked.addListener(function(tab) {
    visibility = !visibility;
    browser.tabs.sendMessage(tab.id, visibility);

    browser.pageAction.setIcon({
        tabId: tab.id,
        path: visibility ? "icons/disabled.png" : "icons/enabled.png"
      });
    
    browser.pageAction.setTitle({
        tabId: tab.id,
        title: visibility ? "Medium stars: unblocked" : "Medium stars: blocked"
    });
});


// event listener for query messages from tabs. Returns current visibility state.
browser.runtime.onMessage.addListener(function (msg, sender) {
    visibility[sender.tab.id] == undefined | visibility[sender.tab.id]
    browser.tabs.sendMessage(sender.tab.id, visibility);
})