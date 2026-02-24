const form = document.getElementById("register-form");
const errorMsg = document.getElementById("error-msg");

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const password = form.password.value.trim();

    if (!email || !password) {
        errorMsg.textContent = "Todos los campos son requeridos";
        return;
    }

    try {
        const response = await fetch("http://localhost:3000/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            // Si hay error del backend
            errorMsg.textContent = data.error || "Error al registrar usuario";
            return;
        }

        // Usuario creado exitosamente → mandar al login
        alert(`Usuario creado: ${data.email}`);
        window.location.href = "../../login.html";

    } catch (err) {
        console.error(err);
        errorMsg.textContent = "Error de conexión con el servidor";
    }
});