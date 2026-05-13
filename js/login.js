// login.js
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
 
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
 
  try {
    const response = await fetch('api/login.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
 
    const result = await response.json();
 
    if (result.status === 'success') {
      // Use first name from email (before dot or @), capitalize
      const beforeAt = email.split('@')[0];
      const firstName = beforeAt.split('.')[0];
      const displayName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      localStorage.setItem('lumi_user', JSON.stringify({ name: displayName, email: email }));
 
      // Redirect to overview
      window.location.href = 'index.html';
    } else {
      alert(result.message || 'Login fehlgeschlagen.');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Etwas ist schiefgelaufen!');
  }
});