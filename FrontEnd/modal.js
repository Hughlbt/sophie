const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    if (target) {
        target.style.display = null;
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', 'true')
    }
}

fetch('http://localhost:5678/api/works')
    .then(response => response.json())
    .then(data => {
        afficherModalGalerie(data);
        return data;
    })
    .catch(error => console.error('Erreur:', error))


function afficherModalGalerie(works) {
    const galerie = document.getElementById('modal-galerie');
    galerie.innerHTML = '';

    works.forEach(work => {
        const figure = document.createElement('figure');
        const imgElement = document.createElement('img');
        imgElement.src = work.imageUrl;
        imgElement.alt = work.title || 'Image';
        const figcaption = document.createElement('figcaption');

        figure.appendChild(imgElement);
        figure.appendChild(figcaption);
        galerie.appendChild(figure);
    });
}

const closeModal = function (modal) {
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal(modal)
        }
    })

    const closeButton = modal.querySelector('.modal-close');
    if (closeButton) {
        closeButton.addEventListener('click', function () {
            closeModal(modal)
        })
    }
})


