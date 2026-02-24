document.addEventListener("DOMContentLoaded", async () => {
    try {
        const res = await fetch("http://localhost:3000/api/auth/me", {
            credentials: "include"
        });

        if (!res.ok) return;

        const user = await res.json();

        if (user.role === "admin") {
            document.getElementById("btnCrearEvento").style.display = "block";
        }
    } catch (err) {
        console.log("No autenticado");
    }
});