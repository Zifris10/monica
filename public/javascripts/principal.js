window.addEventListener('DOMContentLoaded', (event) => {
    renderLightbox('.lightbox-toggle-multimedia');
    peticionAxios('POST', '/visits/user/add', {});
});