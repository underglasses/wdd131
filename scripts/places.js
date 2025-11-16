// Dynamically insert the current year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Dynamically insert the document's last modified date/time
  document.getElementById("date").textContent = document.lastModified;
  