document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    let email = document.getElementById("email").value;
    let twoFactorCode = document.getElementById("2fa").value;

    if (validateForm(email, twoFactorCode)) {
      alert("Login successful!");
    } else {
      alert("Invalid login. Please try again.");
    }
  });

function validateForm(email, twoFactorCode) {
  // Simple validation for email/phone and 2FA code
  return email.length > 0 && twoFactorCode.length === 6;
}
