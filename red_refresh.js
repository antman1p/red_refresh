document.addEventListener("DOMContentLoaded", listTabs);

function getCurrentWindowTabs() {
  return browser.tabs.query({currentWindow: true});
}

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

function tableSelect() {
  $('#activeTimersTable tbody tr').click(function(){
    $(this).removeClass("table-default").siblings().addClass("table-default");
    $(this).addClass('table-info').siblings().removeClass('table-info');
    enableActivateButton();
    enableIntevalTB();
  });
}

function enableActivateButton() {
  var actBtn = document.getElementById("actBtn");
  actBtn.className = "btn btn-success";
}

function enableIntevalTB() {
  document.getElementById("inputInterval").disabled = false;
}

function activateRefreshTimer() {
  var rows = document.getElementById("activeTimersTable").getElementsByTagName('tr');
  console.log(rows);
  for (row in rows){

  }
}

  $('#actBtn').click(function(){
    var actvTmrsTbl = document.getElementById("activeTimersTable");
    activateRefreshTimer();
  });

function startNewTimer() {
}
