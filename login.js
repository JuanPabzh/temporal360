const usuarios = [
    { usuario: "admin", password: "admin123", rol: "administrador" },
    { usuario: "supervisor", password: "super123", rol: "supervisor" },
    { usuario: "bodeguero1", password: "bode123", rol: "bodeguero" }
];

function iniciarSesion() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    const error = document.getElementById("error");

    const encontrado = usuarios.find(u => u.usuario === usuario && u.password === password);

    if (encontrado) {
        localStorage.setItem("usuarioActivo", JSON.stringify(encontrado));
        window.location.href = "dashboard.html";
    } else {
        error.textContent = "Usuario o contraseña incorrectos";
    }
}