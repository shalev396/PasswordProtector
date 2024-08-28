const express = require("express");
const sql = require("mssql");
require("dotenv").config();
const path = require("path");
const webPath = path.join(__dirname, "../Web");
const app = express();
const port = 3000;

app.use(express.static(webPath));

// Database configuration
const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000,
  },
  options: {
    trustServerCertificate: true,
    trustedConnection: true,
    connectTimeout: 30000,
  },
};

// Route to get data Main page
app.get("/main", async function (req, res) {
  try {
    res.sendFile(path.join(webPath, "MainPage", "index.html"));
  } catch (err) {
    console.error("Server Error", err);
    res.status(500).send("Server Error");
  }
});

// Route to serve the SignUp page
app.get("/SignUp", (req, res) => {
  res.sendFile(path.join(webPath, "SignUp", "SignUp.html"));
});

// Route to handle form submission (SignUp)
app.post("/SignUp", (req, res) => {
  console.log("POST /SignUp route hit");

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      await sql.connect(dbConfig);
      console.log("Connected to the database!");

      const user = JSON.parse(body);
      console.log("User Data:", user);

      const request = new sql.Request();
      request.input("VarFirstName", sql.VarChar(255), user.firstName);
      request.input("VarLastName", sql.VarChar(255), user.lastName);
      request.input("VarPhoneNumber", sql.VarChar(255), user.phoneNumber);
      request.input("VarEmail", sql.VarChar(255), user.email);
      request.input("Var2FA", sql.Bit, 0);
      request.input("VarUserKey", sql.VarChar(64), user.key);
      request.input("VarJsonKey", sql.VarChar(64), "JsonKey123");
      request.input("VarBackupUID", sql.VarChar(64), "BackupUID123");

      // Define the output parameter for the message
      request.output("Message", sql.VarChar(255));

      // Execute the stored procedure
      const result = await request.execute("SignUp");
      console.log("SQL Query Result:", result);

      const message = result.output.Message;
      console.log("SignUp Message:", message);

      // Send response based on the message
      if (message.includes("already exists")) {
        res.status(400).json({ error: message });
      } else {
        res.status(200).json({ success: "Sign Up Successful" });
      }
    } catch (err) {
      console.error("SQL error:", err);
      // Send error response as JSON
      res.status(500).json({ error: "Server Error" });
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}/main`);
});
