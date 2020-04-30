# Red Refresh
A firefox plugin that refreshes tabs and keeps track of how long they were open for Red Team Operations

Let's say you have access to a victim's email account and you are wrapping up operations for the week. You won't be able to touch the browser over the weekend. If the email account timesout after an unknown time of no activity, you may come back to your browser after the weekend to begin the week's operations and find that you no longer have access to the account.  Red refresh ensures that this won't happen and it also gives you usable dwell time metrics for your reporting


## TODO
* ~On load, query all of the open browser tabs, return their page titles~
  * ~add them to the table~
* ~Fix selecting/highlighting row onclick (It broke after dynamically populating the table)~
* ~When inactive, enable the "activate" button~
  * ~When a row is clicked, if active, enable "deactivate" button~
* ~When "activate" button is clicked, start the refresh the browser tab coresponding selected row item~
  * ~Set it as Active on the table~
* ~When "deactivate" button is clicked, stop the refresh timer coresponding to the selected table item~
* ~Test~
* ~Maintain state persistence when extension pop-up is closed~
* Fix Problem with table row state change delay
* Utilize disableActivateButton() function
