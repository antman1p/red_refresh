document.addEventListener("DOMContentLoaded", listTabs);

// Get the tabs that are open in the current window
function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

// Dynamically populate the table body with the open window tabs
function listTabs() {
  var currentTabs = getCurrentWindowTabs().then((tabs) => {
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
    enableIntevalTB();
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
function enableIntevalTB() {
  document.getElementById("inputInterval").disabled = false;
}

// Disable the refresh interval tesxtbox
function disableIntevalTB() {
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
    disableIntevalTB()
    activateRefreshTimer();
  });

// starts the timer
function startNewTimer() {
  var delta = Date.now() - start;
}

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

  //call Timer starts
  showTimer(start, rowIdValue);
}

function showTimer(startTime, rowId) {
  var refreshTable = document.getElementById("activeTimersTable");
  var rowClassStr =  "selectedRow_" + rowId;
  // get the selected row
  for (i=0; i < refreshTable.rows.length; i++) {
    if ($(refreshTable.rows.item(i)).hasClass(rowClassStr)) {
      var selectedRow = $(refreshTable.rows.item(i));
      $(selectedRow).removeClass("table-info");
    }
  }
  var sTime = startTime;
  var currTime = new Date();

  var timeDiff = currTime - sTime;
  timeDiff /= 1000;
  var seconds = Math.round(timeDiff);

  selectedRow[0].cells[3].innerHTML = timeDiff;



  setTimeout(showTimer, 1000, sTime, rowId);
}
