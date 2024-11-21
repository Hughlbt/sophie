
const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    if (target) {
        target.style.display = null
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', 'true')
        resetModal(target)
    }
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

const closeModal = function (modal) {
    modal.style.display = "none"
    modal.setAttribute('aria-hidden', 'true')
    modal.removeAttribute('aria-modal')
    resetModal(modal)
}

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal(modal)
        }
    })

    const closeButtons = modal.querySelectorAll('.modal-close1, .modal-close2')
    closeButtons.forEach(button => {
        button.addEventListener('click', function () {
            closeModal(modal)
        })
    })


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

    })

})

function resetModal(modal) {
    const page1 = modal.querySelector('.modal-page1')
    const page2 = modal.querySelector('.modal-page2')
    const imageContainer = modal.querySelector('#image-container')
    const fileLabel = modal.querySelector('label[for="image"]')
    const sizeLimitText = modal.querySelector('p')

    if (page1 && page2) {
        page1.classList.remove('hidden')
        page2.classList.add('hidden')
    }

    const imagePreview = imageContainer.querySelector('img')
    if (imagePreview) {
        imagePreview.remove()
    }

    fileLabel.textContent = '+ Ajouter photo'
    sizeLimitText.style.display = 'block'
    imageContainer.classList.remove('hidden')


}


function afficherModalGalerie() {
    const galerie = document.getElementById('modal-galerie')
    const galeriePrincipale = document.getElementById('galerie') //Me permet de selectionner l'élement id=galerie de mon HTML

    galerie.innerHTML = ''

    fetch('http://localhost:5678/api/works')
        .then(response => response.json())
        .then(works => {
            works.forEach(work => {
                const figure = document.createElement('figure')
                figure.setAttribute('data-id', work.id)
                figure.classList.add('image-container') // Ajoute la classe CSS personnalisée
                const imgElement = document.createElement('img')
                const deleteButton = document.createElement('button')
                const icon = document.createElement('i')
                imgElement.src = work.imageUrl
                imgElement.alt = work.title || 'Image'
                const figcaption = document.createElement('figcaption')

                icon.classList.add('fas', 'fa-trash-can')  // Classe Font Awesome pour l'icône de la poubelle
                deleteButton.appendChild(icon)  // On ajoute l'icône au bouton
                deleteButton.classList.add('delete-button')

                figure.appendChild(imgElement)
                figure.appendChild(figcaption)
                figure.appendChild(deleteButton)
                galerie.appendChild(figure)

                deleteButton.addEventListener('click', () => {
                    deleteWork(work.id) //Appelle la fonction deleteWork() qui envoi un requette pour supprimer l'image qui a l'id correspondant
                        .then(() => {
                            const imageToDelete = galeriePrincipale.querySelector(`[data-id="${work.id}"]`)
                            if (imageToDelete) {
                                imageToDelete.remove() //Supprime l'élément dynamqiquement de la gallerie principale
                            }
                            figure.remove() // permet de supprimer dynamiquement l'élément de la modale
                        })
                })
            })
        })
        .catch(error => console.error('Erreur:', error)) // permet d'attraper l'erreur et de l'afficher dans la console
}

