fetch("/main", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    token: localStorage.getItem("loginToken"),
  }),
})
  .then((response) => response.json())
  .then((data) => {
    if (data.success) {
      // Store the login token in the browser's local storage
      console.log(data);

      alert("Login successful!");
      sessionStorage.setItem("FirstName", data.FirstName); //need to get name

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
        localStorage.setItem("user", data.user);
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
  localStorage.removeItem("loginToken");
  sessionStorage.removeItem("FirstName");
}
