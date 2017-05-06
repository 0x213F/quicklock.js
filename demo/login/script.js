function login() {
    xhr = new XMLHttpRequest();
    var user = document.getElementById("user").value,
        pass = document.getElementById("pass").value,
        errmsg = "INCORRECT PASSWORD";

    var params = "?user=" + user + "&pass=" + pass;
    xhr.open('GET', "http://localhost:8080/login" + params);
    xhr.onreadystatechange = function() {
        if(xhr.readyState === 4) {
            if (xhr.status === 200) {
                location.reload();
            } else {
                document.getElementById("message").innerHTML = errmsg;
            }
        }
    }
    xhr.send();
}
