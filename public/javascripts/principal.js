window.addEventListener('DOMContentLoaded', (event) => {
    renderLightbox('.lightbox-toggle-multimedia');
    peticionAxios('POST', '/visits/user/add', {});
});

const enviarContacto = async () => {
    let nombre = $('#nombreCotizacion').val().trim();
    let correo = $('#correoCotizacion').val().trim();
    let telefono = $('#telefonoCotizacion').val().trim();
    let descripcion = $('#descripcionCotizacion').val().trim();
    if(tieneDatos(nombre, 'El nombre completo') && tieneDatos(correo, 'El correo')
    && esCorreo(correo, 'El correo') && tieneDatos(telefono, 'El teléfono')
    && esNumerico(telefono, 'El teléfono') && tieneLogitudNecesaria(telefono, 'El teléfono', 10)
    && tieneDatos(descripcion, 'La descripción')) {
        let btn = $('#btnEnviarContacto');
        btn.html('<span class="spinner-border" role="status" aria-hidden="true"></span>').prop('disabled', true);
        const axiosPeticion = await peticionAxios('POST', '/multimedia/super-admin/add', formData, true);
        if(axiosPeticion.code === 200) {
            $('#nombreCotizacion').val('');
            $('#correoCotizacion').val('');
            $('#telefonoCotizacion').val('');
            $('#descripcionCotizacion').val('');
            showToastify('Recibirás un email para dar seguimiento a tu petición de evento.', '#4caf50');
        } else {
            showToastify(axiosPeticion.error);
        }
        btn.html('Enviar').prop('disabled', false);
    }
}