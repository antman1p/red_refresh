# Red Refresh
A firefox plugin that refreshes tabs and keeps track of how long they were open for Red Team Operations

## TODO
* On load, query all of the open browser tabs, return their page titles
  * add them to the table
* When a row is clicked, if active, enable "deactivate" button
  * When inactive, enable the "activate" button
* When "deactivate" button is clicked, stop the refresh timer coresponding to the selected table item
* When "activate" button is clicked, start the refresh the browser tab coresponding selected row item 
  * Set it as Active on the table
