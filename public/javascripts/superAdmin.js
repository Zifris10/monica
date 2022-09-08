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
    content.html('<div class="spinner-border text-primary" style="width: 6rem; height: 6rem;" role="status"></div>').addClass('mt-5 text-center');
    let url = '';
    for(let index = 0; index < links.length; index++) {
        let valueFor = links[index];
        if(valueFor.dataset.href === location.hash) {
            valueFor.classList.add('bg-menu-link');
            valueFor.children[0].children[0].classList.add('text-white');
            valueFor.children[1].children[0].classList.add('text-white');
            url = valueFor.dataset.api;
        } else {
            valueFor.classList.remove('bg-menu-link');
            valueFor.children[0].children[0].classList.remove('text-white');
            valueFor.children[1].children[0].classList.remove('text-white');
        }
    }
    if(url) {
        const axiosPeticion = await peticionAxios('GET', url, {});
        if(axiosPeticion.code === 200) {
            content.removeClass('mt-5 text-center').html(axiosPeticion.html);
            if(location.hash === '#artistas') {
                renderLightbox('.lightbox-toggle-artista');
                habilitarSortableArtistas();
            } else if(location.hash === '#multimedia') {
                renderLightbox('.lightbox-toggle-multimedia');
            }
        } else {
            cerrarSesion();
        }
    } else {
        cerrarSesion();
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
        let btn = $('#btnActualizarPerfil');
        btn.html('<span class="spinner-border" role="status" aria-hidden="true"></span>').prop('disabled', true);
        const data = {
            name,
            email
        };
        const axiosPeticion = await peticionAxios('PUT', '/users/super-admin/update', data);
        if(axiosPeticion.code === 200) {
            $('#nombreNavbar').text(name);
            showToastify('Perfil actualizado correctamente.', '#4caf50');
        } else {
            showToastify(axiosPeticion.error);
        }
        btn.html('ACTUALIZAR').prop('disabled', false);
    }
}

/////////////////////////////////
////////// GENERALES ////////////
/////////////////////////////////
const actualizarGenerales = async (value, field) => {
    const data = {
        value,
        field
    };
    const axiosPeticion = await peticionAxios('PUT', '/generals/super-admin/update', data);
    if(axiosPeticion.code === 200) {
        showToastify('Información actualizada correctamente.', '#4caf50');
    } else {
        showToastify(axiosPeticion.error);
    }
}

/////////////////////////////////
/////////// ARTÍSTAS ////////////
/////////////////////////////////
const limpiarModalArtista = () => {
    $('#modalAgregarArtista').modal('hide');
    $('#nombreArtista').val('');
    $('#imagenArtista').val('');
    $('#inputImagenArtista').val('');
}

const agregarArtista = async () => {
    let nombre = $('#nombreArtista').val();
    let imagen = document.getElementById('imagenArtista').files[0];
    if(tieneDatos(nombre, 'El nombre') && tieneDatos(imagen, 'La imagen')) {
        let btn = $('#btnAgregarArtista');
        btn.html('<span class="spinner-border" role="status" aria-hidden="true"></span>').prop('disabled', true);
        let formData = new FormData();
        formData.append('name', nombre);
        formData.append('image', imagen);
        const axiosPeticion = await peticionAxios('POST', '/artists/super-admin/add', formData, true);
        if(axiosPeticion.code === 200) {
            const { artist } = axiosPeticion;
            const timestamp = Date.now();
            const html = `<tr id="${artist.id}">
                <th class="pt-3">
                    <i class="fa-solid fa-sort text-body cursor-pointer handle-artistas"></i>
                </th>
                <th>
                    <a class="clase-${timestamp}" href="${artist.image}" id="lightboxImagenArtista${artist.id}">
                        <img class="rounded-circle" src="${artist.image}" width="45" height="45" id="imagenArtista${artist.id}">
                    </a>
                    <label for="inputImagenArtista${artist.id}">
                        <i class="fa-solid fa-pen text-body cursor-pointer ms-3"></i>
                    </label>
                    <input class="d-none" id="inputImagenArtista${artist.id}" type="file" accept=".jpg, .jpeg, .png" onchange="actuallizarImagenArtista(this,'${artist.id}')">
                </th>
                <th>
                    <input class="form-control text-body input-style text-center size-input-button bg-transparent border border-0 nombre-artista" type="text" value="${artist.name}" placeholder="Nombre" autocomplete="off" onchange="actualizarArtista('${artist.id}',this.value,'name')">
                </th>
                <th class="pt-3">
                    <input class="form-check-input" type="checkbox" checked onchange="actualizarArtista('${artist.id}',this.checked,'visible')">
                </th>
                <th class="pt-3">
                    <i class="fa-solid fa-trash text-danger cursor-pointer" onclick="mostrarModalEliminarArtista('${artist.id}','${artist.name}')"></i>
                </th>
            </tr>`;
            $('#tbodyArtistas').append(html);
            limpiarModalArtista();
            showToastify('Artísta agregado correctamente.', '#4caf50');
            renderLightbox('.clase-' + timestamp);
        } else {
            showToastify(axiosPeticion.error);
        }
        btn.html('AGREGAR').prop('disabled', false);
    }
}

const actualizarArtista = async (idArtists, value, field) => {
    const data = {
        idArtists,
        value,
        field
    };
    const axiosPeticion = await peticionAxios('PUT', '/artists/super-admin/update', data);
    if(axiosPeticion.code === 200) {
        showToastify('Artísta actualizado correctamente.', '#4caf50');
    } else {
        showToastify(axiosPeticion.error);
    }
}

