// Function to generate a random key
let keyGenerated = false; // Track if the key was generated
function generateKey() {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const length = 64;

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  document.getElementById("key").value = result;
  if (!generateKey) {
    keyGenerated = true; // Mark that the key has been generated
    // Show popup warning
    alert(
      "The key is the most important part. To keep it secure, avoid copying or saving it on your computer. Instead, write it down on paper where hackers can't access it."
    );
  }
}
// Function to navigate back to the main page
function goBack() {
  window.location.href = "/Main/";
}
//send data
document
  .getElementById("signup-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const user = {
      firstName: document.getElementById("first-name").value,
      lastName: document.getElementById("last-name").value,
      phoneNumber: document.getElementById("phone-number").value,
      email: document.getElementById("email").value,
      key: document.getElementById("key").value,
      token: localStorage.getItem("loginToken"),
    };

    // Log the user object to check if the data is captured correctly
    console.log("Sending user data:", user);

    // Send the data to the server using a POST request
    fetch("/Settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((response) => {
        // Check if the response is OK (200–299 range)
        if (response.ok) {
          return response.json(); // Parse JSON if response is OK
        } else {
          // If the response is not OK, throw an error
          return response.json().then((data) => {
            throw new Error(data.error || "Unknown error occurred");
          });
        }
      })
      .then((data) => {
        alert(data.success); // Show success message
        window.location.href = "/main"; // Redirect to the main page on success
      })
      .catch((error) => {
        alert(error.message); // Show the error message
      });
  });
