let userY;
let perfil;
let app = {};
const INTERVALO_MS = 30_000;
let contadorAnterior = 0;
let contadorAsig = 0;

document.addEventListener("DOMContentLoaded", function () {
    // Inicio de Pagina
    userY = sessionStorage.getItem("userY");
    perfil = sessionStorage.getItem("perfil");

    if (!userY && !perfil && perfil !== "asesor" && perfil !== "admin" && document.body.id !== "index") {
        console.log("fuera de aqui")
        window.location.href = "index.html";
        return;
    }

    inicioVariables();

    if (document.body.id !== "index") {
        generateHeader(perfil);
    }

    switch (document.body.id) {
        case "index":
            paginaIndex();
            break;

        case 'agotados':
            paginaAgotados();
            break;

        /*case 'gestion':
            paginaGestion();
            break;*/
    }

    app.btlogout = document.getElementById("btlogout");

    if (app.btlogout) {                 // ← solo si el botón está presente
        app.btlogout.addEventListener("click", ev => {
            ev.preventDefault();
            sessionStorage.removeItem("userY");
            sessionStorage.removeItem("id");
            window.location.href = "./index.html";
        });
    }
})

function inicioVariables() {
    // General
    app.header = document.getElementById("headerContainer");
    app.main = document.getElementById("main");
    app.panel = document.getElementById("panel");

    //login
    app.usuario = document.getElementById("usuario");
    app.password = document.getElementById("password");
    app.botonlog = document.getElementById("botonlog");

    //agotados
    //app. = document.getElementById("");

    app.item = document.getElementById("item");
    app.botonbus = document.getElementById("botonbus");
    app.inlistado = document.getElementById("inlistado");
    app.listado = document.getElementById("listado");

    app.form = document.getElementById("form-form")
    app.inboton = document.getElementById("inboton")
    app.iditem = document.getElementById("iditem");
    app.referencia = document.getElementById("referencia");
    app.descripcion = document.getElementById("descripcion");
    app.modelo = document.getElementById("modelo");
    app.marca = document.getElementById("marca");
    app.opcion = document.getElementsByTagName("option");
    app.tipo = document.getElementById("tipo");
    app.motivo = document.getElementById("motivo");
    app.obs = document.getElementById("obs");

    app.botonenviar = document.getElementById("botonenviar");
    app.botonlimp = document.getElementById("botonlimp");

    //gestion
    app.filtroFecha = document.getElementById("filtroFecha");
    app.filtroEstado = document.getElementById("filtroEstado");
    app.filtroAsesor = document.getElementById("filtroAsesor");
    app.filtroMotivo = document.getElementById("filtroMotivo");
    app.filtroTipo = document.getElementById("filtroTipo");
    app.filtroGestion = document.getElementById("filtroGestion");
    app.filgestion = document.getElementById("filgestion");
    app.botonenvio = document.getElementById("botonenvio");
    app.botonactu = document.getElementById("botonactu");
    app.botonclear = document.getElementById("botonclear");
    app.tablaA = document.getElementById("tablaA");
}

function paginaIndex() {
    login();
}

function paginaAgotados() {
    poblarSelect(app.tipo, "tipo", "Selecction tipo de solicitud", true, "", true, null);
    poblarSelect(app.motivo, "motivo", "Selecction un motivo", true, "", true, null);
    estados();
}

/* ************************************* estilos ***************************************** */
// funcion estilo
function estilo(elements, prop, value) {
    elements.forEach(elItem => {
        let el = typeof elItem === "string" ? app[elItem] : elItem;
        if (!el) return;
        if (prop in el.style) {
            el.style[prop] = value;
        } else if (prop === "disabled" || prop === "readOnly") {
            el[prop] = value === "true";
        } else if (prop in el) {
            el[prop] = value;
        }
    });
}

// deshabilitar por ID
function disableFieldsByIds(ids) {
    var elements = ids.map(function (id) {
        return document.getElementById(id);
    }).filter(function (el) { return el !== null; });
    estilo(elements, "disabled", "true");
}

