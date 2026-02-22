document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("cardForm");
    const inputImagen = document.getElementById("imageInput");
    const previewImg = document.getElementById("previewImg");

    // Vista previa de imagen
    inputImagen.addEventListener("input", function () {
        previewImg.src = this.value;
    });

    // Envío del formulario
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const newCard = {
            name: form.name.value,
            image: form.image.value,
            price: Number(form.price.value),
            stock: Number(form.stock.value),
        };

        // Aquí es donde llamamos al backend
        fetch("http://localhost:3000/api/cards/createCard", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newCard)
        })
        .then(res => res.json())
        .then(data => {
            console.log("Carta guardada:", data);
            alert("Carta creada en la base de datos ");

            // Limpiar formulario y preview
            form.reset();
            previewImg.src = "";
        })
        .catch(err => {
            console.error("Error al crear la carta:", err);
            alert("Hubo un error al crear la carta ");
        });
    });

});