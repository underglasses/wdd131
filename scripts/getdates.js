 // Get the current date
  const today = new Date();

  // Format the date 
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Insert into the footer span
  document.getElementById('date').textContent = formattedDate;