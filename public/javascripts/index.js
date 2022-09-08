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
        let btn = $('#btnOlvidePass');
        btn.html('<span class="spinner-border text-primary" role="status" aria-hidden="true"></span>').prop('disabled', true);
        const data = {
            email
        }
        const axiosPeticion = await peticionAxios('POST', '/users/super-admin/forgot-password', data);
        if(axiosPeticion.code === 200) {
            showToastify('Revisa tu correo y da click en el enlace para poder actualizar tu contraseña.', '#4caf50');
            cambiarVentana('iniciar');
        } else {
            showToastify(axiosPeticion.error);
        }
        btn.html('Enviar correo').prop('disabled', false);
    }
}

const iniciarSesion = async () => {
    let email = $('#correoLogin').val().trim();
    let password = $('#passLogin').val();
    if(tieneDatos(email, 'El correo') && esCorreo(email, 'El correo') && tieneDatos(password, 'La contraseña')) {
        let btn = $('#btnIniciarSesion');
        btn.html('<span class="spinner-border text-primary" role="status" aria-hidden="true"></span>').prop('disabled', true);
        const data = {
            email,
            password
        }
        const axiosPeticion = await peticionAxios('POST', '/super-admin/login', data);
        if(axiosPeticion.code === 200) {
            localStorage.setItem('tokenMonica', axiosPeticion.token);
            location.href = '/dashboard-super-admin#generales';
        } else {
            showToastify(axiosPeticion.error);
        }
        btn.html('Iniciar Sesión').prop('disabled', false);
    }
}

const actualizarContrasena = async () => {
    let password = $('#nuevaContrasena').val().trim();
    if(tieneDatos(password, 'La nueva contraseña')) {
        let btn = $('#btnActualizarPass');
        btn.html('<span class="spinner-border text-primary" role="status" aria-hidden="true"></span>').prop('disabled', true);
        const urlParams = new URLSearchParams(location.search);
        const token = urlParams.get('token');
        const data = {
            password,
            token
        }
        const axiosPeticion = await peticionAxios('PUT', '/users/super-admin/update-password', data);
        if(axiosPeticion.code === 200) {
            localStorage.setItem('tokenMonica', axiosPeticion.token);
            location.href = '/dashboard-super-admin#generales';
        } else {
            showToastify(axiosPeticion.error);
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