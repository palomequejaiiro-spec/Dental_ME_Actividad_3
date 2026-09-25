/* ==========================================================
   Dental M&E - Interactividad con JavaScript
   1) Validación del formulario de solicitud de cita (index.html)
   2) Filtro de servicios por categoría (servicios.html)
   ========================================================== */

/* ---------- 1. Validación del formulario de contacto ---------- */
const formulario = document.querySelector(".contact-form");

if (formulario) {
    const campoNombre = document.querySelector("#nombre");
    const campoEmail = document.querySelector("#email");
    const campoFecha = document.querySelector("#fecha");
    const campoServicio = document.querySelector("#servicio");
    const campoMensaje = document.querySelector("#mensaje");
    const mensajeFormulario = document.querySelector("#form-message");
    const contadorMensaje = document.querySelector("#contador-mensaje");
    const MAX_MENSAJE = 500;

    // Muestra u oculta el error de un campo
    function mostrarError(campo, texto) {
        const spanError = document.querySelector("#error-" + campo.id);
        spanError.textContent = texto;
        campo.classList.toggle("input-error", texto !== "");
    }

    // Fecha de hoy en formato AAAA-MM-DD (hora local) para usarla como mínimo
    function fechaHoy() {
        const hoy = new Date();
        const mes = String(hoy.getMonth() + 1).padStart(2, "0");
        const dia = String(hoy.getDate()).padStart(2, "0");
        return hoy.getFullYear() + "-" + mes + "-" + dia;
    }

    // El calendario no permite elegir días anteriores a hoy
    campoFecha.min = fechaHoy();

    // Cada función devuelve el texto del error, o "" si el campo es válido
    function validarNombre() {
        const valor = campoNombre.value.trim();
        if (valor === "") return "Escribe tu nombre completo.";
        if (valor.length < 3) return "El nombre debe tener al menos 3 caracteres.";
        return "";
    }

    function validarEmail() {
        const valor = campoEmail.value.trim();
        const formatoCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
        if (valor === "") return "Escribe tu correo electrónico.";
        if (!formatoCorreo.test(valor)) return "Ingresa un correo válido (ej. nombre@correo.com).";
        return "";
    }

    function validarFecha() {
        const valor = campoFecha.value;
        if (valor === "") return "Selecciona la fecha en la que te gustaría la cita.";
        if (valor < fechaHoy()) return "La fecha no puede ser anterior a hoy.";
        return "";
    }

    function validarServicio() {
        if (campoServicio.value === "") return "Selecciona el tipo de servicio.";
        return "";
    }

    function validarMensaje() {
        const valor = campoMensaje.value.trim();
        if (valor === "") return "Escribe tu mensaje.";
        if (valor.length < 10) return "El mensaje debe tener al menos 10 caracteres.";
        return "";
    }

    // Contador de caracteres en tiempo real
    function actualizarContador() {
        const usados = campoMensaje.value.length;
        contadorMensaje.textContent = usados + " / " + MAX_MENSAJE;
        contadorMensaje.classList.toggle("char-count-limit", usados >= MAX_MENSAJE);
    }

    // Validación en vivo: al salir de un campo (blur) y mientras se escribe
    campoNombre.addEventListener("blur", () => mostrarError(campoNombre, validarNombre()));
    campoEmail.addEventListener("blur", () => mostrarError(campoEmail, validarEmail()));
    campoFecha.addEventListener("blur", () => mostrarError(campoFecha, validarFecha()));
    campoServicio.addEventListener("blur", () => mostrarError(campoServicio, validarServicio()));
    campoMensaje.addEventListener("blur", () => mostrarError(campoMensaje, validarMensaje()));
    campoMensaje.addEventListener("input", actualizarContador);

    // Una vez marcado un error, se revisa de nuevo mientras el usuario corrige
    const campos = [campoNombre, campoEmail, campoFecha, campoServicio, campoMensaje];
    const validadores = {
        nombre: validarNombre,
        email: validarEmail,
        fecha: validarFecha,
        servicio: validarServicio,
        mensaje: validarMensaje
    };

    campos.forEach((campo) => {
        const evento = campo.tagName === "SELECT" || campo.type === "date" ? "change" : "input";
        campo.addEventListener(evento, () => {
            if (campo.classList.contains("input-error")) {
                mostrarError(campo, validadores[campo.id]());
            }
        });
    });

    // Envío del formulario
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();

        const errorNombre = validarNombre();
        const errorEmail = validarEmail();
        const errorFecha = validarFecha();
        const errorServicio = validarServicio();
        const errorMensaje = validarMensaje();

        mostrarError(campoNombre, errorNombre);
        mostrarError(campoEmail, errorEmail);
        mostrarError(campoFecha, errorFecha);
        mostrarError(campoServicio, errorServicio);
        mostrarError(campoMensaje, errorMensaje);

        if (errorNombre || errorEmail || errorFecha || errorServicio || errorMensaje) {
            mensajeFormulario.textContent = "Revisa los campos marcados antes de enviar.";
            mensajeFormulario.className = "form-message form-message-error";
            // Lleva el foco al primer campo con error
            campos.find((c) => c.classList.contains("input-error")).focus();
            return;
        }

        const primerNombre = campoNombre.value.trim().split(" ")[0];
        const partes = campoFecha.value.split("-");
        const fechaLegible = partes[2] + "/" + partes[1] + "/" + partes[0];
        mensajeFormulario.textContent =
            "¡Gracias, " + primerNombre + "! Recibimos tu solicitud de " +
            campoServicio.value + " para el " + fechaLegible + ".";
        mensajeFormulario.className = "form-message form-message-ok";

        formulario.reset();
        actualizarContador();
    });
}

/* ---------- 2. Filtro de servicios por categoría ---------- */
const botonesFiltro = document.querySelectorAll(".filter-btn");
const tarjetasServicio = document.querySelectorAll("#lista-servicios .service-card");
const contadorServicios = document.querySelector("#contador-servicios");

if (botonesFiltro.length > 0) {
    function filtrarServicios(categoria) {
        let visibles = 0;

        tarjetasServicio.forEach((tarjeta) => {
            const coincide = categoria === "todos" || tarjeta.dataset.categoria === categoria;
            tarjeta.hidden = !coincide;
            if (coincide) visibles++;
        });

        contadorServicios.textContent =
            "Mostrando " + visibles + " de " + tarjetasServicio.length + " servicios";
    }

    botonesFiltro.forEach((boton) => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach((b) => b.classList.remove("active"));
            boton.classList.add("active");
            filtrarServicios(boton.dataset.filtro);
        });
    });

    filtrarServicios("todos");
}