// habilitar por ID
function enableFieldsByIds(ids) {
    var elements = ids.map(function (id) {
        return document.getElementById(id);
    }).filter(function (el) { return el !== null; });
    estilo(elements, "disabled", "false");
}

// funcion de estados asesor
function estados(estado = null, dato = null) {
    switch (estado) {
        case "Existe":
            estilo(["inlistado", "form", "inboton", "botonenviar"], "display", "block");
            estilo(["form", "inboton"], "display", "flex");
            disableFieldsByIds(["item", "botonbus",
                "listado",
                "iditem", "referencia",
                "descripcion",
                "modelo", "marca"]);
            enableFieldsByIds(["tipo", "motivo",
                "obs",
                "botonenviar", "botonlimp"]);
            break;

        case "Select":
            estilo(["inlistado", "botonenviar"], "display", "block");
            estilo(["form", "inboton"], "display", "flex");
            disableFieldsByIds(["item", "botonbus",
                "iditem", "referencia",
                "descripcion",
                "modelo", "marca"]);
            enableFieldsByIds(["listado",
                "tipo", "motivo",
                "obs",
                "botonenviar", "botonlimp"]);
            break;

        case "No Existe":
            estilo(["form", "inboton"], "display", "flex");
            estilo(["botonenviar"], "display", "block");
            estilo(["inlistado"], "display", "none");
            disableFieldsByIds(["item", "botonbus", "listado", "iditem"]);
            estilo(["iditem", "value", ""]);
            enableFieldsByIds(["referencia",
                "descripcion",
                "modelo", "marca",
                "tipo", "motivo",
                "obs",
                "botonenviar", "botonlimp"]);
            break;

        case "Esperar":
            estilo(["form",], "display", "none");
            estilo(["inlistado", "inboton"], "display", "block");
            estilo(["inboton"], "display", "flex");
            disableFieldsByIds(["item", "botonbus",
                "iditem", "referencia",
                "descripcion",
                "modelo", "marca"]);
            enableFieldsByIds(["listado",
                "tipo", "motivo",
                "obs",
                "botonenviar", "botonlimp"]);
            break;

        default:
            estilo(["inlistado", "form", "inboton", "botonenviar"], "display", "none");
            disableFieldsByIds(["listado",
                "iditem", "referencia",
                "descripcion",
                "modelo", "marca",
                "tipo", "motivo",
                "obs",
                "botonenviar", "botonlimp"]);
            enableFieldsByIds(["item", "botonbus"]);
            estilo(["item", "iditem", "referencia",
                "descripcion",
                "modelo", "marca",
                "obs"], "value", "");
            estilo(["listado", "tipo", "motivo"], "value", "0")
            break;
    }
}

/*
(["item","botonbuscar",
"inlistado"
"listado",
"form",
"iditem","referencia",
"descripcion",
"modelo","marca",
"tipo","motivo",
"obs",
"botonenviar","botonlimp"]);
*/

// funcion de alertas
function alertas(tipo, texto = null, icono = null, titulo = null) {
    switch (tipo) {
        case "Temporal":
            Swal.fire({
                position: "top-end",
                icon: icono,
                title: texto,
                showConfirmButton: false,
                customClass: {
                    popup: "my-custom-popup",
                    icon: "my-custom-icon-class"
                },
                timer: 1500,
            });
            break

        case "Boton":
            Swal.fire({
                title: titulo,
                text: texto,
                icon: icono
            });
            break
    }
}

// funcion de notificacion
function mostrarNotificacion(titulo, mensaje) {
    if (Notification.permission === "granted") {
        const noti = new Notification(titulo, {
            body: mensaje,
            icon: "./img/favicon.png"
        });
        noti.onclick = () => {
            window.focus();
            actualizarTablaPedidos();
        };
    } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then(perm => {
            if (perm === "granted") mostrarNotificacion(titulo, mensaje);
        });
    }
}

/* ************************************* general ***************************************** */
// Ejecutar al cargar
window.addEventListener("DOMContentLoaded", ajustarSeparacion);

// Ejecutar si se redimensiona la ventana
window.addEventListener("resize", ajustarSeparacion);

