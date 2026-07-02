async function loadPortfolio() {

    try {

        // Portfolio Details
        const portfolioResponse = await fetch("https://portfolio-backend-tpo1.onrender.com/api/portfolio");
        const portfolio = await portfolioResponse.json();

        document.getElementById("name").textContent = portfolio.name;
        document.getElementById("tagline").textContent = portfolio.tagline;
        document.getElementById("about-text").textContent = portfolio.about;

        document.getElementById("email-btn").href =
            "mailto:" + portfolio.email;

        document.getElementById("insta-btn").href =
            portfolio.instagram;


        // Projects
        const projectResponse = await fetch("https://portfolio-backend-tpo1.onrender.com/api/projects");
        const projects = await projectResponse.json();

        const workGrid = document.getElementById("work-grid");

        workGrid.innerHTML = "";

        projects.forEach(project => {

            workGrid.innerHTML += `

            <div class="card">

                <img src="${project.image}" alt="${project.title}">

                <div class="card-content">

                    <h3>${project.title}</h3>

                    <a href="${project.link}" target="_blank">

                        View Project →

                    </a>

                </div>

            </div>

            `;

        });

    }

    catch (error) {

        console.log(error);

    }

}

loadPortfolio();