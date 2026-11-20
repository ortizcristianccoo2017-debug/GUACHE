
/* GUACHE - Funciones principales */

// PANEL DE ADMINISTRACIÓN
const adminBtn = document.getElementById("adminBtn");
const adminPanel = document.getElementById("adminPanel");


const loginPanel = document.getElementById("loginPanel");
const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

let sesionIniciada = false;

adminBtn.addEventListener("click", () => {
    if (sesionIniciada) {
        adminPanel.hidden = false;
        loginPanel.hidden = true;
        adminPanel.scrollIntoView({ behavior: "smooth" });
    } else {
        loginPanel.hidden = false;
        adminPanel.hidden = true;
        loginPanel.scrollIntoView({ behavior: "smooth" });
    }
});

loginForm.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const usuario = document.getElementById("loginUser").value;
    const clave = document.getElementById("loginPassword").value;

    if (usuario === "guache" && clave === "demo2026") {
        sesionIniciada = true;
        loginPanel.hidden = true;
        adminPanel.hidden = false;
        loginMessage.textContent = "";
        loginForm.reset();
        adminPanel.scrollIntoView({ behavior: "smooth" });
    } else {
        loginMessage.textContent = "Usuario o contraseña incorrectos.";
    }
});


// ADMINISTRAR ARTÍCULOS
const articleForm = document.getElementById("articleForm");
const articleGrid = document.querySelector(".article-grid");

let articulos = JSON.parse(
    localStorage.getItem("guacheArticulos") || "[]"
);

function mostrarArticulos() {
    document.querySelectorAll(".nuevo-articulo").forEach(
        articulo => articulo.remove()
    );

    articulos.forEach((articulo, indice) => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "article-card nuevo-articulo";

        const imagen = document.createElement("div");
        imagen.className = "article-image";
        imagen.textContent = "🇨🇴";

        const info = document.createElement("div");
        info.className = "article-info";

        const categoria = document.createElement("span");
        categoria.textContent = articulo.categoria;

        const titulo = document.createElement("h3");
        titulo.textContent = articulo.titulo;

        const descripcion = document.createElement("p");
        descripcion.textContent = articulo.descripcion;

        const eliminar = document.createElement("button");
        eliminar.textContent = "Eliminar artículo";
        eliminar.addEventListener("click", () => {
            articulos.splice(indice, 1);
            guardarArticulos();
        });

        info.append(categoria, titulo, descripcion, eliminar);
        tarjeta.append(imagen, info);
        articleGrid.appendChild(tarjeta);
    });
}

function guardarArticulos() {
    localStorage.setItem(
        "guacheArticulos",
        JSON.stringify(articulos)
    );
    mostrarArticulos();
}

articleForm.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const titulo = document.getElementById("articleTitle").value;
    const categoria = document.getElementById("articleCategory").value;
    const descripcion = document.getElementById("articleDescription").value;

    articulos.push({ titulo, categoria, descripcion });
    guardarArticulos();
    articleForm.reset();

    alert("¡Artículo agregado correctamente!");
});

mostrarArticulos();

// ASISTENTE INFORMATIVO
const askBtn = document.getElementById("askBtn");
const aiQuestion = document.getElementById("aiQuestion");
const aiAnswer = document.getElementById("aiAnswer");


async function responderPregunta() {
    const pregunta = aiQuestion.value.trim();

    if (!pregunta) {
        aiAnswer.textContent = "Escribe una pregunta sobre Colombia.";
        return;
    }

    aiAnswer.textContent = "GUACHE está pensando... 🤖";

    try {
        
const respuesta = await fetch(
    "https://guache-ia.ortizcristianccoo2017.workers.dev/",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ pregunta: pregunta })
    }
);
        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.error || "Error del servidor");
        }

        aiAnswer.textContent = datos.respuesta;

    } catch (error) {
        aiAnswer.textContent =
            "No pude conectarme con la inteligencia artificial. Intenta nuevamente.";
        console.error(error);
    }
}


askBtn.addEventListener("click", responderPregunta);

aiQuestion.addEventListener("keydown", (evento) => {
    if (evento.key === "Enter") {
        responderPregunta();
    }
});


/* FORMULARIO DE CONTACTO */

const contactForm = document.getElementById("contactForm");
const contactMessage = document.getElementById("contactMessage");

const camposContacto = contactForm.querySelectorAll("input");
const mensajeContacto = contactForm.querySelector("textarea");

function obtenerMensajes() {
    return JSON.parse(
        localStorage.getItem("guacheMensajes") || "[]"
    );
}

function mostrarMensajes() {
    let contenedor = document.getElementById("listaMensajes");

    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "listaMensajes";
        adminPanel.appendChild(contenedor);
    }

    contenedor.replaceChildren();

    const encabezado = document.createElement("h3");
    encabezado.textContent = "Mensajes recibidos";
    contenedor.appendChild(encabezado);

    const mensajes = obtenerMensajes();

    if (mensajes.length === 0) {
        const aviso = document.createElement("p");
        aviso.textContent = "Todavía no hay mensajes.";
        contenedor.appendChild(aviso);
        return;
    }

    mensajes.forEach((mensaje) => {
        const tarjeta = document.createElement("div");
        tarjeta.className = "article-card";
        tarjeta.style.padding = "20px";
        tarjeta.style.margin = "15px auto";
        tarjeta.style.maxWidth = "550px";

        const nombre = document.createElement("h4");
        nombre.textContent = mensaje.nombre;

        const correo = document.createElement("p");
        correo.textContent = mensaje.correo;

        const contenido = document.createElement("p");
        contenido.textContent = mensaje.contenido;

        tarjeta.append(nombre, correo, contenido);
        contenedor.appendChild(tarjeta);
    });
}

contactForm.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nuevoMensaje = {
        nombre: camposContacto[0].value.trim(),
        correo: camposContacto[1].value.trim(),
        contenido: mensajeContacto.value.trim()
    };

    const mensajes = obtenerMensajes();
    mensajes.push(nuevoMensaje);

    localStorage.setItem(
        "guacheMensajes",
        JSON.stringify(mensajes)
    );

    contactMessage.textContent =
        "¡Tu mensaje fue registrado correctamente!";

    contactForm.reset();
    mostrarMensajes();
});

mostrarMensajes();

