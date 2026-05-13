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
      // Use part before @ as display name, capitalize first letter
      const raw = email.split('@')[0];
      const displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
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