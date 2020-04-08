document.addEventListener("DOMContentLoaded", listTabs);
var deactivationList = [];
// Get the tabs that are open in the current window
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

// Dynamically populate the table body with the open window tabs
function listTabs() {
  getCurrentWindowTabs().then((tabs) => {
    var tableBod = document.getElementById("activeTimersTable").getElementsByTagName('tbody')[0];
    for (let tab of tabs) {
      var row = tableBod.insertRow();
      row.className = 'table-default';
      row.scope = 'row';
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);
      var tabUrlStr = tab.url;
      if(tabUrlStr.length > 25) tabUrlStr = tabUrlStr.substring(0,25);
      cell0.innerHTML = "Inactive";
      cell1.innerHTML = tabUrlStr;
      cell2.innerHTML = " - ";
      cell3.innerHTML = " - ";
      cell4.innerHTML = tab.id;
    }
    tableSelect();
  });
}

// start the click fucntion for selecting table rows.
function tableSelect() {
  $('#activeTimersTable tbody tr').click(function(){
    $(this).removeClass("table-default").siblings().addClass("table-default");
    $(this).addClass('table-info').siblings().removeClass('table-info');
    enableActivateButton();
    enableIntervalTB();
  });
}

// Enable the activae button
function enableActivateButton() {
  var actBtn = document.getElementById("actBtn");
  actBtn.className = "btn btn-success";
}

// Disable the activate button
function disableActivateButton() {
  var actBtn = document.getElementById("actBtn");
  actBtn.className = "btn btn-success disabled";
}

function enableDeactivateButton() {
  var deActBtn = document.getElementById("deactBtn");
  deActBtn.className = "btn btn-danger";
}

function disableDeactivateButton() {
  var deActBtn = document.getElementById("deactBtn");
  deActBtn.className = "btn btn-danger disabled";
}

// Enable the refresh interval textbox
function enableIntervalTB() {
  document.getElementById("inputInterval").disabled = false;
}

// Disable the refresh interval tesxtbox
function disableIntervalTB() {
  document.getElementById("inputInterval").disabled = true;
}

//  start a timer for the tab corresponding to the slected row
function activateRefreshTimer() {
  var refreshTable = document.getElementById("activeTimersTable");
  // get the selected row
  var selectedRow = refreshTable.getElementsByClassName("table-info");
  // gets the value of the data in the id column from the slected row
  var rowIdValue = selectedRow[0].children[4].textContent;
  var classStr = "selectedRow_" + rowIdValue;

  $(selectedRow).addClass(classStr);
  setCellStartTime(selectedRow);

}

// Click function for the "activate" button
  $('#actBtn').click(function(){
    disableActivateButton();
    disableIntervalTB()
    activateRefreshTimer();
  });

function setCellStartTime(rowData) {
  var start = new Date();
  $(rowData).addClass("table-success");

  enableDeactivateButton();

// Build date string for start date/time
  var dateString = start.getMonth()+1 +"/"
  + (start.getDate()) +"/"+ start.getFullYear() + " "
  + start.getHours() + ":" + start.getMinutes() + ":"
  + start.getSeconds();

  // add start date to the cell
  rowData[0].cells[2].innerHTML = dateString;

  // gets the value of the data in the id column from the slected row
  var rowIdValue = rowData[0].children[4].textContent;

  // get the input for refresh frequency
  var freq = document.getElementById("inputInterval").value;

  $(rowData).removeClass("table-info");

  // start the tab refresh
  refreshTab(rowIdValue, freq)

  //call Timer starts
  showTimer(start, rowIdValue, freq);
}

function showTimer(startTime, rowId) {
  var refreshTable = document.getElementById("activeTimersTable");

  // string for the classname for the row corresponding to the rowID parameter
  var rowClassStr =  "selectedRow_" + rowId;

  // get the selected row
  for (var i=0; i < refreshTable.rows.length; i++) {
    if ($(refreshTable.rows.item(i)).hasClass(rowClassStr)) {
      var selectedRow = $(refreshTable.rows.item(i));
    }
  }
  var sTime = startTime;
  var currTime = new Date();

  var timeDiff = currTime - sTime;
  timeDiff /= 1000;
  var seconds = Math.round(timeDiff);

  selectedRow[0].cells[3].innerHTML = seconds;

  var onList = false;
  // recursive call to keep refresshing the timer display
  for (i=0; i < deactivationList.length; i++){
    if (deactivationList[i] == rowClassStr) {
      onList = true;
    }
  }
  if (!onList) {
    setTimeout(showTimer, 1000, sTime, rowId);
  }
  else {return;}
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

// Click function for the "activate" button
  $('#deactBtn').click(function(){
    disableActivateButton();
    disableIntervalTB();
    deactivateRefreshTimer();
  });

  function deactivateRefreshTimer() {
    var refreshTable = document.getElementById("activeTimersTable");
    // get the selected row
    var selectedRow = refreshTable.getElementsByClassName("table-info");
    // gets the value of the data in the id column from the slected row
    var rowIdValue = selectedRow[0].children[4].textContent;
    var classStr = "selectedRow_" + rowIdValue;

    deactivationList.push(classStr);

    $(selectedRow).addClass("table-danger");
    $(selectedRow).removeClass("table-info");
  }
