const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    if (target) {
        target.style.display = null;
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', 'true')
    }
}

const closeModal = function (modal) {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
}

document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})

document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal(modal);
        }
    })
})