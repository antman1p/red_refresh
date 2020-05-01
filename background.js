var deactivationList = [];
var tableArray = []

// Get the tabs that are open in the current window
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}



// If this is the first time opening the popup, build a new array that will populate the html table
if (tableArray.length == 0) {
     getCurrentWindowTabs().then((tabs) => {
         for (let tab of tabs) {
             var tabUrlStr = tab.url;
             if(tabUrlStr.length > 25) tabUrlStr = tabUrlStr.substring(0,25);
             var rowString = '{"id":"' + tab.id + '", "actstatus":"Inactive", "tab":"' + tabUrlStr + '", "starttime":"-", "elapsedtime":"-", "rowclass":"table-default", "startobj": ""}';
             var rowJSON = JSON.parse(rowString);
             tableArray.push(rowJSON);
         }
     });
}

const pattern1 = "<all_urls>"

const filter = {
    urls: [pattern1]
}

// Function for adding tabs to the array that have been opened since the popup is closed
function newTabs() {
    browser.tabs.onUpdated.addListener(urlUpdated, filter);
}

function urlUpdated(tabId, changeInfo, tab) {
    if (tableArray.findIndex(obj => obj.id == tab.id) == -1) {
        var tabUrlStr = tab.url;
        if(tabUrlStr.length > 25) tabUrlStr = tabUrlStr.substring(0,25);
        var rowString = '{"id":"' + tab.id + '", "actstatus":"Inactive", "tab":"' + tabUrlStr + '", "starttime":"-", "elapsedtime":"-", "rowclass":"table-default", "startobj": ""}';
        var rowJSON = JSON.parse(rowString);
        tableArray.push(rowJSON);
    }
}

/* eslint-disable */
function refreshTab(rowId, freq){
  var frequency = freq * 1000;

  var idInt = parseInt(rowId);
  browser.tabs.reload(idInt);
  var classStr = "selectedRow_" + rowId;
  var onList = false;
  // recursive call to keep refresshing the timer display
  for (var i=0; i < deactivationList.length; i++){
    if (deactivationList[i] == classStr) {
      onList = true;
    }
  }
  if (!onList) {
    setTimeout(refreshTab, frequency, rowId, freq);
  }
  else {
    for (i=0; i < deactivationList.length; i++){
      if (deactivationList[i] == classStr) {
        deactivationList.splice(i, 1);
      }
    }
    return;
  }
}
/* eslint-enable */

browser.tabs.onCreated.addListener(newTabs);