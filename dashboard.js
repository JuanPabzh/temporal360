const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

if (!usuario) {
    window.location.href = "index.html";
}

document.getElementById("nombre-usuario").textContent = usuario.usuario + " | " + usuario.rol;

const menus = {
    administrador: [
        { nombre: "Dashboard", funcion: "mostrarDashboard" },
        { nombre: "Entradas", funcion: "mostrarEntradas" },
        { nombre: "Salidas", funcion: "mostrarSalidas" },
        { nombre: "Inventario", funcion: "mostrarInventario" },
        { nombre: "Alertas", funcion: "mostrarAlertas" },
        { nombre: "Movimientos", funcion: "mostrarMovimientos" },
        { nombre: "Personal", funcion: "mostrarPersonal" },
        { nombre: "Usuarios", funcion: "mostrarUsuarios" }
    ],
    supervisor: [
        { nombre: "Dashboard", funcion: "mostrarDashboard" },
        { nombre: "Entradas", funcion: "mostrarEntradas" },
        { nombre: "Salidas", funcion: "mostrarSalidas" },
        { nombre: "Inventario", funcion: "mostrarInventario" },
        { nombre: "Alertas", funcion: "mostrarAlertas" },
        { nombre: "Movimientos", funcion: "mostrarMovimientos" },
        { nombre: "Personal", funcion: "mostrarPersonal" }
    ],
    bodeguero: [
        { nombre: "Entradas", funcion: "mostrarEntradas" },
        { nombre: "Salidas", funcion: "mostrarSalidas" },
        { nombre: "Inventario", funcion: "mostrarInventario" },
        { nombre: "Alertas", funcion: "mostrarAlertas" }
    ]
};

const menu = document.getElementById("menu");
menus[usuario.rol].forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.nombre;
    btn.onclick = () => window[item.funcion]();
    menu.appendChild(btn);
});

const productos = [
    { id: 1, nombre: "Águila 330ml", zona: "A1", stock: 240, unidad: "cajas" },
    { id: 2, nombre: "Póker 330ml", zona: "A2", stock: 180, unidad: "cajas" },
    { id: 3, nombre: "Club Colombia 330ml", zona: "B1", stock: 95, unidad: "cajas" },
    { id: 4, nombre: "Águila Light 330ml", zona: "B2", stock: 60, unidad: "cajas" },
    { id: 5, nombre: "Costeña 330ml", zona: "C1", stock: 120, unidad: "cajas" }
];

const movimientos = [
    { fecha: "22/05/2026", producto: "Águila 330ml", tipo: "Entrada", cantidad: 50, bodeguero: "bodeguero1", estado: "completo" },
    { fecha: "22/05/2026", producto: "Póker 330ml", tipo: "Salida", cantidad: 30, bodeguero: "bodeguero1", estado: "completo" },
    { fecha: "21/05/2026", producto: "Club Colombia 330ml", tipo: "Entrada", cantidad: 40, bodeguero: "bodeguero1", estado: "incompleto" },
    { fecha: "21/05/2026", producto: "Costeña 330ml", tipo: "Entrada", cantidad: 60, bodeguero: "bodeguero1", estado: "completo" },
    { fecha: "20/05/2026", producto: "Águila Light 330ml", tipo: "Salida", cantidad: 20, bodeguero: "bodeguero1", estado: "pendiente" }
];

const personal = [
    { nombre: "Carlos Pérez", turno: "Mañana", estado: "activo", movimientos: 12 },
    { nombre: "Luis Martínez", turno: "Tarde", estado: "activo", movimientos: 8 },
    { nombre: "Pedro García", turno: "Noche", estado: "inactivo", movimientos: 0 },
    { nombre: "Andrés López", turno: "Mañana", estado: "activo", movimientos: 5 }
];

let usuarios = [
    { usuario: "admin", rol: "administrador" },
    { usuario: "supervisor", rol: "supervisor" },
    { usuario: "bodeguero1", rol: "bodeguero" }
];

let graficoInstancia = null;

