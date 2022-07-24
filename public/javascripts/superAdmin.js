window.addEventListener('DOMContentLoaded', (event) => {
    const userAgent = navigator.userAgent;
    if(userAgent.match(/chrome|chromium|crios/i) || userAgent.match(/firefox|fxios/i)) {
        const token = localStorage.getItem('tokenMonica');
        if(token) {
            obtenerPerfil();
            obtenerHash();
        } else {
            cerrarSesion();
        }
    } else {
        cerrarSesion();
    }
});

const obtenerHash = async () => {
    document.documentElement.scrollTop = 0;
    let links = document.querySelectorAll('.menu-links');
    let content = $('#divContenido');
    content.html('<div class="spinner-border text-white" style="width: 6rem; height: 6rem;" role="status"></div>').addClass('mt-5 text-center');
    let url = '';
    for(let index = 0; index < links.length; index++) {
        const valueFor = links[index];
        if(valueFor.dataset.href === location.hash) {
            valueFor.classList.add('bg-menu-link');
            url = valueFor.dataset.api;
        } else {
            valueFor.classList.remove('bg-menu-link');
        }
    }
    if(url) {
        const axiosPeticion = await peticionAxios('GET', url, {});
        if(axiosPeticion.code === 200) {
            content.removeClass('mt-5 text-center').html(axiosPeticion.html);
            if(location.hash === '#promociones') {
                renderLightbox('.lightbox-toggle');
            }
        } else {
            //cerrarSesion();
        }
    } else {
        //cerrarSesion();
    }
}

const cerrarSesion = () => {
    localStorage.removeItem('tokenMonica');
    location.href = '/auth-super-admin';
}

/////////////////////////////////
//////////// PERFIL /////////////
/////////////////////////////////
const obtenerPerfil = async () => {
    const axiosPeticion = await peticionAxios('GET', '/users/super-admin/get', {});
    if(axiosPeticion.code === 200) {
        $('#nombreNavbar').text(axiosPeticion.name);
        $('#nombrePerfil').val(axiosPeticion.name);
        $('#emailPerfil').val(axiosPeticion.email);
    } else {
        cerrarSesion();
    }
}

const actualizarPerfil = async () => {
    let name = $('#nombrePerfil').val().trim();
    let email = $('#emailPerfil').val().trim();
    if(tieneDatos(name, 'El nombre') && tieneDatos(email, 'El correo') && esCorreo(email, 'El correo')) {
        showSwalLoading();
        const data = { name, email };
        const axiosPeticion = await peticionAxios('PUT', '/users/super-admin/update', data);
        if(axiosPeticion.code === 200) {
            $('#nombreNavbar').text(name);
            showSwalSuccess('Perfil actualizado correctamente.');
        } else {
            showSwalError(axiosPeticion.error);
        }
    }
}