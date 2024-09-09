//fetch fig
const reponse = await fetch("http://localhost:5678/api/works")
let works = await reponse.json()

const gallery = document.querySelector(".gallery");

// function for each fig
function addWorks(works) {
  gallery.innerHTML = "";
  works.forEach((element) => {
    const galleryFigure = document.createElement("figure");
    galleryFigure.id = element.id;
    const imageElement = document.createElement("img");
    imageElement.setAttribute("src", element.imageUrl);
    const nomElement = document.createElement("figcaption");
    nomElement.textContent = element.title;
    gallery.appendChild(galleryFigure);
    gallery.appendChild(imageElement);
    gallery.appendChild(nomElement);
    galleryFigure.appendChild(imageElement)
    galleryFigure.appendChild(nomElement)
  });
}
addWorks(works);


//filter 

const btnFilterTous = document.querySelector(".btn-filter-tous");
btnFilterTous.addEventListener("click", function () {
  addWorks(works);
});
const btnFilterObjets = document.querySelector(".btn-filter-objets");
btnFilterObjets.addEventListener("click", function () {
  const filterWorks = works.filter((works) => works.categoryId === 1);
  addWorks(filterWorks);
});
const btnFilterAppartements = document.querySelector(
  ".btn-filter-appartements"
);
btnFilterAppartements.addEventListener("click", function () {
  const filterWorks = works.filter((works) => works.categoryId === 2);
  addWorks(filterWorks);
});
const btnFilterHotels = document.querySelector(".btn-filter-hotels");
btnFilterHotels.addEventListener("click", function () {
  const filterWorks = works.filter((works) => works.categoryId === 3);
  addWorks(filterWorks);
});



//login logout 
const openModalContainer = document.getElementById('openModal');
const btnContainer = document.querySelector('.btn-container');
const logoutBtn = document.getElementById('logout-btn');
const loginBtn = document.getElementById('login-btn');
logoutBtn.addEventListener("click", function() {
  sessionStorage.clear();
  location.reload();
  showLogin();
  hideOpenModal();
  showBtnContainer();
});
// display in or out
if (sessionStorage!==null){
  const isUser = sessionStorage.getItem("isUser");
  if (isUser === "true") {
    showLogout();
    showOpenModal();
    hideBtnContainer();
    console.log("utilisateur connecte")
  } else {
    showLogin();
    hideOpenModal()
    showBtnContainer();
    console.log("deconecte")
  }
}
 
function showLogout() {
  loginBtn.style.display = "none";
  logoutBtn.style.display = "block";
}
function showLogin() {
  loginBtn.style.display = "block";
  logoutBtn.style.display = "none";
}
//display modal 

function showOpenModal() {
  openModalContainer.style.display = 'block';
}
function hideOpenModal() {
  openModalContainer.style.display = 'none'; 
}
//display hide filter btn

function showBtnContainer() {
  btnContainer.style.display = 'flex';
}
function hideBtnContainer() {
  btnContainer.style.display = 'none';
}