// funcion ajuste header
function ajustarSeparacion() {
    if (app.header && app.main) {
        const headerHeight = app.header.offsetHeight;
        const margen = headerHeight * 1.1;
        app.main.style.marginTop = margen + "px";
    }
}

// Generar Header
function generateHeader(perfil = null) {
    const storedUser = sessionStorage.getItem("userY") || "Invitado";

    const today = new Date();
    const day = ("0" + today.getDate()).slice(-2);
    const month = ("0" + (today.getMonth() + 1)).slice(-2);
    const year = today.getFullYear();
    const formattedDate = `${day}/${month}/${year}`;

    let menu = "";
    if (perfil === "admin") {
        menu = `
            <div class="dropdown me-3">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button"
                        id="menuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    ☰
                </button>
                <ul class="dropdown-menu" aria-labelledby="menuDropdown">
                    <li><a class="dropdown-item" href="../apitho/control.html">Modulo Control</a></li>
                    <li><a class="dropdown-item" href="../apitho/asesor.html">Modulo Asesor</a></li>
                    <li><a class="dropdown-item" href="../apitho/caja.html">Modulo Caja</a></li>
                    <li><a class="dropdown-item" href="../apitho/mensajero.html">Modulo Mensajero</a></li>
                    <li><a class="dropdown-item" href="../apitho/usuario.html">Modulo Usuarios</a></li>
                    <li><a class="dropdown-item" href="./gestion.html">Gestion Agotados</a></li>
                </ul>
            </div>`;
    }
    if (perfil === "asesor") {
        menu = `
            <div class="dropdown me-3">
                <button class="btn btn-outline-secondary btn-sm dropdown-toggle" type="button"
                        id="menuDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                    ☰
                </button>
                <ul class="dropdown-menu" aria-labelledby="menuDropdown">
                    <li><a class="dropdown-item" href="../apitho/asesor.html">Envios</a></li>
                </ul>
            </div>`;
    }

    const headerHTML = `
        <div class="container-fluid d-flex justify-content-between align-items-center">
            <div class="d-flex align-items-center">
                ${menu}
                <h6 class="mb-0">Usuario: ${storedUser}</h6>
            </div>
            <div class="d-flex align-items-center gap-3">
                <h6 class="mb-0">Fecha: ${formattedDate}</h6>
                <form id="logoutForm">
                    <button type="button" id="btlogout" class="btn btn-sm btn-danger">Salir</button>
                </form>
            </div>
        </div>
    `;

    if (app.header) {
        app.header.innerHTML = headerHTML;
    }

    $(document).on("click", 'a.dropdown-item[href="./index.html"]', function () {
        sessionStorage.removeItem("id");
    });
}

// ver pass
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleIcon = document.querySelector('#icopass i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleIcon.classList.remove('fa-eye');
        toggleIcon.classList.add('fa-eye-slash');
    } else {
        passwordInput.type = 'password';
        toggleIcon.classList.remove('fa-eye-slash');
        toggleIcon.classList.add('fa-eye');
    }
}

function llenarSelect(select, lista, titulo, reset = true, info = null, filtro = false, index = null) {
    let $sel;

    if (filtro) {
        $sel = $(select);
    } else {
        $sel = $(`#${select}${index}`);
    }

    if (reset) {
        $sel.empty().append(
            '<option value="" selected>' + titulo + '</option>'
        );
    }

    lista.forEach(u => {
        $sel.append(`<option value="${u.codigo}">${u.descrip}</option>`);
    });

    if (info !== null) {
        $sel.val(info);
    }
}

/*function poblarSelect(select, dato, titulo, reset = true, info = null, filtro = false, index = null) {
    $.ajax({
        url: "./php/rellenar_select.php",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ dato }),
        success(resp) {
            if (resp.estado === "exito" && Array.isArray(resp.datos)) {
                //llenarSelect(select, resp.datos, titulo, reset, info, filtro, index);
                llenarSelect(select, resp.datos, titulo, reset, info, filtro, index);
                // ——— AÑADE ESTO justo después de llenarSelect ———
                const el = (typeof select === 'string')
                ? document.getElementById(select)
                : select;      // si pasas directamente el elemento, no el id
                const ms = coreui.Multiselect.getInstance(el);
                if (ms) {
                    ms.refresh();
                } else {
                    // si aún no lo inicializaste
                    new coreui.Multiselect(el, {
                        search: true,
                        selectAllLabel: 'Seleccionar todo',
                        maxHeight: 200
                        });
                }
            } else {
                console.error("Error al traer " + dato + ":", resp.mensaje);
            }
        },
        error() {
            alertas("Boton", "Error de comunicación al traer " + dato, "error");
        }
    });
}*/

