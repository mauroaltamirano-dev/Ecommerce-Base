document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");

  // ------------------------------
  //  Crear producto
  // ------------------------------
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        title: form.title.value,
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value) || 0,
        code: form.code.value,
        category: form.category.value,
        image: form.image.value.trim(),
        description: form.description.value,
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert("✅ Producto agregado");
        location.reload();
      } else {
        const error = await res.json();
        alert("❌ Error: " + error.mensaje);
      }
    });
  }

  // ------------------------------
  //  Actualizar stock
  // ------------------------------
  const actualizarStock = async (id, operacion) => {
    const res = await fetch(`/api/products/${id}/stock`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ operacion }),
    });

    if (res.ok) location.reload();
    else alert("❌ Error al actualizar el stock");
  };

  // ------------------------------
  //  Actualizar precio
  // ------------------------------
  const actualizarPrecio = async (id, nuevoPrecio) => {
    const res = await fetch(`/api/products/${id}/price`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nuevoPrecio }),
    });

    if (res.ok) {
      alert("💰 Precio actualizado correctamente");
      location.reload();
    } else {
      alert("❌ Error al actualizar el precio");
    }
  };

  // ------------------------------
  //  Eventos de botones
  // ------------------------------
  document.querySelectorAll(".btn-stock-increase").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      actualizarStock(id, "incrementar");
    });
  });

  document.querySelectorAll(".btn-stock-decrease").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = btn.getAttribute("data-id");
      actualizarStock(id, "reducir");
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-id");
      if (confirm("¿Estás seguro de que querés eliminar el producto?")) {
        await fetch(`/api/products/${pid}`, { method: "DELETE" });
        location.reload();
      }
    });
  });

  // ------------------------------
  //  Editar / Guardar precio
  // ------------------------------
  document.querySelectorAll(".btn-edit-price").forEach((btn) => {
    btn.addEventListener("click", () => {
      const productRow = btn.closest("tr");
      const span = productRow.querySelector(".precio-valor");
      const input = productRow.querySelector(".precio-input");
      const btnGuardar = productRow.querySelector(".btn-save-price");

      // Mostrar input y botón guardar
      span.style.display = "none";
      input.style.display = "inline-block";
      btn.style.display = "none";
      btnGuardar.style.display = "inline-block";

      // 👇 mejora UX: enfocar y seleccionar el número actual
      input.focus();
      input.select();
    });
  });

  document.querySelectorAll(".btn-save-price").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-id");
      const productRow = btn.closest("tr");
      const span = productRow.querySelector(".precio-valor");
      const input = productRow.querySelector(".precio-input");
      const btnEditar = productRow.querySelector(".btn-edit-price");
      const btnGuardar = productRow.querySelector(".btn-save-price");

      const nuevoPrecio = parseFloat(input.value);

      if (isNaN(nuevoPrecio) || nuevoPrecio <= 0) {
        alert("❌ Ingresá un precio válido");
        return;
      }

      // 🔹 Guardar nuevo precio
      await actualizarPrecio(pid, nuevoPrecio);

      // 🔹 (Opcional) actualizar vista sin recargar
      span.textContent = `$${nuevoPrecio.toFixed(2)}`;
      span.style.display = "inline";
      input.style.display = "none";
      btnEditar.style.display = "inline-block";
      btnGuardar.style.display = "none";
    });
  });
});
