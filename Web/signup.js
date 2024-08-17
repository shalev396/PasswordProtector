let keyGenerated = false; // Track if the key was generated

// Function to generate a random key
function generateKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 64;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  document.getElementById("key").value = result;
  keyGenerated = true; // Mark that the key has been generated

  // Show popup warning
  alert(
    "The key is the most important part. To keep it secure, avoid copying or saving it on your computer. Instead, write it down on paper where hackers can't access it."
  );
}

// Function to handle form submission
document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    // Capture user input values
    const user = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      phoneNumber: document.getElementById("phone-number").value,
      email: document.getElementById("email").value,
      key: document.getElementById("key").value,
    };

    // If the key was not generated, show the pop-up when submitting
    if (!keyGenerated) {
      alert(
        "The key is the most important part. To keep it secure, avoid copying or saving it on your computer. Instead, write it down on paper where hackers can't access it."
      );
    }

    // Output captured values (for demonstration; you can save this data as needed)
    console.log("User Details:", user);

    alert("Sign Up Successful!");
  });

// Function to navigate back to the main page
function goBack() {
  window.location.href = "index.html";
}