function poblarSelect(select, dato, titulo, reset = true, info = null, filtro = false, index = null) {
    $.ajax({
        url: "./php/rellenar_select.php",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ dato }),
        success(resp) {
            if (!(resp.estado === "exito" && Array.isArray(resp.datos))) {
                console.error("Error al traer " + dato + ":", resp.mensaje);
                return;
            }
            // 1) Llenamos opciones
            llenarSelect(select, resp.datos, titulo, reset, info, filtro, index);

            // 2) Descubrimos el elemento real
            const el = (typeof select === "string")
                ? document.getElementById(select.replace(/^#/, ""))
                : select;

            // 3) Solo si es multiselección CoreUI...
            if (el && el.multiple && el.classList.contains("form-multiselect")) {
                const ms = coreui.Multiselect.getInstance(el);
                if (ms) {
                    ms.refresh();
                } else {
                    new coreui.Multiselect(el, {
                        search: true,
                        selectAllLabel: "Seleccionar todo",
                        maxHeight: 200
                    });
                }
            }
        },
        error() {
            alertas("Boton", "Error de comunicación al traer " + dato, "error");
        }
    });
}


/* ************************************** inicio **************************************** */
// funcion de login
function login() {
    app.botonlog.addEventListener("click", function () {
        var login = {
            usuario: app.usuario.value.trim(),
            password: app.password.value.trim()
        }

        if (login.usuario === "" || login.password === "") {
            alertas("Temporal", "Todos los campos deben de estar llenos", "error");
            return;
        }

        $.ajax({
            url: "./php/inicio/login_usuario.php",
            type: "POST",
            data: JSON.stringify({ login }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.estado === "exito") {
                    if (response.mensaje === "si") {
                        sessionStorage.setItem("userY", response.usuario);
                        sessionStorage.setItem("perfil", response.perfil);
                        window.location.href = response.dirigir;
                    } else {
                        var cedula = response.cc;

                        Swal.fire({
                            title: 'Nueva contraseña',
                            html: `
                               <input id="pwd1" type="password" class="swal2-input" placeholder="Contraseña nueva">
                               <input id="pwd2" type="password" class="swal2-input" placeholder="Repetir contraseña">`,
                            confirmButtonText: 'Guardar',
                            focusConfirm: false,
                            preConfirm: () => {
                                const p1 = document.getElementById('pwd1').value.trim();
                                const p2 = document.getElementById('pwd2').value.trim();

                                /*if (p1.length < 6)
                                    return Swal.showValidationMessage('⛔ Mínimo 6 caracteres');*/

                                if (p1 !== p2)
                                    return Swal.showValidationMessage('⛔ Las contraseñas no coinciden');

                                return p1;                         // se envía al then()
                            },
                            allowOutsideClick: false,
                            allowEscapeKey: false
                        }).then(res => {
                            if (!res.isConfirmed) return;        // usuario canceló explícitamente

                            const nueva = res.value;

                            /* 3. Enviar al backend */
                            fetch('./php/inicio/cambiar_password.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ cc: cedula, password: nueva })
                            })
                                .then(r => r.json())
                                .then(obj => {
                                    if (obj.estado === 'exito') {
                                        Swal.fire('Listo', 'Contraseña actualizada. Vuelve a iniciar sesión.', 'success')
                                            .then(() => window.location.href = './index.html');
                                    } else {
                                        Swal.fire('Error', obj.mensaje ?? 'No se pudo actualizar', 'error');
                                    }
                                })
                                .catch(() => Swal.fire('Error', 'Comunicación con el servidor', 'error'));
                        });
                    }
                } else {
                    alertas("Boton", response.mensaje, "error");
                }
            },
            error: function (xhr, status, error) {
                console.error("Error en la solicitud:", status, error);
                alertas("Boton", "No se pudo conectar con el servidor", "error");
            }
        });
    });
}

