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

// Function for adding tabs to the array that have been op0ened since the popup is closed
// NOT FUCKING WORKING
function newTabs() {
    if (tableArray.length != 0) {
        console.log(tableArray);
        getCurrentWindowTabs().then((tabs) => {
            for(let tab of tabs) {
                if (!tableArray.findIndex(obj => obj.id == tab.id )) {
                    var tabUrlStr = tab.url;
                    if(tabUrlStr.length > 25) tabUrlStr = tabUrlStr.substring(0,25);
                    var rowString = '{"id":"' + tab.id + '", "actstatus":"Inactive", "tab":"' + tabUrlStr + '", "starttime":"-", "elapsedtime":"-", "rowclass":"table-default", "startobj": ""}';
                    var rowJSON = JSON.parse(rowString);
                    tableArray.push(rowJSON);
                }
            }
        });
    }
}


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

// function handleMessage(request, sender, sendResponse) {
    // console.log(request.greeting);
    // sendResponse({response: "Response from background script"});
// }

// browser.runtime.onMessage.addListener(handleMessage);
