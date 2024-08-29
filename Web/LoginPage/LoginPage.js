document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phone-number").value;
    const twoFactorCode = document.getElementById("2fa").value;

    if (email && phoneNumber && twoFactorCode) {
      fetch("/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          phoneNumber: phoneNumber,
          twoFactorCode: twoFactorCode,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            // Store the login token in the browser's local storage
            localStorage.setItem("loginToken", data.token);
            alert("Login successful!");

            // Optionally, redirect the user to the main page or dashboard
            window.location.href = "/Main";
          } else {
            alert(data.message || "Login failed. Please try again.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
          alert("An error occurred. Please try again.");
        });
    } else {
      alert("Please fill in all fields.");
    }
  });

function goBack() {
  window.location.href = "/Main";
}