/* ************************************** agotados **************************************** */
//funciones de botones agotados
document.addEventListener("DOMContentLoaded", function () {
    if (document.body.id === "agotados") {
        $(app.botonbus).click(function () {
            buscarItem();
        })

        $(app.listado).change(function () {
            buscarItem($(app.listado).find("option:selected").text().trim());
        })

        $(app.botonlimp).click(function () {
            estados();
        })

        $(app.botonenviar).click(function () {
            registrar();
        })

        $(app.motivo).change(function () {
            console.log(app.motivo.value);
            const datos = app.motivo.options[app.motivo.selectedIndex].text;
            console.log(datos);
        })
    }
})

function buscarItem(item = null) {
    var dato;
    var reset;
    var estad;

    if (item === null) {
        dato = app.item.value.trim();
        reset = true;
        estad = "Existe"
    } else {
        dato = item;
        reset = false;
        estad = "Select"
    }

    if (dato === "") {
        alertas("Boton", "Ingrese un codigo de Item o una descripcion", "error");
        return;
    }

    console.log(dato)

    if (dato === "0") {
        estados("No Existe");
    } else {
        $.ajax({
            url: "./php/agotados/buscar_item.php",
            type: "POST",
            data: JSON.stringify({ dato }),
            contentType: "application/json",
            dataType: "json",
            success: function (response) {
                if (response.estado === "exito") {
                    if (Array.isArray(response.datos) &&
                        response.datos.length > 0) {
                        let items = response.datos;

                        if (items.length === 1) {
                            estados(estad);
                            let info = items[0];
                            app.iditem.value = info.codigo;
                            app.referencia.value = info.referencia;
                            app.descripcion.value = info.descripcion;
                            app.modelo.value = info.modelo;
                            app.marca.value = info.mar;
                            llenarSelect(app.listado, items, "Seleccione un Item", reset, info.codigo, true, null);
                        } else {
                            estados("Esperar");
                            llenarSelect(app.listado, items, "Seleccione un Item", reset, null, true, null);
                        }
                    }
                } else {
                    alertas("Boton", response.mensaje, "error");
                }
            },
            error: function () {
                console.error("❌ Error al obtener los datos.");
                alertas("Boton", "Error de comunicación con el servidor", "error");
            }
        })
    }
}

function registrar() {
    const motivo = app.motivo.options[app.motivo.selectedIndex].text;
    const tipo = app.tipo.options[app.tipo.selectedIndex].text;
    var datos = {
        usuario: userY,
        item: app.iditem.value.trim(),
        referencia: app.referencia.value.trim(),
        descripcion: app.descripcion.value.trim(),
        modelo: app.modelo.value.trim(),
        marca: app.marca.value.trim(),
        motivo: motivo,
        obs: app.obs.value.trim(),
        tipo: tipo
    }

    const camposObligatorios =
        datos.referencia === "" ||
        datos.descripcion === "" ||
        datos.modelo === "" ||
        datos.marca === "" ||
        datos.obs === "" ||
        datos.motivo === "0" ||
        datos.tipo === "0";

    if (camposObligatorios) {
        alertas("Boton", "Todos los campos deben estar llenos", "error");
        return;
    }

    $.ajax({
        url: "./php/agotados/procesar_item.php",
        type: "POST",
        data: JSON.stringify({ datos }),
        contentType: "application/json",
        dataType: "json",
        success: function (response) {
            if (response.estado === "exito") {
                alertas("Temporal", "Se subio el agotado de manera satisfactorio", "success")
                estados();
            } else {
                alertas("Boton", response.mensaje || "No se pudo registrar el item", "error");
            }
        },
        error: function () {
            console.error("❌ Error al obtener los datos.");
            alertas("Boton", "Error de comunicación con el servidor", "error");
        }
    })
}

/* ************************************** gestion **************************************** */

document.addEventListener("DOMContentLoaded", function () {
    if (document.body.id === "gestion") {
        verificarNuevosAgotados(true);
        setInterval(verificarNuevosAgotados, INTERVALO_MS);
        setInterval(aplicarFiltros, INTERVALO_MS);

        //poblarFiltros();
        poblarSelect(app.filtroAsesor, "asesor", "Todos", true, null, true, null);
        poblarSelect(app.filtroMotivo, "motivo", "Todos", true, null, true, null);
        poblarSelect(app.filtroTipo, "tipo", "Todos", true, null, true, null);
        poblarSelect(app.filtroGestion, "cbges", "Todos", true, null, true, null);
        llenarSelect(app.filtroEstado, estadosllenar(true), "Solicitud", false, null, true);

        let hoy = new Date().toISOString().slice(0, 10);

        app.filtroFecha.value = hoy;

        cargarAgotados({
            fecha: hoy,
            asesor: "",
            motivo: "",
            tipo: "",
            estado: ""
        });

        $(app.botonclear).click(function () {
            cargarAgotados({
                fecha: hoy,
                asesor: "",
                motivo: "",
                tipo: "",
                estado: "Solicitud"
            }, false);

            app.filtroFecha.value = hoy;
            app.filtroAsesor.value = "";
            app.filtroMotivo.value = "";
            app.filtroTipo.value = "";
            app.filtroEstado.value = "Solicitud";
        })

        $(app.botonactu).click(function () {

            const ffecha = app.filtroFecha.value;
            const fasesor = app.filtroAsesor.value;
            const fmotivo = app.filtroMotivo.value;
            const ftipo = app.filtroTipo.value;
            const festado = app.filtroEstado.value;
            cargarAgotados({
                fecha: ffecha,
                asesor: fasesor,
                motivo: fmotivo,
                tipo: ftipo,
                estado: festado
            });
        })

        $(app.filtroFecha).on("change", () => aplicarFiltros());
        $(app.filtroEstado).on("change", () => aplicarFiltros());
        $(app.filtroAsesor).on("change", () => aplicarFiltros());
        $(app.filtroMotivo).on("change", () => aplicarFiltros());
        $(app.filtroTipo).on("change", () => aplicarFiltros());
        $(app.filtroGestion).on("change", () => aplicarFiltros());
    }
});

