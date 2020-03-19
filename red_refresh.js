document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    for (let tab of tabs) {
      console.log(tab.title);
    }
  });

}
