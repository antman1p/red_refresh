document.addEventListener("DOMContentLoaded", listTabs);

var backgroundPage = browser.extension.getBackgroundPage();


// Dynamically populate the table body with the open window tabs
function listTabs() {
    var tableBod = document.getElementById("activeTimersTable").getElementsByTagName('tbody')[0];
    for (let tab of backgroundPage.tableArray) {
      var row = tableBod.insertRow();
      row.className = tab.rowclass;
      row.scope = 'row';
      var cell0 = row.insertCell(0);
      var cell1 = row.insertCell(1);
      var cell2 = row.insertCell(2);
      var cell3 = row.insertCell(3);
      var cell4 = row.insertCell(4);
      cell0.innerHTML = tab.id;
      cell1.innerHTML = tab.actstatus;
      cell2.innerHTML = tab.tab;
      cell3.innerHTML = tab.starttime;
      cell4.innerHTML = tab.elapsedtime;
    }
    
    tableSelect();
    
    // after popup is reopened if there is a table element with a starttime, add the elapsed time
    for(let tableElem of backgroundPage.tableArray) {
        if (tableElem.actstatus == 'Active') {
            var objIndex = backgroundPage.tableArray.findIndex((obj => obj.id == tableElem.id ));
            var selectedRow = tableBod.children[objIndex];
            var rowIdStr = "selectedRow_" + tableElem.id;
            // must re-add the class since it will not have it after the popup is closed and reopened.
            $(selectedRow).addClass(rowIdStr);
            showTimer(backgroundPage.tableArray[objIndex].startobj, backgroundPage.tableArray[objIndex].id);
        }
    }

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
  var rowIdValue = selectedRow[0].children[0].textContent;
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
  var startTimer = Date.now()
  
  enableDeactivateButton();

// Build date string for start date/time
  var dateString = start.getMonth()+1 +"/"
  + (start.getDate()) +"/"+ start.getFullYear() + " "
  + start.getHours() + ":" + start.getMinutes() + ":"
  + start.getSeconds();
  
   // gets the value of the data in the id column from the slected row
  var rowIdValue = rowData[0].children[0].textContent;
  
  // Get the array index for the row by it's tab id number
  var objIndex = backgroundPage.tableArray.findIndex((obj => obj.id == rowIdValue ));
  
  // add start date to the cell
  backgroundPage.tableArray[objIndex].starttime = dateString;
  rowData[0].cells[3].innerHTML = backgroundPage.tableArray[objIndex].starttime;
  
  // change status to Active
  backgroundPage.tableArray[objIndex].actstatus = "Active";
  rowData[0].cells[1].innerHTML = backgroundPage.tableArray[objIndex].actstatus;
  
  // change row class (Color green)
  backgroundPage.tableArray[objIndex].rowclass = "table-success";
  $(rowData).addClass(backgroundPage.tableArray[objIndex].rowclass);

 

  // get the input for refresh frequency
  var freq = document.getElementById("inputInterval").value;

  $(rowData).removeClass("table-info");
  
   // send message to background.js to save new table state
  // var tableMessage = document.getElementById("activeTimersTable").getElementsByTagName('tbody')[0];
  // browser.runtime.sendMessage({greeting: tableMessage}).then(handleResponse, handleError);

  // start the tab refresh
  backgroundPage.refreshTab(rowIdValue, freq);
  
  // send start to background array for persistence
  backgroundPage.tableArray[objIndex].startobj = startTimer;
  

  //call Timer starts
  showTimer(backgroundPage.tableArray[objIndex].startobj, rowIdValue);
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
  var currTime = Date.now();
  

  var timeDiff = currTime - sTime;
  timeDiff /= 1000;
  var seconds = Math.round(timeDiff);
  
  // Add elapsed time to cell in seconds
  var objIndex = backgroundPage.tableArray.findIndex((obj => obj.id == rowId ));
  backgroundPage.tableArray[objIndex].elapsedtime = seconds;
  selectedRow[0].cells[4].innerHTML = backgroundPage.tableArray[objIndex].elapsedtime;

  var onList = false;
  // recursive call to keep refresshing the timer display
  for (i=0; i < backgroundPage.deactivationList.length; i++){
    if (backgroundPage.deactivationList[i] == rowClassStr) {
      onList = true;
    }
  }
  if (!onList) {
    setTimeout(showTimer, 1000, sTime, rowId);
  }
  else {return;}
}

  function deactivateRefreshTimer() {
    var refreshTable = document.getElementById("activeTimersTable");
    // get the selected row
    var selectedRow = refreshTable.getElementsByClassName("table-info");
    // gets the value of the data in the id column from the slected row
    var rowIdValue = selectedRow[0].children[0].textContent;
    var classStr = "selectedRow_" + rowIdValue;

    backgroundPage.deactivationList.push(classStr);
    
    var objIndex = backgroundPage.tableArray.findIndex((obj => obj.id == rowIdValue ));
    $(selectedRow).removeClass("table-info");
    $(selectedRow).removeClass("table-success");
    
      // change status to Inactive
    backgroundPage.tableArray[objIndex].actstatus = "Inactive";
    
    
    // change row class (Color red)
    backgroundPage.tableArray[objIndex].rowclass = "table-danger";
    $(selectedRow).addClass(backgroundPage.tableArray[objIndex].rowclass);
    
    // selectedRow[0] is undefined????
    // Won't change instantly, but IS changed when the popup is reopened
    selectedRow[0].cells[1].innerHTML = backgroundPage.tableArray[objIndex].actstatus;
    
  }


// Click function for the "activate" button
  $('#deactBtn').click(function(){
    disableActivateButton();
    disableIntervalTB();
    deactivateRefreshTimer();
  });


// function handleResponse(message) {
  // console.log(`Message from the background script:  ${message.response}`);
// }

// function handleError(error) {
  // console.log(`Error: ${error}`);
// }