function cargarAgotados(filtros, mantenerEstado = true) {
    // Guardar qué acordeones están abiertos antes de recargar
    // Guardar estado actual de los elementos
    const elementosEstado = {};

    if (mantenerEstado) {
        // Guardar acordeones abiertos
        openCollapses = [];
        $('.collapse.show').each(function () {
            openCollapses.push(this.id);
        });

        // Guardar valores de los formularios
        $('[id^="estado"], [id^="gestion"], [id^="obs_ges"]').each(function () {
            elementosEstado[this.id] = $(this).val();
        });
    }

    if (filtros["estado"] === "Finalizado") {
        app.botonenvio.style.display = "inline-block";
        app.filgestion.style.display = "block";
        //poblarSelect(app.filtroGestion, "cbges", "Todos", true, null, true, null);
    } else {
        app.botonenvio.style.display = "none";
        app.filgestion.style.display = "none";
    }

    let ultimoHash = '';

    $.ajax({
        url: "./php/gestion/get_agotados.php",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(filtros),
        success: function (resp) {
            if (resp.hash === ultimoHash && mantenerEstado) return;
            ultimoHash = resp.hash;
            if (resp.estado !== "exito") {
                alertas("Boton", resp.mensaje || "Error al cargar estado general", "error");
                return;
            }

            const datos = resp.datos || [];

            const datosActuales = $(app.tablaA).find('tr[data-bs-toggle="collapse"]').length;
            if (datos.length === datosActuales && mantenerEstado) {
                return; // No hay cambios reales, salir sin redibujar
            }

            let html = "";

            datos.forEach((fila, index) => {
                html += `
                <tr class="accordion-toggle" data-bs-toggle="collapse" data-bs-target="#collapse11${index}">
                    <td class="p-1 text-center compact-cell">${fila.ext}</td>
                    <td class="p-1 text-adjustable">${fila.item}</td>
                    <td class="p-1 text-center compact-cell">${fila.motivo}</td>
                    <td class="p-1 text-adjustable">${fila.obs}</td>
                    <td class="p-1 text-center compact-cell">${fila.tipo}</td>
                    <td class="p-1  text-adjustable">${fila.estado}</td>
                    <td class="p-1">
                    <button class="btn btn-sm btn-primary ver-envio" data-id="${fila.id}" title="Ver detalle">
                        <i class="fa fa-eye"></i>
                    </button>
                    </td>
                </tr>
                `;
                if (fila.estado === "Finalizado") {
                    html += `
                    <tr>
                        <td colspan="7" class="hiddenRow">
                            <div id="collapse11${index}" class="collapse">
                                <table class="table table-striped">

                                    <thead class="table-info">
                                        <tr>
                                            <th colspan="5" class="col-sm-10">Gestión</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td <th colspan="5" class="col-sm-10">${fila.gestion}</td>
                                        </tr>
                                    </tbody>

                                    <thead class="table-info">
                                        <tr>
                                            <th colspan="5" class="col-sm-12">Observación</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td colspan="5" class="col-sm-12">${fila.obs_ges}</td>
                                        </tr>
                                    </tbody>

                                    <thead class="table-info">
                                        <tr>
                                            <th class="col-sm-2">Fecha Inicio Gestion</th>
                                            <th class="col-sm-2">Fecha Fin Gestion</th>
                                            <th class="col-sm-2">Dias Sin Gestion</th>
                                            <th class="col-sm-2">Dias de Gestion</th>
                                            <th class="col-sm-2">Dias totales de Gestion</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td class="col-sm-2">${fila.fecha_ini}</td>
                                            <td class="col-sm-2">${fila.fecha_fin}</td>
                                            <td class="col-sm-2">${fila.dia_sin_ges}</td>
                                            <td class="col-sm-2">${fila.dia_gestion}</td>
                                            <td class="col-sm-2">${fila.dia_total}</td>
                                        </tr>
                                    </tbody>


                                </table>
                            </div>
                        </td>
                    </tr>
                    `;
                } else {
                    html += `
                    <tr>
                        <td colspan="7" class="hiddenRow">
                            <div id="collapse11${index}" class="collapse">
                            <table class="table table-striped">
                            <thead class="table-info">
                                <tr>
                                    <th class="col-sm-10">Gestión</th>
                                    <th class="col-sm-2">Estado</th>
                                </tr>
                                <tr>
                                    <td class="col-sm-10">
                                        <select id="gestion${index}" class="form-select form-select-sm w-100">
                                            <option value="">Cargando…</option>
                                            <option value="0">Selecciona un gestion</option>
                                        </select>
                                    </td>
                                    <td class="col-sm-2">
                                        <select id="estado${index}" class="form-select form-select-sm w-100">
                                            <option value="">Cargando…</option>
                                            <option value="0">Selecciona un estado</option>
                                        </select>
                                    </td>
                                </tr>
                                <tr>
                                    <th class="col-sm-8">Observación</th>
                                    <th class="col-sm-4">Enviar</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="col-sm-8">
                                        <input type="text" name="obs_ges" id="obs_ges${index}"
                                            class="form-control form-control-sm text-uppercase" placeholder="Observación de Gestión">
                                    </td>
                                    <td class="col-sm-4">
                                        <button class="btn btn-success btn-sm w-50" onclick="gestionaragotado(${fila.id}, ${index})">
                                            <i class="fa fa-check"></i> Procesar
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                            </div>
                        </td>
                    </tr>
                    `;
                }
            });

            $(app.tablaA).addClass('cargando');

            $(app.tablaA).html(html);

            if (mantenerEstado) {
                openCollapses.forEach(id => {
                    $(`#${id}`).collapse('show');
                });
            }

            datos.forEach((fila, index) => {
                if (fila.estado === "En proceso") {
                    poblarSelect("gestion", "cbges", "Seleccione una Gestion", true, info.gestion, false, index);
                    llenarSelect("estado", estadosllenar(false), "Seleccione un Estado", true, info.estado, false, index);

                    if (fila.obs_ges) {
                        $(`#obs_ges${index}`).val(fila.obs_ges);
                    }
                } else {
                    poblarSelect("gestion", "cbges", "Seleccione una Gestion", true, elementosEstado[`gestion${index}`], false, index);
                    llenarSelect("estado", estadosllenar(false), "Seleccione un Estado", true, elementosEstado[`gestion${index}`], false, index);

                    if (elementosEstado[`obs_ges${index}`]) {
                        $(`#obs_ges${index}`).val(elementosEstado[`obs_ges${index}`]);
                    }
                }
            });

            $(app.tablaA).removeClass('cargando');

        },
        error() {
            alertas("Boton", "Error de comunicación con el servidor", "error");
        }
    })
}

