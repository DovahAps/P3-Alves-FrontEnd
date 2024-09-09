const openModalbtn = document.getElementById("openModal");
const modal = document.getElementById("modal1");
const closeModal = document.querySelector(".modal .close");
const btnAjoutPhoto = document.getElementById("btn-ajout-photo");
const backArrow = document.getElementById("backArrow");
const initialContent = document.querySelector(".modal-wrapper").innerHTML;
const gallery = document.querySelector(".gallery");
let worksArray = [];
const blackBand = document.getElementById("blackBand");
const darkOverlay = document.getElementById("darkOverlay");


//open modal
openModalbtn.addEventListener("click", (event) => {
  event.preventDefault();
  modal.style.display = "flex";
  modal.setAttribute("aria-hidden", "false");
  blackBand.style.display = "block";
  darkOverlay.style.display = "block";
});
//close modal
closeModal.addEventListener("click", () => {
  modal.setAttribute("style", "display:none");
  modal.setAttribute("aria-hidden", "true");
  blackBand.style.display = "none";
  darkOverlay.style.display = "none";
});
window.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
    blackBand.style.display = "none";
    darkOverlay.style.display = "none";
  }
});

//fetch works to modal 

async function fetchAndAddImages() {
  const responseModal = await fetch("http://localhost:5678/api/works");
  const worksModal = await responseModal.json();
  worksArray = worksModal;
  addWorksModal(worksModal);
}

const modalGallery = document.querySelector(".modalGallery");

//delete works from modal 
async function deleteWorkFromAPI(id) {
  const response = await fetch(`http://localhost:5678/api/works/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${sessionStorage.getItem('token')}`
    }
  });

  return response.ok;
}

// function to add works modal 

function addWorksModal(worksModal) {
  modalGallery.innerHTML = ''; // Clear previous content
  worksModal.forEach((element) => {
    addProjectToGallery(element);
  });
}

// Add a single project to the gallery with delete
function addProjectToGallery(project) {
  const galleryFigureModal = document.createElement("figure");
  galleryFigureModal.id = project.id;

  const imageElementModal = document.createElement("img");
  imageElementModal.setAttribute("src", project.imageUrl);

  const binIcon = document.createElement("i");
  binIcon.classList.add("fa-solid", "fa-trash", "bin-icon");

  binIcon.addEventListener("click", async (event) => {
   event.preventDefault()
    const success = await deleteWorkFromAPI(project.id);
    if (success) {
      galleryFigureModal.remove();
      worksArray = worksArray.filter(item => item.id !== project.id);
    }
  });

  galleryFigureModal.appendChild(imageElementModal);
  galleryFigureModal.appendChild(binIcon);
  modalGallery.appendChild(galleryFigureModal);
}

//functions modals content 
function restoreInitialContent() {
  document.querySelector(".modal-wrapper").innerHTML = initialContent;
  addEventListeners();
  fetchAndAddImages();
}
function addEventListeners() {
  const closeModal = document.querySelector(".modal .close");
  closeModal.addEventListener("click", () => {
    modal.style.display = "none";
    modal.setAttribute("aria-hidden", "true");
  });

  const backArrow = document.getElementById("backArrow");
  if (backArrow) {
    backArrow.addEventListener("click", restoreInitialContent);
  }
}
btnAjoutPhoto.addEventListener("click", () => {
  setupAddPhotoModal();
});
addEventListeners();
 
//change modal
function setupAddPhotoModal() {
  const modalWrapper = document.querySelector(".modal-wrapper");
 
  modalWrapper.innerHTML = `
    <span class="back-arrow" id="backArrow"><i class="fa-solid fa-arrow-left"></i></span>
    <h3>Ajout photo</h3>
    <span class="close"><i class="fa-solid fa-xmark"></i></span>
    <form id="photoForm" class="styled-form">
      <div class="file-upload-wrapper">
        <label for="photo" class="file-upload-label" >
      <i class="fa-solid fa-image file-upload-icon"></i>
      <span class="file-upload-text">+ Ajouter photo</span>
      <p>jpg, png: 4mo max</p>
        </label>
        <input type="file" id="photo" name="photo" accept="image/*" required>
        <img id="imagePreview" class="image-preview" src="" alt="" style="display: none;">
      </div>
      <div class="leftlabel">
        <label id="leftlabel" for="title">Titre:</label>
        <input type="text" id="title" name="title" required>
      </div>
      <div id="leftlabel" class="leftlabel">
        <label for="category">Catégorie:</label>
        <select id="category" name="category" required>
          <option value="1">Objets</option>
          <option value="2">Appartements</option>
          <option value="3">Hôtels & Restaurants</option>
        </select>
      </div>
      <hr class="separator">
      <button type="submit" class="btn-validate-photo">Valider</button>
    </form>
  `;
  addPhotoModalEventListeners()
  
}


// Function preview
function addPhotoModalEventListeners() {
  const photoInput = document.getElementById("photo");
  const imagePreview = document.getElementById("imagePreview");
  const fileUploadImgLabel = document.querySelector(".file-upload-label");
  photoInput.addEventListener("change", function() {
    
    const file = this.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        imagePreview.setAttribute("src", e.target.result);
        imagePreview.style.display = "block";
        fileUploadImgLabel.style.display= "none";
      }
      reader.readAsDataURL(file);
    } else {
      imagePreview.style.display = "none";
      fileUploadImgLabel.style.display="block";
    }
  });
  document.getElementById("photoForm").addEventListener("submit", async (event) => {
    event.preventDefault();
    await handlePhotoFormSubmit(event);
  });
}

// Function submit 
const tokenConfirmed = "Bearer " + sessionStorage.getItem('token')
async function handlePhotoFormSubmit(event) {
  const form = event.target;
  const formData = new FormData();

  const file = form.photo.files[0];
  const title = form.title.value;
  const category = form.category.value;

  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      body: formData,
      headers: { "Authorization": tokenConfirmed }
    });

    if (response.ok) {
      const data = await response.json();
      const newProject = {
        id: data.id,
        title: data.title,
        imageUrl: data.imageUrl,
        categoryId: data.category,
        userId: data.userId
      };
      worksArray.push(newProject);
      addProjectToGallery(newProject);
      restoreInitialContent();
    } else {
      console.error("Erreur", response.statusText);
    }
  } catch (error) {
    console.error("Submit error: ", error);
  }
}
fetchAndAddImages();