const mostrarModalEliminarArtista = (idArtists, name) => {
    $('#tituloEliminar').html(`¿Estas seguro de que quieres eliminar el artísta ${name}?`,);
    $('#btnEliminarModal').attr('onclick','eliminarArtista("'+idArtists+'")');
    $('#modalConfirmarEliminar').modal('show');
}

const eliminarArtista = async (idArtists) => {
    eliminarRow(idArtists);
    const data = {
        idArtists
    };
    const axiosPeticion = await peticionAxios('DELETE', '/artists/super-admin/delete', data);
    if(axiosPeticion.code === 200) {
        showToastify('Artísta eliminado correctamente.', '#4caf50');
    } else {
        showToastify(axiosPeticion.error);
    }
}

const actuallizarImagenArtista = async (elemento, idArtists) => {
    if(pesoArchivoCorrecto(elemento.files[0].size, 1000000)) {
        previewImage(elemento, `imagenArtista${idArtists}`);
        let formData = new FormData();
        formData.append('image', elemento.files[0]);
        formData.append('idArtists', idArtists);
        const axiosPeticion = await peticionAxios('PUT', '/artists/super-admin/update-image', formData, true);
        if(axiosPeticion.code === 200) {
            $(`#lightboxImagenArtista${idArtists}`).attr('href', axiosPeticion.url);
        } else {
            showToastify(axiosPeticion.error);
        }
    }
}

const filtrarArtistas = (palabra) => {
    let valueInput = palabra.toLowerCase();
    const valueTodos = document.querySelectorAll('.nombre-artista');
    valueTodos.forEach(artistas => {
        const txtValue = artistas.value.toLowerCase();
        if(txtValue.indexOf(valueInput) > -1){
            artistas.parentElement.parentElement.classList.remove('d-none');
        } else {
            artistas.parentElement.parentElement.classList.add('d-none');
        }
    });
}

const habilitarSortableArtistas = () => {
    const elementos = document.getElementById('tbodyArtistas');
    Sortable.create(elementos, {
        animation: 150,
        handle: '.handle-artistas',
        onEnd: (newOrder) => actualizarOrdenArtistas(newOrder.to)
    });
}

const actualizarOrdenArtistas = async (elementos) => {
    let arregloArtistas = [];
    for(let index = 0; index < elementos.children.length; index++) {
        const valueFor = elementos.children[index];
        arregloArtistas.push({
            idArtists: valueFor.id,
            order: index + 1
        });
    }
    const data = { array: arregloArtistas };
    const axiosPeticion = await peticionAxios('PUT', '/artists/super-admin/update-order', data);
    if(axiosPeticion.code !== 200) showToastify(axiosPeticion.error);
}

/////////////////////////////////
////////// MULTIMEDIA ///////////
/////////////////////////////////
const limpiarModalMultimedia = () => {
    $('#modalAgregarMultimedia').modal('hide');
    $('#imagenVideoMultimedia').val('');
    $('#inputImagenVideoMultimedia').val('');
}

const agregarMultimedia = async () => {
    let imagen = document.getElementById('imagenVideoMultimedia').files[0];
    if(tieneDatos(imagen, 'La imagen')) {
        let btn = $('#btnAgregarMultimedia');
        btn.html('<span class="spinner-border" role="status" aria-hidden="true"></span>').prop('disabled', true);
        let formData = new FormData();
        formData.append('image', imagen);
        const axiosPeticion = await peticionAxios('POST', '/multimedia/super-admin/add', formData, true);
        if(axiosPeticion.code === 200) {
            const { multimedia } = axiosPeticion;
            const timestamp = Date.now();
            const html = `<div class="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3 col-xxl-3 mb-3" id="${multimedia.id}">
                <div class="card border-0 text-center">
                    <a class="clase-${timestamp}" href="${multimedia.image}">
                        <img class="card-img-top cursor-pointer" src="${multimedia.image}">
                    </a>
                    <div class="card-body">
                        <i class="fa-solid fa-trash text-danger cursor-pointer" onclick="mostrarModalEliminarMultimedia('${multimedia.id}')"></i>
                    </div>
                </div>
            </div>`;
            $('#divContenidoMultimedia').prepend(html);
            limpiarModalMultimedia();
            showToastify('Imagen agregada correctamente.', '#4caf50');
            renderLightbox('.clase-' + timestamp);
        } else {
            showToastify(axiosPeticion.error);
        }
        btn.html('AGREGAR').prop('disabled', false);
    }
}

const mostrarModalEliminarMultimedia = (idMultimedia) => {
    $('#tituloEliminar').html(`¿Estas seguro de que quieres eliminar la imagen?`,);
    $('#btnEliminarModal').attr('onclick','eliminarMultimedia("'+idMultimedia+'")');
    $('#modalConfirmarEliminar').modal('show');
}

const eliminarMultimedia = async (idMultimedia) => {
    eliminarRow(idMultimedia);
    const data = {
        idMultimedia
    };
    const axiosPeticion = await peticionAxios('DELETE', '/multimedia/super-admin/delete', data);
    if(axiosPeticion.code === 200) {
        showToastify('Imagen eliminada correctamente.', '#4caf50');
    } else {
        showToastify(axiosPeticion.error);
    }
}