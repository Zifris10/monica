const tieneDatos = (value, nombreCampo) => {
    let validar = true;
    if(value === undefined || value === null || value === '') {
        showToastify(`${nombreCampo} está vacío.`);
        validar = false;
    }
    return validar
}

const esNumerico = (value, nombreCampo) => {
    let validar = true;
    if(isNaN(value)) {
        showToastify(`${nombreCampo} solo acepta números.`);
        validar = false;
    }
    return validar
}

const tieneLogitudNecesaria = (value, nombreCampo, longitud) => {
    let validar = true;
    if(value.length != longitud) {
        showToastify(`${nombreCampo} debe tener solo ${longitud} números.`);
        validar = false;
    }
    return validar
}

const esCorreo = (value, nombreCampo) => {
    let validar = true;
    let filter = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!filter.test(value)) {
        showToastify(`${nombreCampo} no tiene un formato de tipo correo válido.`);
        validar = false;
    }
    return validar
}

const pesoArchivoCorrecto = (size, peso) => {
    let validar = true;
    if(size > peso) {
        showToastify('El archivo seleccionado sobrepasa el límite de peso permitido.');
        validar = false;
    }
    return validar
}

const showToastify = (text, background = '#E92D22') => {
    Toastify({
        text,
        duration: 5000,
        style: {
            background
        }
    }).showToast();
}

const showSwalSuccess = (text) => {
    Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'ÉXITO',
        text,
        showConfirmButton: false,
        timer: 5000
    });
}

const showSwalLoading = () => {
    Swal.fire({
        title: 'CARGANDO',
        text: 'Espera un momento por favor.',
        allowEscapeKey: false,
        allowOutsideClick: false,
        allowEnterKey: false,
        showConfirmButton: false
    });
}

const dismissSwal = () => {
    Swal.close();
}

const peticionAxios = async (method, url, data, esArchivo = false) => {
    try {
        let objeto = {
            method,
            url,
            headers: {
                'Authorization': localStorage.getItem('tokenMonica'),
                'content-type': 'multipart/form-data'
            },
            data
        }
        if(esArchivo === false) delete objeto.headers['content-type'];
        let peticion = await axios(objeto);
        return peticion.data;
    } catch (error) {
        return error.response.data;
    }
}

const eliminarRow = (idElemento) => {
    $(`#${idElemento}`).remove();
}

const previewImage = (elemento, id) => {
    let reader = new FileReader();
    reader.onload = function(e) {
        document.getElementById(id).src = e.target.result;
    }
    reader.readAsDataURL(elemento.files[0]);
}

const setNombreArchivoInput = (elemento, idInput) => {
    $(`#${idInput}`).val(elemento.files[0].name);
}

const renderLightbox = (clase) => {
    document.querySelectorAll(clase).forEach((el) => el.addEventListener('click', (e) => {
        e.preventDefault();
        const lightbox = new Lightbox(el);
        lightbox.show();
    }));
}