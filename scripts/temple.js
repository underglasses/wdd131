// Dynamically insert the current year and modificated date
  document.getElementById("year").textContent = new Date().getFullYear();
  document.getElementById("date").textContent = document.lastModified;
  
// Toggle navigation menu on hamburger icon click
  const hamburger = document.getElementById('hamburger');
  hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('show');
  });
  const navMenu = document.querySelector('.main-nav ul');

