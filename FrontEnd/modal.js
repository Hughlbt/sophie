const openModal = function (e) {
    e.preventDefault()
    const target = document.querySelector(e.currentTarget.getAttribute('href'))
    if (target) {
        target.style.display = null;
        target.removeAttribute('aria-hidden')
        target.setAttribute('aria-modal', 'true')
    }

}


document.querySelectorAll('.js-modal').forEach(a => {
    a.addEventListener('click', openModal)
})