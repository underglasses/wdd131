// Dynamically insert the current year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Dynamically insert the document's last modified date/time
  document.getElementById("date").textContent = document.lastModified;
  
  // Toggle navigation menu on hamburger icon click
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.querySelector('.main-nav ul');

  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });