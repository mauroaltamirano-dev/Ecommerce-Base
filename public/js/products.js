document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("productForm");

  // 🟢 Si hay formulario, configuramos el submit (crear o editar)
  if (form) {
    const productId = form.dataset.id;
    const isEdit = Boolean(productId);

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = {
        title: form.title.value.trim(),
        price: parseFloat(form.price.value),
        stock: parseInt(form.stock.value) || 0,
        code: form.code.value.trim(),
        category: form.category.value,
        image: form.image.value.trim(),
        description: form.description.value.trim(),
      };

      const url = isEdit ? `/api/products/${productId}` : "/api/products";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        alert(isEdit ? "✅ Producto actualizado" : "✅ Producto creado");
        window.location.href = "/realtimeproducts";
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.mensaje);
      }
    });
  }

  // 🟢 Esto debe ejecutarse SIEMPRE (aunque no haya form)
  document.querySelectorAll(".btn-editar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-id");
      console.log("📝 ID del producto a editar:", pid);
      location.href = `/createproduct/${pid}`;
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-id");
      if (confirm("¿Estás seguro de eliminar este producto?")) {
        const res = await fetch(`/api/products/${pid}`, { method: "DELETE" });
        if (res.ok) {
          alert("🗑️ Producto eliminado");
          location.reload();
        } else {
          alert("❌ Error al eliminar el producto");
        }
      }
    });
  });
});
