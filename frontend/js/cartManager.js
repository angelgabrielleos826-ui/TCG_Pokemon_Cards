// cartManager.js - Manejo del carrito con backend
const API_URL = "http://localhost:3000/api";

// Obtener token JWT
function getToken() {
  return localStorage.getItem("jwt_token");
}

// Verificar autenticación
function verificarAutenticacion() {
  const token = getToken();
  if (!token) {
    alert("Debes iniciar sesión para usar el carrito");
    window.location.href = "../html/login.html";
    return false;
  }
  return true;
}

// Cargar todas las cartas del backend
async function obtenerCartasBackend() {
  try {
    const response = await fetch(`${API_URL}/cards`);
    if (!response.ok) throw new Error("Error al cargar cartas");
    return await response.json();
  } catch (error) {
    console.error("Error cargando cartas:", error);
    return [];
  }
}

// Buscar ID de carta por nombre
function buscarIdPorNombre(nombre, cartas) {
  const carta = cartas.find(c => c.name === nombre);
  return carta ? carta._id : null;
}

// Agregar carta al carrito (backend)
async function agregarCartaAlBackend(cardId, quantity = 1) {
  if (!verificarAutenticacion()) return false;

  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/cart/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ cardId, quantity })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error("Error agregando carta:", error);
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error al agregar al carrito:", error);
    alert("Error al agregar cartas. Verifica tu conexión.");
    return false;
  }
}

// Obtener carrito del backend
async function obtenerCarritoBackend() {
  if (!verificarAutenticacion()) return null;

  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/cart`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!response.ok) throw new Error("Error al cargar carrito");
    return await response.json();
  } catch (error) {
    console.error("Error cargando carrito:", error);
    return null;
  }
}

// Eliminar carta del carrito
async function eliminarCartaDelBackend(cardId) {
  if (!verificarAutenticacion()) return false;

  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/cart/remove/${cardId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error("Error eliminando carta:", error);
    return false;
  }
}

// Vaciar carrito completo
async function vaciarCarritoBackend() {
  if (!verificarAutenticacion()) return false;

  const token = getToken();

  try {
    const response = await fetch(`${API_URL}/cart/clear`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return response.ok;
  } catch (error) {
    console.error("Error vaciando carrito:", error);
    return false;
  }
}