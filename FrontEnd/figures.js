// Fonction pour récupérer les "projets" depuis l'API
fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        afficherGalerie(data);
        return data;
    })
    .catch(error => console.error('Erreur:', error));


function afficherGalerie(works) {
    const galerie = document.getElementById('galerie');
    galerie.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const imgElement = document.createElement('img');
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title || 'Image';
        const figcaption = document.createElement('figcaption');
        figcaption.textContent = work.title;

        figure.appendChild(imgElement);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
    });
}

// Récupérer les catégories
fetch('http://localhost:5678/api/categories')
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur réseau : ' + response.statusText);
        }
        return response.json();
    })
    .then(categories => {
        generateCategoryMenu(categories);
        addCategoryButtonListeners();
    })
    .catch(error => console.error('Erreur:', error));

function generateCategoryMenu(categories) {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    categoryButtonsContainer.innerHTML = '';


    const allButton = document.createElement('button');
    allButton.classList.add('category-button');
    allButton.setAttribute('data-category-id', 'all');
    allButton.textContent = 'Tous';
    categoryButtonsContainer.appendChild(allButton);


    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.setAttribute('data-category-id', category.id);
        button.textContent = category.name;
        categoryButtonsContainer.appendChild(button);
    });
}


function addCategoryButtonListeners() {
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.addEventListener('click', function () {
            const selectedCategoryId = this.getAttribute('data-category-id');
            filterWorksByCategory(selectedCategoryId);
        });
    });
}


function filterWorksByCategory(categoryId) {
    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            if (categoryId === 'all') {
                afficherGalerie(works);
            } else {
                const filteredWorks = works.filter(work => work.categoryId == categoryId);
                afficherGalerie(filteredWorks);
            }
        })
        .catch(error => console.error('Erreur:', error));
}

window.addEventListener("DOMContentLoaded", () => {
    const modeEditionBanner = document.getElementById("mode-edition-banner");
    const modeEdition = document.getElementsByClassName("mode-edition");
    const modeEditionCategory = document.getElementById("category-buttons");
    const modeEditionModifier = document.getElementsByClassName("bouton-modifier");
    console.log(modeEdition);
    const token = localStorage.getItem("token");


    if (token) {
        console.log("Token trouvé, mode édition activé");
        modeEditionBanner.style.display = "block";
        modeEdition[0].textContent = "Logout";
        modeEditionCategory.style.display = "none";
        modeEditionModifier[0].style.display = "flex";


    } else {
        console.log("Pas de token, mode édition désactivé");
        modeEditionBanner.style.display = "none";
        modeEdition[0].textContent = "Login";
        modeEditionModifier[0].style.display = "none";
    }
});

