const loginForm = document.getElementById("login-form");
const errorMsg = document.getElementById("error-msg");

const BACKEND_URL = "http://localhost:3000/api/auth/login";

loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    if (!email || !password) {
        errorMsg.textContent = "Todos los campos son requeridos";
        return;
    }

    try {
        const response = await fetch(BACKEND_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        let data;
        try {
            data = await response.json(); // Intentamos parsear JSON
        } catch {
            data = { error: "Respuesta inválida del servidor" };
        }

        if (!response.ok) {
            console.error("Login error:", data);
            errorMsg.textContent = data.error || `Error ${response.status}`;
            return;
        }

        // Guardamos token y redirigimos
        localStorage.setItem("jwt_token", data.jwt_token);
        window.location.href = "index.html";

    } catch (err) {
        console.error("Fetch error:", err);
        errorMsg.textContent = "Error de conexión con el servidor";
    }
});
