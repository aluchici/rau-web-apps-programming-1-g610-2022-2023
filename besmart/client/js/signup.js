function register() {
    const name = document.getElementById("name");
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const secondPassword = document.getElementById("secondPassword");

    if (!name.value || !email.value || !password.value || !secondPassword.value) {
        alert("Please fill all details.");
    }

    const URL = 'http://localhost:5610/api/v1/register';
    const userInput = {
        'name': name.value,
        'email': email.value,
        'password': password.value,
        'second_password': secondPassword.value
    };

    const params = {
        "method": "POST",
        "mode": "cors",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(userInput)
    };

    fetch(URL, params).then(responseReceived).then(dataReceived).catch(errorReceived);
    console.log("Done");
}

function responseReceived(response) {
    return response.json();
}

function dataReceived(data) {
    alert("Account created successfully!");
    window.location.href = "signin.html";
}

function errorReceived(error) {
    alert(error.message);
}