function deleteWork(workId) { //Je ne comprend pas les points sous le "de"
    const token = localStorage.getItem('token') //Recup du token
    if (!token) { // si il est absent 
        console.error("Token d'authentification manquant")
        return Promise.reject("Token manquant")
    }

    return fetch(`http://localhost:5678/api/works/${workId}`, { // si le token est présent
        method: 'DELETE',
        headers: { // Nous permet d'avoir l'autorisation et évite une erreur 401
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    })
        .then(response => { // Permet d'avoir les différentes réponses via la console, cela "facultatif" 
            console.log('Réponse du serveur:', response)
            if (response.ok) {
                console.log(`Image avec id ${workId} supprimée`)
                return true
            } else {
                console.error('Erreur lors de la suppression', response.status)
                return false
            }
        })
        .catch(error => {
            console.error('Erreur:', error)
            return false
        })
}



function configurerImage() {
    const imageContainer = document.getElementById('image-container')

    const imageIcon = document.createElement('i')
    imageIcon.classList.add('fa-regular', 'fa-image')
    imageContainer.appendChild(imageIcon)

    const fileLabel = document.createElement('label')
    fileLabel.textContent = '+ Ajouter photo'
    fileLabel.setAttribute('for', 'image')
    imageContainer.appendChild(fileLabel)

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.id = 'image'
    fileInput.required = true
    fileInput.style.display = 'none'
    imageContainer.appendChild(fileInput)

    const sizeLimitText = document.createElement('p')
    sizeLimitText.textContent = 'jpg, png : 4mo max'
    sizeLimitText.style.fontSize = '0.8em'
    sizeLimitText.style.color = 'gray'
    imageContainer.appendChild(sizeLimitText)

    fileLabel.addEventListener('click', (event) => {
        event.preventDefault()
        fileInput.click()
    })

    fileInput.addEventListener('change', () => {
        const file = fileInput.files[0]
        if (file) {
            fileLabel.textContent = ''

            sizeLimitText.style.display = 'none'

            const existingImagePreview = imageContainer.querySelector('img')
            if (existingImagePreview) {
                existingImagePreview.remove()
            }

            const imagePreview = document.createElement('img')
            imagePreview.src = URL.createObjectURL(file)
            imagePreview.alt = file.name
            imagePreview.style.maxWidth = '100px'
            imagePreview.style.marginTop = '10px'
            imageContainer.appendChild(imagePreview)
            imageContainer.classList.add('hidden')
        } else {
            fileLabel.textContent = '+ Ajouter photo'
            sizeLimitText.style.display = 'block'

        }
    })
}

function configurerTitre() {
    const titleInput = document.getElementById('title')
    const titleLabel = document.createElement('label')
    titleLabel.setAttribute('for', 'title')
    titleInput.parentNode.insertBefore(titleLabel, titleInput)
}

function afficherCategories() {
    const categoriesSelect = document.getElementById('categories')
    categoriesSelect.innerHTML = ''

    const labelCategories = document.createElement('label')
    labelCategories.setAttribute('for', 'categories')
    labelCategories.textContent = ''
    categoriesSelect.parentNode.insertBefore(labelCategories, categoriesSelect)

    const defaultOption = document.createElement('option')
    defaultOption.value = ''
    defaultOption.textContent = ''
    defaultOption.disabled = true
    defaultOption.selected = true
    categoriesSelect.appendChild(defaultOption)

    fetch('http://localhost:5678/api/categories')
        .then(response => {
            if (!response.ok) throw new Error('Erreur lors de la récupération des catégories')
            return response.json()
        })
        .then(categories => {
            categories.forEach(category => {
                const option = document.createElement('option')
                option.value = category.id
                option.textContent = category.name
                categoriesSelect.appendChild(option)
            })
        })
        .catch(error => console.error('Erreur:', error))
}

document.addEventListener('DOMContentLoaded', () => {
    function ajouterNouveauProjet(e) {
        e.preventDefault()

        const title = document.getElementById('title').value
        const category = document.getElementById('categories').value
        const image = document.getElementById('image').files[0]

        if (!title || !category || !image) {
            const errorMessage = document.getElementById('errorMessage')
            errorMessage.style.display = 'block'
            errorMessage.textContent = 'Veuillez remplir tous les champs'
            return
        } else {
            errorMessage.style.display = 'none'
        }

        const formData = new FormData()
        formData.append('title', title)
        formData.append('category', category)
        formData.append('image', image)

        const token = localStorage.getItem('token')
        if (!token) {
            alert("Token d'authentification manquant")
            return
        }

        fetch('http://localhost:5678/api/works', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        })
            .then(response => { //Je comprends pas les ...
                if (!response.ok) return response.json().then(data => Promise.reject(data))
                return response.json()
            })
            .then(data => {
                alert('Projet ajouté !') // À supprimer pour enlever la notification
                addProject.reset() // Réinitialise le formulaire

                const imageContainer = document.getElementById('image-container')
                const imagePreview = imageContainer.querySelector('img')
                if (imagePreview) {
                    imagePreview.remove()
                }

                afficherModalGalerie()

                const galeriePrincipale = document.getElementById('galerie')
                const newFigure = document.createElement('figure')
                newFigure.setAttribute('data-id', data.id)

                const imgElement = document.createElement('img')
                imgElement.src = data.imageUrl
                imgElement.alt = data.title || 'Image'

                const figcaption = document.createElement('figcaption')
                figcaption.textContent = data.title || 'Sans titre';

                newFigure.appendChild(imgElement)
                newFigure.appendChild(figcaption)

                galeriePrincipale.appendChild(newFigure)
            })
            .catch(error => {
                console.error('Erreur lors de l\'envoi du formulaire:', error)
                alert(`Erreur : ${error.message || 'Une erreur est survenue'}`)
            })
    }

    const addProject = document.getElementById('add-project')
    if (addProject) {
        addProject.addEventListener('submit', ajouterNouveauProjet)
    } else {
        console.error("Formulaire d'ajout de projet introuvable")
    }

    configurerImage()
    configurerTitre()
    afficherCategories()
    afficherModalGalerie()
})