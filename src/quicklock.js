/*******************************************************************************
* NAME :
*
*                   quicklock
*
* DESCRIPTION :
*
*                   every time a user leaves a webpage it will lock.
*                   to unlock the page the user must confirm their
*                   identity with a PIN.
*
*******************************************************************************/

function quicklock(data) {

    ////////////////////////////////////////////////////////////////////////////
    // validation

    if(typeof data !== "object") {
        throw "invalid input: parameter needs to be of type object.";
    } else if(typeof data.url === "undefined" ||
              typeof data.clienttimeout === "undefined" ||
              typeof data.servertimeout === "undefined" ||
              typeof data.onlock === "undefined" ||
              typeof data.onratelimited === "undefined" ||
              typeof data.ondisconnect === "undefined" ||
              typeof data.onunlock === "undefined") {
        throw "invalid input: object is missing member(s).";
    } else if(typeof data.url !== "string" ||
              typeof data.clienttimeout !== "number" ||
              typeof data.servertimeout !== "number" ||
              typeof data.onlock !== "function" ||
              typeof data.onratelimited !== "function" ||
              typeof data.ondisconnect !== "function" ||
              typeof data.onunlock !== "function") {
        throw "invalid input: member(s) of object is/are of incorrect type.";
    } else if(!/^https?:\/\/\w+(\.\w+)*(:[0-9]+)?\/?$/.test(data.url)) {
        throw "invalid input: 'url' member is not valid."
    } else {
        // no errors
    }

    ////////////////////////////////////////////////////////////////////////////
    // declarations

    var lastaction = new Date().getTime(),
        that = this,
        interval, init, update, unlock, request;

    ////////////////////////////////////////////////////////////////////////////
    // private functions

    init = function() {
        document.addEventListener('keydown', update);
        window.addEventListener("blur", that.lock);
        document.body.addEventListener("mousemove", update);
        document.body.addEventListener('mouseout', function(e) {
            if(e.relatedTarget === document.querySelector('html')) {
                if(!that.locked) that.lock()
            }
        });
        setTimeout(that.checkclient, data.clienttimeout);
        interval = setInterval(that.checkserver, data.servertimeout);
    };

    update = function() {
        lastaction = new Date().getTime();
    };

    ////////////////////////////////////////////////////////////////////////////
    // public functions
    this.checkclient = function() {
        var timedelta = new Date().getTime() - lastaction - 1;
        if(that.locked) {
            return;
        } else if(timedelta > data.clienttimeout) {
            that.lock();
            that.locked = true;
        } else {
            setTimeout(that.checkclient, data.clienttimeout - timedelta);
        }
    };

    this.checkserver = function() {
        var xhr;
        if(that.locked) {
            clearInterval(interval);
            return;
        } else {
            xhr = new XMLHttpRequest();
            xhr.open('GET', data.url + "checkserver");
            xhr.onreadystatechange = function() {
                if(xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        return;
                    } else {
                        // do nothing
                    }
                }
            }
            xhr.send();
        }
    };

    this.lock = function() {

        var appendButton = function(i) {
            var button = document.createElement('button');
            button.style.width = button.style.height = "90px";
            button.style.fontSize = "40px";
            button.style.margin = "5px";
            button.style.border = "white solid 5px";
            button.style.borderRadius = "50px";
            button.style.backgroundColor = "#3CB371";
            button.style.color = "white";
            button.style.cursor = "pointer";
            button.innerHTML = i;
            if(i === "⌫") {
                button.addEventListener("click", function(){
                    that.pin = that.pin.substring(0, that.pin.length - 1)
                    document.getElementById("QL_PIN").value = that.pin;
                });
            } else if(i === "→") {
                button.addEventListener("click", function(){
                    that.unlockattempt();
                });
            } else {
                button.addEventListener("click", function(){
                    that.pin += this.innerHTML;
                    document.getElementById("QL_PIN").value = that.pin;
                });
            }
            document.getElementById('QL_MAIN').appendChild(button);
        }

        var buttons = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "⌫", "0", "→"]

        var xhr;
        if(document.documentElement !== null) {
            document.removeChild(document.documentElement);
        }
        document.write("<body></body>");
        xhr = new XMLHttpRequest();
        xhr.open('GET', data.url + "lock");
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if (xhr.status === 200) {
                    data.onlock(xhr.response);
                    document.body.style.backgroundColor = "#3CB371";
                    var div = document.createElement('div');
                    div.id = "QL_MAIN";
                    div.style.width = "300px";
                    div.style.height = "490px";
                    div.style.position = "absolute";
                    div.style.top = div.style.left = "50%";
                    div.style.marginTop = "-245px";
                    div.style.marginLeft = "-150px";
                    document.getElementsByTagName('body')[0].appendChild(div);
                    var div = document.createElement('input');
                    div.id = 'QL_PIN';
                    div.style.margin = "5px";
                    div.borderRadius = "5px";
                    div.style.width = "290px";
                    div.style.height = "80px";
                    div.style.fontSize = "40px";
                    div.style.textAlign = "center";
                    div.style.color = "#3CB371";
                    document.getElementById('QL_MAIN').appendChild(div);
                    for(var idx in buttons) {
                        appendButton(buttons[idx]);
                    }
                } else {
                    // do nothing
                }
            }
        }
        xhr.send();
    };

    this.unlockattempt = function() {
        var xhr;
        xhr = new XMLHttpRequest();
        xhr.open('GET', data.url + "unlock?pin=" + this.pin);
        xhr.onreadystatechange = function() {
            if(xhr.readyState === 4) {
                if (xhr.status === 200) {
                    data.onunlock(xhr.response);
                    location.reload();
                } else if(xhr.status === 429) {
                    data.onratelimited(xhr.response);
                    location.reload();
                } else {
                    // do nothing
                }
            }
        }
        xhr.send();
    }

    ////////////////////////////////////////////////////////////////////////////
    // values

    this.pin = "";
    this.locked = false;

    ////////////////////////////////////////////////////////////////////////////
    // main

    init();

}
