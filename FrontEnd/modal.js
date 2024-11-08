
const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    if (target) {
        target.style.display = null
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', 'true')
    }
}


document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

const closeModal = function (modal) {
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
}

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal(modal)
        }
    })

    const closeButtons = modal.querySelectorAll('.modal-close1, .modal-close2');
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            closeModal(modal);
        });
    });
    

    const page1 = modal.querySelector('.modal-page1')
    const page2 = modal.querySelector('.modal-page2')
    const returnButton = modal.querySelector('.retour')

    page2.classList.add('hidden')


    const nextPageButton = modal.querySelector('.ajout-photo')
    if (nextPageButton) {
        nextPageButton.addEventListener('click', function () {
            page1.classList.add('hidden')
            page2.classList.remove('hidden')
        })
    }

    returnButton.addEventListener('click', function () {
        page2.classList.add('hidden')
        page1.classList.remove('hidden')
        afficherModalGalerie()
    })

})

function afficherModalGalerie() {
    const galerie = document.getElementById('modal-galerie')
    galerie.innerHTML = ''

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            works.forEach(work => {
                const figure = document.createElement('figure')
                const imgElement = document.createElement('img')
                imgElement.src = work.imageUrl
                imgElement.alt = work.title || 'Image'
                const figcaption = document.createElement('figcaption')
                figure.appendChild(imgElement)
                figure.appendChild(figcaption)
                galerie.appendChild(figure)
            })
        })
        .catch(error => console.error('Erreur:', error))
}

afficherModalGalerie()
