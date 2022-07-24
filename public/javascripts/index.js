window.addEventListener('DOMContentLoaded', (event) => {
    let pathUrl = location.pathname;
    if(pathUrl === '/auth-super-admin') cambiarVentana('iniciar');
});

let ventanaAbierta = 'iniciarSesion';
const cambiarVentana = (ventana) => {
    let divIniciarSesion = $('#divIniciarSesion');
    let divOlvidePass = $('#divOlvidePass');
    if(ventana === 'olvide') {
        ventanaAbierta = 'olvidePass';
        divIniciarSesion.fadeOut(500, () => {
            divOlvidePass.fadeIn(500);
        });
    } else {
        ventanaAbierta = 'iniciarSesion';
        divOlvidePass.fadeOut(500, () => {
            divIniciarSesion.fadeIn(500);
        });
    }
}

const olvideContrasena = async () => {
    let email = $('#correoOlvidePass').val().trim();
    if(tieneDatos(email, 'El correo') && esCorreo(email, 'El correo')) {
        showSwalLoading();
        let data = {
            email
        }
        let axiosPeticion = await peticionAxios('POST', '/users/super-admin/forgot-password', data);
        if(axiosPeticion.code === 200) {
            showSwalSuccess('Revisa tu correo y da click en el enlace para poder actualizar tu contraseña.');
            cambiarVentana('iniciar');
        } else {
            showSwalError(axiosPeticion.error);
        }
    }
}

const iniciarSesion = async () => {
    let email = $('#correoLogin').val().trim();
    let password = $('#passLogin').val();
    if(tieneDatos(email, 'El correo') && esCorreo(email, 'El correo') && tieneDatos(password, 'La contraseña')) {
        showSwalLoading();
        let data = {
            email,
            password
        }
        let axiosPeticion = await peticionAxios('POST', '/super-admin/login', data);
        if(axiosPeticion.code === 200) {
            localStorage.setItem('tokenMonica', axiosPeticion.token);
            location.href = '/dashboard-super-admin#generales';
        } else {
            showSwalError(axiosPeticion.error);
        }
    }
}

const actualizarContrasena = async () => {
    let password = $('#nuevaContrasena').val().trim();
    if(tieneDatos(password, 'La nueva contraseña')) {
        showSwalLoading();
        let queryString = location.search;
        let urlParams = new URLSearchParams(queryString);
        let token = urlParams.get('token');
        let data = {
            password,
            token
        }
        let axiosPeticion = await peticionAxios('PUT', '/users/super-admin/update-password', data);
        if(axiosPeticion.code === 200) {
            localStorage.setItem('tokenMonica', axiosPeticion.token);
            location.href = '/dashboard-super-admin#generales';
        } else {
            showSwalError(axiosPeticion.error);
        }
    }
}

$(document).keypress(event => {
    let keycode = (event.keyCode ? event.keyCode : event.which);
    if(keycode == '13') {
        let pathUrl = location.pathname;
        if(pathUrl === '/auth-super-admin') {
            if(ventanaAbierta === 'iniciarSesion') {
                iniciarSesion();
            } else {
                olvideContrasena();
            }
        } else {
            actualizarContrasena();
        }
    }
});