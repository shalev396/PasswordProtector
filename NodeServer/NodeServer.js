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
    trustServerCertificate: true, // Bypass SSL certificate validation
    trustedConnection: true,
    connectTimeout: 30000, // Increase connection timeout to 30 seconds
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

// Route to get data query1
app.get("/SignUp", async (req, res) => {
  try {
    // Await the connection to ensure it's established before running the query
    await sql.connect(dbConfig);
    res.sendFile(path.join(webPath, "SignUp", "SignUp.html"));
    console.log("Connected successfully!");

    // Query (Stored Procedure) the database
    const result = await sql.query(
      `EXEC SignUp 'John', 'Doe', '1234567890', 'john.doe@example.com', 0, 'UserKey123', 'JsonKey123', 'BackupUID123';`
    );
    console.log(result);

    // Send the results as JSON
    res.json(result.recordset);
  } catch (err) {
    console.error("SQL error", err);
    res.status(500).send("Server Error");
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
