// Fonction pour récupérer les "projets" depuis l'API
fetch('http://localhost:5678/api/works')
    .then(response => response.json()) // Convertir la réponse en JSON
    .then(data => {
        afficherGalerie(data); // Appeler la fonction pour afficher les images
        return data; // Retourner les données pour une utilisation ultérieure
    })
    .catch(error => console.error('Erreur:', error));

// Fonction pour afficher les images dans la galerie
function afficherGalerie(works) {
    const galerie = document.getElementById('galerie'); // Obtenir l'élément de la galerie
    galerie.innerHTML = ''; // Vide la galerie avant de remplir

    works.forEach(work => {
        const figure = document.createElement('figure'); // Créer un élément figure
        const imgElement = document.createElement('img'); // Créer un élément img
        imgElement.src = work.imageUrl; // Utiliser l'URL de l'image depuis le JSON
        imgElement.alt = work.title || 'Image'; // Description alternative si le titre est disponible
        const figcaption = document.createElement('figcaption'); // Créer un élément figcaption
        figcaption.textContent = work.title; // Ajouter le titre en tant que légende

        figure.appendChild(imgElement); // Ajouter l'image à la figure
        figure.appendChild(figcaption); // Ajouter la légende à la figure
        galerie.appendChild(figure); // Ajouter la figure à la galerie
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
        generateCategoryMenu(categories); // Appel de la fonction pour générer le menu de catégories
        addCategoryButtonListeners(); // Ajoute les listeners aux boutons ici
    })
    .catch(error => console.error('Erreur:', error));

// Fonction pour générer le menu de catégories
function generateCategoryMenu(categories) {
    const categoryButtonsContainer = document.getElementById('category-buttons');
    // Vide le conteneur avant de le remplir
    categoryButtonsContainer.innerHTML = '';

    // Ajoute le bouton "Tous"
    const allButton = document.createElement('button');
    allButton.classList.add('category-button');
    allButton.setAttribute('data-category-id', 'all');
    allButton.textContent = 'Tous';
    categoryButtonsContainer.appendChild(allButton);

    // Ajoute les boutons pour chaque catégorie
    categories.forEach(category => {
        const button = document.createElement('button');
        button.classList.add('category-button');
        button.setAttribute('data-category-id', category.id); // Utilise l'ID de la catégorie
        button.textContent = category.name; // Utilise le nom de la catégorie
        categoryButtonsContainer.appendChild(button);
    });
}

// Fonction pour ajouter les listeners aux boutons de catégorie
function addCategoryButtonListeners() {
    const buttons = document.querySelectorAll('.category-button');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedCategoryId = this.getAttribute('data-category-id'); // Récupère l'ID de la catégorie
            filterWorksByCategory(selectedCategoryId); // Appelle la fonction pour filtrer les travaux
        });
    });
}

// Fonction pour filtrer les travaux par catégorie
function filterWorksByCategory(categoryId) {
    fetch('http://localhost:5678/api/works') // Récupérer tous les travaux
        .then(response => response.json())
        .then(works => {
            if (categoryId === 'all') {
                afficherGalerie(works); // Afficher tous les travaux
            } else {
                const filteredWorks = works.filter(work => work.categoryId == categoryId); // Filtrer les travaux par catégorie
                afficherGalerie(filteredWorks); // Afficher les travaux filtrés
            }
        })
        .catch(error => console.error('Erreur:', error));
}
