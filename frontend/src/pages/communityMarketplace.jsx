import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { authService } from "../services/auth";
import { communityService } from "../services/community";
import "../assets/css/community.css";

const initialForm = {
  nombre: "",
  description: "",
  precio: "",
  cantidad: "",
  contacto: "",
  image: "",
};

export default function CommunityMarketplace() {
  const [publications, setPublications] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const myPublications = useMemo(() => {
    if (!me?.id) return [];
    return publications.filter((item) => item.user?._id === me.id);
  }, [publications, me]);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setLoading(true);
    setError("");
    try {
      const [items, user] = await Promise.all([
        communityService.list(),
        authService.me().catch(() => null),
      ]);
      setPublications(Array.isArray(items) ? items : []);
      setMe(user);
    } catch (e) {
      setError(e.message || "No se pudo cargar la comunidad");
    } finally {
      setLoading(false);
    }
  }

  function getFriendlyError(err, fallback) {
    if (err?.data?.error) return err.data.error;
    if (err?.message) return err.message;
    return fallback;
  }

  function validateFormValues(values) {
    const nombre = values.nombre.trim();
    const description = values.description.trim();
    const contacto = values.contacto.trim();
    const image = values.image.trim();
    const precio = Number(values.precio);
    const cantidad = Number(values.cantidad);

    if (!nombre) return "El nombre de la carta es obligatorio.";
    if (!description) return "La descripcion es obligatoria.";
    if (description.length < 10) return "La descripcion debe tener al menos 10 caracteres.";
    if (!Number.isFinite(precio) || precio <= 0) return "El precio debe ser mayor a 0.";
    if (!Number.isInteger(cantidad) || cantidad <= 0) return "La cantidad debe ser un entero mayor a 0.";
    if (!contacto) return "El contacto es obligatorio.";
    if (!image) return "La URL de la imagen es obligatoria.";

    try {
      // Valida formato de URL antes de enviar al backend.
      new URL(image);
    } catch {
      return "La URL de imagen no es valida.";
    }

    return null;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function resetForm() {
    setForm(initialForm);
    setEditingId(null);
  }

  function isOwnPublication(item) {
    return me?.id && item.user?._id === me.id;
  }

  function startEdit(item) {
    setEditingId(item._id);
    setMessage("");
    setError("");
    setForm({
      nombre: item.nombre || "",
      description: item.description || "",
      precio: String(item.precio ?? ""),
      cantidad: String(item.cantidad ?? ""),
      contacto: item.contacto || "",
      image: item.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (!me?.id) {
      setError("Debes iniciar sesion para crear o editar publicaciones.");
      setMessage("");
      return;
    }

    const validationError = validateFormValues(form);
    if (validationError) {
      setError(validationError);
      setMessage("");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      nombre: form.nombre.trim(),
      description: form.description.trim(),
      contacto: form.contacto.trim(),
      image: form.image.trim(),
      precio: Number(form.precio),
      cantidad: Number(form.cantidad),
    };

    try {
      if (editingId) {
        await communityService.update(editingId, payload);
        setMessage("Publicacion actualizada correctamente");
      } else {
        await communityService.create(payload);
        setMessage("Publicacion creada correctamente");
      }
      resetForm();
      await loadData();
    } catch (e) {
      setError(getFriendlyError(e, "Ocurrio un error al guardar"));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Deseas eliminar esta publicacion?");
    if (!confirmed) return;

    setError("");
    setMessage("");
    setDeletingId(id);
    try {
      await communityService.remove(id);
      setMessage("Publicacion eliminada correctamente");
      await loadData();
    } catch (e) {
      setError(getFriendlyError(e, "No se pudo eliminar la publicacion"));
    } finally {
      setDeletingId(null);
    }
  }

  async function handleLogout() {
    setError("");
    setMessage("");
    try {
      await authService.logout();
      setMe(null);
      setMessage("Sesion cerrada correctamente.");
    } catch (e) {
      setError(getFriendlyError(e, "No se pudo cerrar sesion."));
    }
  }

  return (
    <main className="community-page">
      <header className="community-header">
        <p className="community-kicker">TCG Monterrey</p>
        <h1>Mercado de Cartas - Comunidad</h1>
        <p>Crea, publica y administra tus cartas en venta.</p>
        {!me ? (
          <div className="community-links">
            <Link to="/login" className="community-link-btn">Iniciar sesion</Link>
            <Link to="/register" className="community-link-btn">Crear cuenta</Link>
          </div>
        ) : (
          <div className="session-bar">
            <span>Sesion iniciada: {me.email}</span>
            <button type="button" className="session-btn" onClick={handleLogout}>
              Cerrar sesion
            </button>
          </div>
        )}
        <img
          className="community-pacman"
          src="https://www.classicgaming.cc/classics/pac-man/images/web/web-lisnovski-aerial.gif"
          alt="Pacman animado"
          referrerPolicy="no-referrer"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src =
              "https://media.tenor.com/llSAvv3PxdAAAAAM/pacman-namco.gif";
          }}
        />
      </header>

      <section className="form-section">
        <h2>{editingId ? "Editar publicacion" : "Nueva publicacion"}</h2>
        <form onSubmit={handleSubmit} className="publication-form">
          <label htmlFor="nombre">Nombre de la carta</label>
          <input
            id="nombre"
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            required
          />

          <label htmlFor="description">Descripcion</label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            required
            minLength={10}
          />

          <div className="form-grid">
            <div>
              <label htmlFor="precio">Precio</label>
              <input
                id="precio"
                name="precio"
                type="number"
                min="1"
                step="0.01"
                value={form.precio}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="cantidad">Cantidad</label>
              <input
                id="cantidad"
                name="cantidad"
                type="number"
                min="1"
                step="1"
                value={form.cantidad}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <label htmlFor="contacto">Contacto</label>
          <input
            id="contacto"
            name="contacto"
            value={form.contacto}
            onChange={handleChange}
            placeholder="Instagram, WhatsApp o correo"
            required
          />

          <label htmlFor="image">Imagen (URL)</label>
          <input
            id="image"
            name="image"
            type="url"
            value={form.image}
            onChange={handleChange}
            placeholder="https://..."
            required
          />

          <div className="form-actions">
            <button type="submit" disabled={saving || !me}>
              {saving ? "Guardando..." : editingId ? "Actualizar" : "Publicar"}
            </button>
            {editingId && (
              <button type="button" className="ghost-btn" onClick={resetForm} disabled={saving}>
                Cancelar edicion
              </button>
            )}
            <button type="button" className="ghost-btn" onClick={resetForm} disabled={saving}>
              Limpiar formulario
            </button>
          </div>
        </form>
        {!me && (
          <p className="note">Inicia sesion para habilitar el formulario de publicacion.</p>
        )}
        {error && <p className="feedback error" role="alert" aria-live="polite">{error}</p>}
        {message && <p className="feedback success" role="status" aria-live="polite">{message}</p>}
      </section>

      <section className="list-section">
        <h2>Mis publicaciones</h2>
        {!me && (
          <p className="note">
            Inicia sesion para crear, editar o borrar tus publicaciones.
          </p>
        )}
        {me && myPublications.length === 0 && (
          <p className="note">Aun no tienes publicaciones.</p>
        )}
        <div className="cards-grid">
          {myPublications.map((item) => (
            <article key={`mine-${item._id}`} className="card-item">
              <img src={item.image} alt={item.nombre} />
              <div>
                <h3>{item.nombre}</h3>
                <p>{item.description}</p>
                <p className="price">${item.precio}</p>
                <p className="meta">Cantidad: {item.cantidad}</p>
                <p className="meta">Contacto: {item.contacto}</p>
                <div className="card-actions">
                  <button type="button" onClick={() => startEdit(item)}>
                    Editar
                  </button>
                  <button
                    type="button"
                    className="danger-btn"
                    disabled={deletingId === item._id}
                    onClick={() => handleDelete(item._id)}
                  >
                    {deletingId === item._id ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="list-section">
        <h2>Todas las publicaciones</h2>
        {loading && <p className="note">Cargando publicaciones...</p>}
        {!loading && publications.length === 0 && (
          <p className="note">No hay publicaciones disponibles.</p>
        )}
        <div className="cards-grid">
          {publications.map((item) => (
            <article key={item._id} className="card-item">
              <img src={item.image} alt={item.nombre} />
              <div>
                <h3>{item.nombre}</h3>
                <p>{item.description}</p>
                <p className="price">${item.precio}</p>
                <p className="meta">Cantidad: {item.cantidad}</p>
                <p className="meta">Contacto: {item.contacto}</p>
                <p className="meta">
                  Publicado por: {item.user?.email || "Usuario"}
                </p>
                {isOwnPublication(item) && (
                  <div className="card-actions">
                    <button type="button" onClick={() => startEdit(item)}>
                      Editar
                    </button>
                    <button
                      type="button"
                      className="danger-btn"
                      disabled={deletingId === item._id}
                      onClick={() => handleDelete(item._id)}
                    >
                      {deletingId === item._id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
