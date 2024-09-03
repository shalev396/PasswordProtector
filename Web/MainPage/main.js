let isLoggedIn = false;
document.addEventListener("DOMContentLoaded", function () {
  const signUpButton = document.querySelector(".cta-button");
  if (signUpButton) {
    if (sessionStorage.getItem("loginToken")) {
      signUpButton.textContent = "Logout";
      signUpButton.href = "/main";
    } else signUpButton.textContent = "SignUp";
    signUpButton.href = "/SignUp";

    signUpButton.addEventListener("click", function (event) {
      event.preventDefault(); // Prevent the default navigation behavior
      if (sessionStorage.getItem("loginToken")) {
        del();
        window.location.href = "/main";
      } else window.location.href = "/SignUp";
    });
  } else {
    console.log("Element not found.");
  }
});

if (sessionStorage.getItem("loginToken")) {
  fetch("/main", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: sessionStorage.getItem("loginToken"),
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Store the login token in the browser's local storage
        console.log(data);

        alert("Login successful!");
        sessionStorage.setItem("FirstName", data.FirstName); //need to get name
        isLoggedIn = true;
        document.getElementById("OverView").hidden = false;
        document.getElementById("loginButton").textContent = sessionStorage
          .getItem("FirstName")
          .toString();
        document
          .getElementById("loginButton")
          .addEventListener("click", function (event) {
            event.preventDefault();
            window.location.href = "/Settings";
          });
      } else {
        alert(data.message || "PreLogin failed.");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}
function getByUID() {
  fetch("/MainUserData", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({}),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Store the login token in the browser's local storage
        alert("got the data successful!");
        sessionStorage.setItem("user", data.user);
      } else {
        alert(data.message || "no data");
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("An error occurred. Please try again.");
    });
}

function del() {
  sessionStorage.removeItem("loginToken");
  sessionStorage.removeItem("FirstName");
  isLoggedIn = false;
}
function goOverview() {
  if (isLoggedIn) {
    document.getElementById("OverView").href = "/OverView";
  } else document.getElementById("OverView").href = "null";
}
