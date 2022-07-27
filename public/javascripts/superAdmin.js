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
        showSwalLoading();
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
                    <i class="fa-solid fa-trash text-danger cursor-pointer" onclick="eliminarArtista('${artist.id}','${artist.name}')"></i>
                </th>
            </tr>`;
            $('#tbodyArtistas').append(html);
            limpiarModalArtista();
            showSwalSuccess('Artísta agregado correctamente.');
            renderLightbox('.clase-' + timestamp);
        } else {
            showSwalError(axiosPeticion.error);
        }
    }
}

const actualizarArtista = async (idArtists, value, field) => {
    const data = { idArtists, value, field };
    const axiosPeticion = await peticionAxios('PUT', '/artists/super-admin/update', data);
    if(axiosPeticion.code !== 200) showSwalError(axiosPeticion.error);
}

const eliminarArtista = async (idArtists, name) => {
    Swal.fire({
        text: `¿Estas seguro de que quieres eliminar el artísta ${name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#000',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false
    }).then(async (result) => {
        if(result.isConfirmed) {
            showSwalLoading();
            const data = { idArtists };
            const axiosPeticion = await peticionAxios('DELETE', '/artists/super-admin/delete', data);
            if(axiosPeticion.code === 200) {
                eliminarRow(idArtists);
                showSwalSuccess('Artísta eliminado correctamente.');
            } else {
                showSwalError(axiosPeticion.error);
            }
        }
    });
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
            showSwalError(axiosPeticion.error);
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
    if(axiosPeticion.code !== 200) showSwalError(axiosPeticion.error);
}