function mostrarDashboard() {
    document.getElementById("titulo-pagina").textContent = "Dashboard";
    const completos = movimientos.filter(m => m.estado === "completo").length;
    const incompletos = movimientos.filter(m => m.estado === "incompleto").length;
    const entradas = movimientos.filter(m => m.tipo === "Entrada").length;
    const salidas = movimientos.filter(m => m.tipo === "Salida").length;
    const activos = personal.filter(p => p.estado === "activo").length;
    const inactivos = personal.filter(p => p.estado === "inactivo").length;

    document.getElementById("contenido-principal").innerHTML = `
        <div class="tarjetas">
            <div class="tarjeta">
                <h4>Total Productos</h4>
                <p>${productos.length}</p>
                <span>En inventario</span>
            </div>
            <div class="tarjeta">
                <h4>Entradas</h4>
                <p>${entradas}</p>
                <span>Registradas</span>
            </div>
            <div class="tarjeta">
                <h4>Salidas</h4>
                <p>${salidas}</p>
                <span>Despachadas</span>
            </div>
            <div class="tarjeta">
                <h4>Pedidos Completos</h4>
                <p>${completos}</p>
                <span style="color:#51cf66">Sin novedad</span>
            </div>
            <div class="tarjeta">
                <h4>Pedidos Incompletos</h4>
                <p>${incompletos}</p>
                <span>Requieren atención</span>
            </div>
            <div class="tarjeta">
                <h4>Personal Activo</h4>
                <p>${activos}</p>
                <span style="color:#51cf66">${activos} en turno / ${inactivos} sin turno</span>
            </div>
        </div>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 25px;">
            <div class="tabla-container">
                <h4>Entradas vs Salidas por Producto</h4>
                <canvas id="graficoMovimientos"></canvas>
            </div>
            <div class="tabla-container">
                <h4>Stock Actual por Producto</h4>
                <canvas id="graficoStock"></canvas>
            </div>
        </div>
        <div class="tabla-container">
            <h4>Movimientos Recientes</h4>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Estado</th>
                </tr>
                ${movimientos.map(m => `
                    <tr>
                        <td>${m.fecha}</td>
                        <td>${m.producto}</td>
                        <td>${m.tipo}</td>
                        <td>${m.cantidad}</td>
                        <td><span class="badge ${m.estado}">${m.estado}</span></td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;

    // Gráfico Entradas vs Salidas
    const entradaPorProducto = productos.map(p =>
        movimientos.filter(m => m.producto === p.nombre && m.tipo === "Entrada")
            .reduce((sum, m) => sum + m.cantidad, 0)
    );
    const salidaPorProducto = productos.map(p =>
        movimientos.filter(m => m.producto === p.nombre && m.tipo === "Salida")
            .reduce((sum, m) => sum + m.cantidad, 0)
    );

    const ctx1 = document.getElementById("graficoMovimientos").getContext("2d");
    new Chart(ctx1, {
        type: "bar",
        data: {
            labels: productos.map(p => p.nombre.replace(" 330ml", "")),
            datasets: [
                {
                    label: "Entradas",
                    data: entradaPorProducto,
                    backgroundColor: "#51cf66"
                },
                {
                    label: "Salidas",
                    data: salidaPorProducto,
                    backgroundColor: "#e94560"
                }
            ]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "white" } }
            },
            scales: {
                x: { ticks: { color: "white" }, grid: { color: "#0f3460" } },
                y: { ticks: { color: "white" }, grid: { color: "#0f3460" } }
            }
        }
    });

    // Gráfico Stock
    const ctx2 = document.getElementById("graficoStock").getContext("2d");
    new Chart(ctx2, {
        type: "doughnut",
        data: {
            labels: productos.map(p => p.nombre.replace(" 330ml", "")),
            datasets: [{
                data: productos.map(p => p.stock),
                backgroundColor: ["#e94560", "#51cf66", "#f39c12", "#3498db", "#9b59b6"]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: "white" } }
            }
        }
    });
}

