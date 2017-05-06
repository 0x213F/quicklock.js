# quicklock.js

Every time a user leaves a webpage it will lock. To unlock the page
the user must confirm their identity with a PIN.

Consider a web application where highly sensitive information is presented to the user. In order to add an extra security factor, the application could lock whenever the window is de-focused (changed tab, the window is de-focused an AJAX request will be sent to a server to indicate that the page has been “locked” and the DOM will be cleared. The page will show a phone-style pin pad so that the user can unlock the webpage with their custom PIN (which will be initialized from a different interface). To unlock the webpage, an AJAX request is sent to the server. If there is a password match, then the contents of the DOM must be rebuilt and page “unlocked”.

## Installing

```
npm install password-hash
npm install express
npm install path
```

## Running the Demo

Run the following command in terminal. Log in using the credentials "myUser" for username and "p4assw0rd" for password. To unlock the webpage via PIN, enter 4833.

```
cd demo/
node server.js myUser p4ssw0rd 4833 5 2000
```

Customize how the demo runs by fiddling with the parameters.

```
cd demo/
node server.js <username> <password> <PIN> <# of allowed PIN attempts> <connection interval>
```

### Customize the Demo

Edit the file `/demo/home/script.js` to change how the demo behaves.

## Usage

### Front-End

```
/* create an object with the data to setup an instance of quicklock.js */
var obj = {
    "clienttimeout" : 1000,             // ms until page locks
    "servertimeout" : 2000,             // ms until checks server connection
    "url" : "http://localhost:8080/",   // url for quicklock.js endpoints
    "onlock" : onlock,                  // callback func for when page locks
    "onunlock" : onunlock,              // callback func for when page unlocks
    "onratelimited" : onratelimited,    // callback func for when too many PIN attempts
    "ondisconnect" : ondisconnect       // callback func for when server is disconnected
}

/* create an instance of quicklock.js */
var foobar = new quicklock(obj);
```

### Back-End

```
/checkserver : quicklock.js calls this endpoint to verify a connection to the server.
/lock : quicklock.js calls this endpoint to lock the webpage.
/unlock?pin=<[0-9]> : quicklock.js calls this endpoint to unlock the webpage.
```

## Note

Both the front-end and back-end have a "servertimeout" property. These must be the same!

## Author

* **Joshua Schultheiss**

## Acknowledgments

* Special thanks to [John Bambenek](http://www.bambenekconsulting.com) and his [cyber security lab](https://courses.engr.illinois.edu/cs460/sp2010/) for an opportunity to do a fun project!
