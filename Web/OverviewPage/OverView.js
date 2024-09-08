fetch("/api/passwords", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    token: sessionStorage.getItem("loginToken"),
  }),
})
  .then((response) => response.json())
  .then((passwords) => {
    const table = document.getElementById("passwordsTable");
    let i = 1;
    // Iterate over the passwords and create table rows
    passwords.forEach((password) => {
      const row = document.createElement("tr");

      const idCell = document.createElement("td");
      idCell.textContent = i;
      i++;
      row.appendChild(idCell);

      const tokenIDCell = document.createElement("td");
      tokenIDCell.textContent = password.TokenID;
      row.appendChild(tokenIDCell);

      const websiteCell = document.createElement("td");
      websiteCell.textContent = password.Website;
      row.appendChild(websiteCell);

      const WebsiteLoginTextCell = document.createElement("td");
      WebsiteLoginTextCell.textContent = password.WebsiteLoginText;
      row.appendChild(WebsiteLoginTextCell);

      const ChangedCountCell = document.createElement("td");
      ChangedCountCell.textContent = password.ChangedCount;
      row.appendChild(ChangedCountCell);

      const UsedCountCell = document.createElement("td");
      UsedCountCell.textContent = password.UsedCount;
      row.appendChild(UsedCountCell);

      const btn = document.createElement("input");
      btn.type = "button";
      btn.className = "btn";
      btn.value = "show password"; // Use value for button text instead of textContent
      btn.onclick = function () {
        getPassword(password.TokenID); // Call getPassword when button is clicked
      };

      row.appendChild(btn);

      table.appendChild(row);
    });
  })
  .catch((error) => console.error("Error fetching passwords:", error));

function getPassword(id) {
  fetch("/api/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      token: sessionStorage.getItem("loginToken"),
      id: id,
    }),
  })
    .then((response) => response.json())
    .then((password) => {
      alert(password[0].Password);
    })
    .catch((error) => console.error("Error fetching passwords:", error));
}