function mostrarEntradas() {
    document.getElementById("titulo-pagina").textContent = "Registro de Entradas";
    document.getElementById("contenido-principal").innerHTML = `
        <div class="formulario">
            <h4>Registrar Entrada</h4>
            <select id="prod-entrada">
                ${productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("")}
            </select>
            <input type="number" id="cant-entrada" placeholder="Cantidad recibida">
            <input type="number" id="cant-esperada" placeholder="Cantidad esperada">
            <input type="text" id="zona-entrada" placeholder="Zona de almacenamiento (ej: A1)">
            <button onclick="registrarEntrada()">Registrar Entrada</button>
            <p id="msg-entrada"></p>
        </div>
        <br>
        <div class="tabla-container">
            <h4>Entradas Registradas</h4>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Bodeguero</th>
                    <th>Estado</th>
                </tr>
                <tbody id="tabla-entradas">
                    ${movimientos.filter(m => m.tipo === "Entrada").map(m => `
                        <tr>
                            <td>${m.fecha}</td>
                            <td>${m.producto}</td>
                            <td>${m.cantidad}</td>
                            <td>${m.bodeguero}</td>
                            <td><span class="badge ${m.estado}">${m.estado}</span></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function registrarEntrada() {
    const prodId = document.getElementById("prod-entrada").value;
    const cant = parseInt(document.getElementById("cant-entrada").value);
    const esperada = parseInt(document.getElementById("cant-esperada").value);
    const zona = document.getElementById("zona-entrada").value;
    const producto = productos.find(p => p.id == prodId);

    if (!cant || !esperada || !zona) {
        document.getElementById("msg-entrada").style.color = "#e94560";
        document.getElementById("msg-entrada").textContent = "Completa todos los campos.";
        return;
    }

    const estado = cant >= esperada ? "completo" : "incompleto";
    producto.stock += cant;
    producto.zona = zona;

    movimientos.unshift({
        fecha: new Date().toLocaleDateString("es-CO"),
        producto: producto.nombre,
        tipo: "Entrada",
        cantidad: cant,
        bodeguero: usuario.usuario,
        estado: estado
    });

    document.getElementById("msg-entrada").style.color = estado === "completo" ? "#51cf66" : "#e94560";
    document.getElementById("msg-entrada").textContent = estado === "completo"
        ? "✓ Entrada registrada correctamente."
        : "⚠ Entrada registrada con alerta de pedido incompleto.";

    document.getElementById("tabla-entradas").innerHTML = movimientos.filter(m => m.tipo === "Entrada").map(m => `
        <tr>
            <td>${m.fecha}</td>
            <td>${m.producto}</td>
            <td>${m.cantidad}</td>
            <td>${m.bodeguero}</td>
            <td><span class="badge ${m.estado}">${m.estado}</span></td>
        </tr>
    `).join("");

    document.getElementById("cant-entrada").value = "";
    document.getElementById("cant-esperada").value = "";
    document.getElementById("zona-entrada").value = "";
}

function mostrarSalidas() {
    document.getElementById("titulo-pagina").textContent = "Registro de Salidas";
    document.getElementById("contenido-principal").innerHTML = `
        <div class="formulario">
            <h4>Registrar Salida</h4>
            <select id="prod-salida">
                ${productos.map(p => `<option value="${p.id}">${p.nombre}</option>`).join("")}
            </select>
            <input type="number" id="cant-salida" placeholder="Cantidad a despachar">
            <input type="text" id="destino-salida" placeholder="Destino del pedido">
            <button onclick="registrarSalida()">Registrar Salida</button>
            <p id="msg-salida"></p>
        </div>
        <br>
        <div class="tabla-container">
            <h4>Salidas Registradas</h4>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Bodeguero</th>
                    <th>Estado</th>
                </tr>
                <tbody id="tabla-salidas">
                    ${movimientos.filter(m => m.tipo === "Salida").map(m => `
                        <tr>
                            <td>${m.fecha}</td>
                            <td>${m.producto}</td>
                            <td>${m.cantidad}</td>
                            <td>${m.bodeguero}</td>
                            <td><span class="badge ${m.estado}">${m.estado}</span></td>
                        </tr>
                    `).join("")}
                </tbody>
            </table>
        </div>
    `;
}

function registrarSalida() {
    const prodId = document.getElementById("prod-salida").value;
    const cant = parseInt(document.getElementById("cant-salida").value);
    const destino = document.getElementById("destino-salida").value;
    const producto = productos.find(p => p.id == prodId);

    if (!cant || !destino) {
        document.getElementById("msg-salida").style.color = "#e94560";
        document.getElementById("msg-salida").textContent = "Completa todos los campos.";
        return;
    }

    if (cant > producto.stock) {
        document.getElementById("msg-salida").style.color = "#e94560";
        document.getElementById("msg-salida").textContent = "Stock insuficiente para esta salida.";
        return;
    }

    producto.stock -= cant;
    movimientos.unshift({
        fecha: new Date().toLocaleDateString("es-CO"),
        producto: producto.nombre,
        tipo: "Salida",
        cantidad: cant,
        bodeguero: usuario.usuario,
        estado: "completo"
    });

    document.getElementById("msg-salida").style.color = "#51cf66";
    document.getElementById("msg-salida").textContent = "✓ Salida registrada correctamente.";

    document.getElementById("tabla-salidas").innerHTML = movimientos.filter(m => m.tipo === "Salida").map(m => `
        <tr>
            <td>${m.fecha}</td>
            <td>${m.producto}</td>
            <td>${m.cantidad}</td>
            <td>${m.bodeguero}</td>
            <td><span class="badge ${m.estado}">${m.estado}</span></td>
        </tr>
    `).join("");

    document.getElementById("cant-salida").value = "";
    document.getElementById("destino-salida").value = "";
}

function mostrarInventario() {
    document.getElementById("titulo-pagina").textContent = "Inventario";
    document.getElementById("contenido-principal").innerHTML = `
        <div class="tabla-container">
            <h4>Stock Actual</h4>
            <table>
                <tr>
                    <th>Producto</th>
                    <th>Stock</th>
                    <th>Unidad</th>
                    <th>Zona</th>
                </tr>
                ${productos.map(p => `
                    <tr>
                        <td>${p.nombre}</td>
                        <td>${p.stock}</td>
                        <td>${p.unidad}</td>
                        <td>${p.zona}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

function mostrarAlertas() {
    document.getElementById("titulo-pagina").textContent = "Alertas";
    const alertas = movimientos.filter(m => m.estado === "incompleto" || m.estado === "pendiente");
    document.getElementById("contenido-principal").innerHTML = `
        ${alertas.length === 0
            ? `<div class="alerta" style="border-color:#51cf66"><span style="color:#51cf66">✓ Sin alertas activas.</span></div>`
            : alertas.map(a => `
                <div class="alerta">
                    <span>⚠ ${a.estado.toUpperCase()}:</span> ${a.producto} — ${a.tipo} de ${a.cantidad} unidades el ${a.fecha} por ${a.bodeguero}
                </div>
            `).join("")}
    `;
}

function mostrarMovimientos() {
    document.getElementById("titulo-pagina").textContent = "Historial de Movimientos";
    document.getElementById("contenido-principal").innerHTML = `
        <div class="tabla-container">
            <h4>Todos los Movimientos</h4>
            <table>
                <tr>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Tipo</th>
                    <th>Cantidad</th>
                    <th>Bodeguero</th>
                    <th>Estado</th>
                </tr>
                ${movimientos.map(m => `
                    <tr>
                        <td>${m.fecha}</td>
                        <td>${m.producto}</td>
                        <td>${m.tipo}</td>
                        <td>${m.cantidad}</td>
                        <td>${m.bodeguero}</td>
                        <td><span class="badge ${m.estado}">${m.estado}</span></td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

function mostrarPersonal() {
    document.getElementById("titulo-pagina").textContent = "Personal";
    document.getElementById("contenido-principal").innerHTML = `
        <div class="tabla-container">
            <h4>Bodegueros</h4>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Turno</th>
                    <th>Estado</th>
                    <th>Movimientos</th>
                </tr>
                ${personal.map(p => `
                    <tr>
                        <td>${p.nombre}</td>
                        <td>${p.turno}</td>
                        <td><span class="badge ${p.estado}">${p.estado}</span></td>
                        <td>${p.movimientos}</td>
                    </tr>
                `).join("")}
            </table>
        </div>
    `;
}

function mostrarUsuarios() {
    document.getElementById("titulo-pagina").textContent = "Usuarios y Roles";
    document.getElementById("contenido-principal").innerHTML = `
        <div class="tabla-container">
            <h4>Gestión de Usuarios</h4>
            <table>
                <tr>
                    <th>Usuario</th>
                    <th>Rol Actual</th>
                    <th>Cambiar Rol</th>
                </tr>
                ${usuarios.map((u, i) => `
                    <tr>
                        <td>${u.usuario}</td>
                        <td><span class="badge activo">${u.rol}</span></td>
                        <td>
                            <select id="rol-${i}" onchange="cambiarRol(${i})">
                                <option value="administrador" ${u.rol === "administrador" ? "selected" : ""}>Administrador</option>
                                <option value="supervisor" ${u.rol === "supervisor" ? "selected" : ""}>Supervisor</option>
                                <option value="bodeguero" ${u.rol === "bodeguero" ? "selected" : ""}>Bodeguero</option>
                            </select>
                        </td>
                    </tr>
                `).join("")}
            </table>
        </div>
        <p id="msg-rol" style="color:#51cf66; margin-top:15px"></p>
    `;
}

function cambiarRol(index) {
    const nuevoRol = document.getElementById(`rol-${index}`).value;
    usuarios[index].rol = nuevoRol;
    document.getElementById("msg-rol").textContent = `✓ Rol de ${usuarios[index].usuario} actualizado a ${nuevoRol}.`;
    mostrarUsuarios();
}

function cerrarSesion() {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
}

if (usuario.rol === "bodeguero") {
    mostrarEntradas();
} else {
    mostrarDashboard();
}