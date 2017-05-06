function onlock(response) {

    // TODO your code here
    alert("the webpage has locked due to secure contents");

}

function onunlock(response) {

    // TODO your code here
    alert("you have verified the correct PIN");

}

function onratelimited(response) {

    // TODO your code here
    alert("you have guessed your pin too many times");

}

function ondisconnect(response) {

    // TODO your code here
    alert("you are disconnected from the server");

}

var obj = {
    "clienttimeout" : 1000,
    "servertimeout" : 2000,
    "url" : "http://localhost:8080/",
    "onlock" : onlock,
    "onunlock" : onunlock,
    "onratelimited" : onratelimited,
    "ondisconnect" : ondisconnect
}

var foobar = new quicklock(obj);
