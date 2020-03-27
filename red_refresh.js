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

      cell0.innerHTML = "Inactive";
      cell1.innerHTML = tab.title;
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
  console.log(rowIdValue);
  setCellStartTime(selectedRow);
  selectedRow[0].className = "table-success";
  enableDeactivateButton()

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
  var rowDt = rowData;

// Build date string for start date/time
  var dateString = start.getMonth()+1 +"/"
  + (start.getDate()) +"/"+ start.getFullYear() + " "
  + start.getHours() + ":" + start.getMinutes() + ":"
  + start.getSeconds();

  // add start date to the cell
  rowDt[0].cells[2].innerHTML = dateString;

  //call Timer starts
  showTimer(start, rowDt);
}

function showTimer(startTime, rowData) {
  var rwDt = rowData;
  var time = startTime;
  var h = time.getHours();
  var m = time.getMinutes();
  var s = time.getSeconds();
  var elapsedTimeString = h + ":" + m + ":" + s;
  rwDt[0].cells[3].innerHTML = elapsedTimeString;
  setTimeout(showTimer, 1000, time, rwDt);
}
