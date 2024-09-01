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

app.post("/main", (req, res) => {
  console.log("POST /main route hit");

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      await sql.connect(dbConfig);
      console.log("Connected to the database!");

      const tokenBody = JSON.parse(body);
      console.log("User Data1:", tokenBody.token);

      const request = new sql.Request();
      request.input("LoginToken", sql.VarChar(36), tokenBody.token);

      // Output parameters should be declared without an initial value
      request.output("FirstName", sql.VarChar(225));
      request.output("Message", sql.VarChar(255));

      // Execute the stored procedure
      const result = await request.execute("loginWithToken");
      console.log("SQL Query Result:", result);

      const FirstName = result.output.FirstName;
      const message = result.output.Message;
      console.log("Login Message:", message);
      console.log("Login BackupUID:", FirstName);
      // Send response based on the result
      if (FirstName) {
        res.status(200).json({ success: true, FirstName: FirstName });
      } else {
        res.status(400).json({ success: false, message });
      }
    } catch (err) {
      console.error("SQL error:", err);
      // Send error response as JSON
      res.status(500).json({ error: "Server Error" });
    }
  });
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

app.get("/Login", (req, res) => {
  res.sendFile(path.join(webPath, "LoginPage", "LoginPage.html"));
});

app.post("/Login", (req, res) => {
  console.log("POST /Login route hit");

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
      request.input("Email", sql.VarChar(255), user.email);

      // Output parameters should be declared without an initial value
      request.output("LoginToken", sql.VarChar(36));
      request.output("Message", sql.VarChar(255));

      // Execute the stored procedure
      const result = await request.execute("LoginWithEmail");
      console.log("SQL Query Result:", result);

      const loginToken = result.output.LoginToken;
      const message = result.output.Message;
      console.log("Login Message:", message);

      // Send response based on the result
      if (loginToken) {
        res.status(200).json({ success: true, token: loginToken });
      } else {
        res.status(400).json({ success: false, message });
      }
    } catch (err) {
      console.error("SQL error:", err);
      // Send error response as JSON
      res.status(500).json({ error: "Server Error" });
    }
  });
});

app.get("/Settings", async function (req, res) {
  try {
    res.sendFile(path.join(webPath, "Settings", "Settings.html"));
  } catch (err) {
    console.error("Server Error", err);
    res.status(500).send("Server Error");
  }
});

app.post("/Settings", (req, res) => {
  console.log("POST/settings");

  let body = "";

  req.on("data", (chunk) => {
    body += chunk.toString();
  });

  req.on("end", async () => {
    try {
      await sql.connect(dbConfig);
      console.log("Connected to the database!");

      const user = JSON.parse(body);
      console.log("User Data1:", user);

      const request = new sql.Request();
      request.input("VarToken", sql.VarChar(36), user.token);
      request.input("VarFirstName", sql.VarChar(255), user.firstName);
      request.input("VarLastName", sql.VarChar(255), user.lastName);
      request.input("VarPhoneNumber", sql.VarChar(255), user.phoneNumber);
      request.input("VarEmail", sql.VarChar(255), user.email);
      request.input("Var2FA", sql.Bit, 0);
      request.input("VarUserKey", sql.VarChar(64), user.key);
      request.input("VarJsonKey", sql.VarChar(64), "example");

      // Output parameters should be declared without an initial value
      request.output("OutFirstName", sql.VarChar(255));
      request.output("OutLastName", sql.VarChar(255));
      request.output("OutPhoneNumber", sql.VarChar(255));
      request.output("OutEmail", sql.VarChar(255));
      request.output("Out2FA", sql.Bit);
      request.output("OutUserKey", sql.VarChar(64));
      request.output("OutJsonKey", sql.VarChar(64));
      request.output("Message", sql.VarChar(255));
      request.output("OutUID", sql.Int);

      // Execute the stored procedure
      const result = await request.execute("UpdateCustomer");
      console.log("SQL Query Result:", result);

      // Send response based on the result
      if (user) {
        res.status(200).json({ success: true, user });
      } else {
        res.status(400).json({ success: false, message });
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
