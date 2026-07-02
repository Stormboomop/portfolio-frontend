// ============================================
// CONFIG
// ============================================

const API = "https://portfolio-backend-tpo1.onrender.com/api";

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "../suzzjal.html";
}


// ============================================
// DOM ELEMENTS
// ============================================

// Sidebar
const navButtons = document.querySelectorAll(".nav-btn");
const logoutBtn = document.getElementById("logoutBtn");

// Sections
const portfolioSection = document.getElementById("portfolioSection");
const projectsSection = document.getElementById("projectsSection");

// Portfolio Inputs
const nameInput = document.getElementById("name");
const taglineInput = document.getElementById("tagline");
const aboutInput = document.getElementById("about");
const emailInput = document.getElementById("email");
const instagramInput = document.getElementById("instagram");

const savePortfolioBtn = document.getElementById("savePortfolio");

// Modal
const modal = document.getElementById("projectModal");
const closeModal = document.getElementById("closeModal");
const showAddModal = document.getElementById("showAddModal");

// Project Inputs
const modalTitle = document.getElementById("modalTitle");

const projectTitle = document.getElementById("projectTitle");
const projectImage = document.getElementById("projectImage");
const projectLink = document.getElementById("projectLink");

const saveProjectBtn = document.getElementById("saveProject");

const projectsGrid = document.getElementById("projectsGrid");

// Image Preview
const imagePreview = document.getElementById("imagePreview");


// ============================================
// GLOBAL VARIABLES
// ============================================

let editMode = false;
let editId = null;
let existingImage = "";


// ============================================
// LOGOUT
// ============================================

logoutBtn.addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "../suzzjal.html";

});


// ============================================
// SIDEBAR TABS
// ============================================

navButtons.forEach(button => {

    button.addEventListener("click", () => {

        navButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const tab = button.dataset.tab;

        portfolioSection.classList.remove("active");
        projectsSection.classList.remove("active");

        if (tab === "portfolio") {

            portfolioSection.classList.add("active");

        } else {

            projectsSection.classList.add("active");

        }

    });

});


// ============================================
// MODAL
// ============================================

showAddModal.onclick = () => {

    editMode = false;

    editId = null;

    existingImage = "";

    modalTitle.textContent = "Add Project";

    projectTitle.value = "";
    projectImage.value = "";
    projectLink.value = "";

    if (imagePreview) {

        imagePreview.src = "";
        imagePreview.style.display = "none";

    }

    modal.style.display = "flex";

};


closeModal.onclick = () => {

    modal.style.display = "none";

};


window.onclick = e => {

    if (e.target === modal) {

        modal.style.display = "none";

    }

};


// ============================================
// IMAGE PREVIEW
// ============================================

if (projectImage && imagePreview) {

    projectImage.addEventListener("change", () => {

    const file = projectImage.files[0];

    if (!file)
        return;

    const reader = new FileReader();

    reader.onload = function (e) {

        imagePreview.src = e.target.result;

        imagePreview.style.display = "block";

    };

    reader.readAsDataURL(file);

});
}


// ============================================
// LOAD PORTFOLIO
// ============================================

async function loadPortfolio() {

    try {

        const response = await fetch(API + "/portfolio");

        const data = await response.json();

        nameInput.value = data.name;
        taglineInput.value = data.tagline;
        aboutInput.value = data.about;
        emailInput.value = data.email;
        instagramInput.value = data.instagram;

    }

    catch (err) {

        console.error(err);

    }

}


// ============================================
// SAVE PORTFOLIO
// ============================================

savePortfolioBtn.addEventListener(

    "click",

    async () => {

        try {

            const response = await fetch(

                API + "/portfolio",

                {

                    method: "PUT",

                    headers: {

                        "Content-Type": "application/json",

                        Authorization:
                            "Bearer " + token

                    },

                    body: JSON.stringify({

                        name: nameInput.value,

                        tagline: taglineInput.value,

                        about: aboutInput.value,

                        email: emailInput.value,

                        instagram: instagramInput.value

                    })

                }

            );

            const data = await response.json();

            alert(data.message);

        }

        catch (err) {

            console.error(err);

        }

    }

);

// ============================================
// LOAD PROJECTS
// ============================================

async function loadProjects() {

    try {

        const response = await fetch(API + "/projects");

        const projects = await response.json();

        projectsGrid.innerHTML = "";

        projects.forEach(project => {

            projectsGrid.innerHTML += `

            <div class="project-card">

                <img src="${project.image}"
onerror="this.src='https://placehold.co/600x400?text=No+Image'"
                    alt="${project.title}">

                <div class="project-content">

                    <h3>${project.title}</h3>

                    <p>
                        <a href="${project.link}" target="_blank">
                            ${project.link}
                        </a>
                    </p>

                    <div class="project-actions">

                        <button
                            class="edit-btn"
                            onclick="editProject(${project.id})">

                            Edit

                        </button>

                        <button
                            class="delete-btn"
                            onclick="deleteProject(${project.id})">

                            Delete

                        </button>

                    </div>

                </div>

            </div>

            `;

        });

    }

    catch (err) {

        console.error(err);

    }

}

// ============================================
// SAVE PROJECT
// ============================================

saveProjectBtn.addEventListener("click", async () => {

    try {

        let imagePath = existingImage;

        // Upload image if user selected one
        if (projectImage.files.length > 0) {

            const formData = new FormData();

            formData.append(

                "image",

                projectImage.files[0]

            );

const uploadResponse = await fetch(

    API + "/upload",

    {

        method: "POST",

        headers: {

            Authorization: "Bearer " + token

        },

        body: formData

    }

);
            const uploadData = await uploadResponse.json();

            imagePath = uploadData.image;

        }

        const payload = {

            title: projectTitle.value,

            image: imagePath,

            link: projectLink.value

        };

        let url = API + "/projects";

        let method = "POST";

        if (editMode) {

            url += "/" + editId;

            method = "PUT";

        }

        const response = await fetch(

            url,

            {

                method,

                headers: {

                    "Content-Type": "application/json",

                    Authorization:
                        "Bearer " + token

                },

                body: JSON.stringify(payload)

            }

        );

        const data = await response.json();

       alert(data.message);

modal.style.display = "none";

// Clear form
projectTitle.value = "";
projectLink.value = "";
projectImage.value = "";

imagePreview.src = "";
imagePreview.style.display = "none";

loadProjects();

    }

    catch (err) {

        console.error(err);

    }

});

// ============================================
// EDIT PROJECT
// ============================================

async function editProject(id) {

    const response = await fetch(API + "/projects");

    const projects = await response.json();

    const project = projects.find(

        p => p.id === id

    );

    editMode = true;

    editId = id;

    existingImage = project.image;

    modalTitle.textContent = "Edit Project";

    projectTitle.value = project.title;

    projectLink.value = project.link;

    projectImage.value = "";

    if (imagePreview) {

        imagePreview.src = project.image;

        imagePreview.style.display = "block";

    }

    modal.style.display = "flex";

}

// ============================================
// DELETE PROJECT
// ============================================

async function deleteProject(id) {

    const confirmDelete = confirm(

        "Delete this project?"

    );

    if (!confirmDelete)
        return;

    try {

        const response = await fetch(

            API + "/projects/" + id,

            {

                method: "DELETE",

                headers: {

                    Authorization:
                        "Bearer " + token

                }

            }

        );

        const data = await response.json();

        alert(data.message);

        loadProjects();

    }

    catch (err) {

        console.error(err);

    }

}

// ============================================
// INITIAL LOAD
// ============================================

loadPortfolio();

loadProjects();