function aplicarFiltros() {
    const fecha = app.filtroFecha.value;
    const asesor = app.filtroAsesor.value;
    const motivo = app.filtroMotivo.value;
    const tipo = app.filtroTipo.value;
    const estado = app.filtroEstado.value;
    const gestion = Array
        .from(app.filtroGestion.selectedOptions)
        .filter(opt => opt.value !== "")
        .map(opt => opt.text.trim());

    console.log(gestion);

    cargarAgotados({ fecha, asesor, motivo, tipo, estado, gestion });
}

function verificarNuevosAgotados(primeraVez = false, forzarRecarga = false) {
    fetch("./php/gestion/contar_agotados.php")
        .then(r => r.json())
        .then(({ estado, cuantos, mensaje }) => {
            if (estado !== "exito") return;

            if (primeraVez) {
                conteoAnterior = cuantos;
                return;
            }

            if (cuantos !== conteoAnterior || forzarRecarga) {
                const diferencia = cuantos - conteoAnterior;
                if (diferencia > 0) {
                    mostrarNotificacion("📢 Nuevos pedidos disponibles",
                        `Tienes ${diferencia} nuevo(s) agotado(s) por gestionar.`);
                }
                conteoAnterior = cuantos;
            }
        });
}

function gestionaragotado(idAgotado, index) {
    const selectgestion = document.getElementById(`gestion${index}`);
    const gestion = selectgestion.value;

    const selectestado = document.getElementById(`estado${index}`);
    const estado = selectestado.value;

    const obs_ges = document.getElementById(`obs_ges${index}`);
    const obs = obs_ges.value.trim();

    const ffecha = app.filtroFecha.value;
    const fasesor = app.filtroAsesor.value;
    const fmotivo = app.filtroMotivo.value;
    const ftipo = app.filtroTipo.value;
    const festado = app.filtroEstado.value;

    if (gestion === "0" || estado === "0") {
        alertas("Boton", "Los campos deben de estar llenos", "warning");
        return;
    }

    const datos = {
        id: idAgotado,
        gestion: gestion,
        estado: estado,
        obs: obs
    }

    $.ajax({
        url: "./php/gestion/gestionar_agotados.php",
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({ datos }),
        success(resp) {
            if (resp.estado === "exito") {
                if (estado === "Finalizado") {
                    const filaPadre = $(`#collapse11${index}`).closest("tr").prev();
                    const filaHija = $(`#collapse11${index}`).closest("tr");
                    filaPadre.remove();
                    filaHija.remove();
                }

                cargarAgotados({
                    fecha: ffecha,
                    asesor: fasesor,
                    motivo: fmotivo,
                    tipo: ftipo,
                    estado: festado
                });
                alertas("Temporal", "Agotado Gestionado con exito", "success");
            } else {
                alertas("Boton", resp.mensaje, "error");
            }
        },
        error() {
            alertas("Boton", "Error de comunicación con el servidor", "error");
        }
    });
}

function estadosllenar(filtro = true) {
    let estadosFijos = [];

    if (filtro) {
        estadosFijos = [{ codigo: "Solicitud", descrip: "Solicitud" },
        { codigo: "En proceso", descrip: "En proceso" },
        { codigo: "Enviado", descrip: "Enviado" },
        { codigo: "Finalizado", descrip: "Finalizado" }];
    } else {
        estadosFijos = [{ codigo: "En proceso", descrip: "En proceso" },
        { codigo: "Finalizado", descrip: "Finalizado" }];
    }
    return estadosFijos;
}