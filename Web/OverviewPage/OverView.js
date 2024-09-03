fetch("/api/passwords")
  .then((response) => response.json())
  .then((passwords) => {
    const table = document.getElementById("passwordsTable");

    // Iterate over the passwords and create table rows
    passwords.forEach((password) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = password.ID;
      row.appendChild(idCell);

      const websiteCell = document.createElement("td");
      websiteCell.textContent = password.Website;
      row.appendChild(websiteCell);

      const passwordCell = document.createElement("td");
      passwordCell.textContent = password.Password;
      row.appendChild(passwordCell);

      table.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching passwords:", error));
