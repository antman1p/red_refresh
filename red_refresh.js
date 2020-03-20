// document.addEventListener("DOMContentLoaded", listTabs);
//
// function getCurrentWindowTabs() {
//   return browser.tabs.query({currentWindow: true});
// }

// function listTabs() {
//   getCurrentWindowTabs().then((tabs) => {
//     var tableBod = document.getElementById("activeTimersTable").getElementsByTagName('tbody')[0];
//     for (let tab of tabs) {
//       var row = tableBod.insertRow();
//       row.className = 'table-default';
//       row.scope = 'row';
//       var cell1 = row.insertCell(0);
//       var cell2 = row.insertCell(1);
//       var cell3 = row.insertCell(2);
//       var cell4 = row.insertCell(3);
//
//       cell1.innerHTML = "Inactive";
//       cell2.innerHTML = tab.title;
//       cell3.innerHTML = " - ";
//       cell4.innerHTML = " - ";
//     }
//   });
// }
