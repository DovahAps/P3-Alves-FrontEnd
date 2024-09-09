const emailInput = document.querySelector('input[type="email"]');
const passwordInput = document.querySelector('input[type="password"]');
const form = document.getElementById('form');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');

//submit data
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = emailInput.value;
  const password = passwordInput.value;

  const data = {
      email: email,
      password: password,
  };

  console.log('Sending data:', data); 
  loginJS(data)

  
});

//fetch user data
async function loginJS(data) {
    try {
     await fetch('http://localhost:5678/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    
.then(response=> {
    if (response.ok) {
        return response.json()
    } else {
        alert('Information incorrecte');
        throw new Error ('Erreur dans le identifiant')
    } 
})
.then(data=> {
    sessionStorage.setItem('user',data.email)
    sessionStorage.setItem('isUser', 'true')
    sessionStorage.setItem('token',data.token)
    window.location.href = './index.html';
})
        
} catch (error) {
    console.error('Error:', error);
    alert('Erreur de login');
}

}


//logout 
logoutBtn.addEventListener("click", function() {
  sessionStorage.clear();
  location.reload();
  showLogin();
});
// display in or out
document.addEventListener("DOMContentLoaded", () => {
  const isUser = sessionStorage.getItem("isUser");
  if (isUser) {
    showLogout();
    console.log("working")
  } else {
    showLogin();
  }
});

function showLogout() {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
}
function showLogin() {
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}