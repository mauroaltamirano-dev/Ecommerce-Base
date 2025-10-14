document.addEventListener("DOMContentLoaded", () => {
  const cid = getCookie("cid");

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  function formatNumber(num) {
    return Number(num).toLocaleString("es-AR");
  }

  document.querySelectorAll(".btn-sumar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-pid");

      const response = await fetch(
        `/api/carts/${cid}/products/${pid}/increment`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (response.ok) {
        const cantidadSpan = document.querySelector(
          `.cantidad[data-pid="${pid}"]`
        );
        const subtotalSpan = document.querySelector(
          `.subtotal[data-pid="${pid}"]`
        );

        if (cantidadSpan) cantidadSpan.textContent = data.quantity;
        if (subtotalSpan) {
          const total = data.quantity * data.price;
          subtotalSpan.textContent = formatNumber(total);
        }
      }
    });
  });

  document.querySelectorAll(".btn-restar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-pid");

      const response = await fetch(
        `/api/carts/${cid}/products/${pid}/decrement`,
        {
          method: "PATCH",
        }
      );

      const data = await response.json();

      if (response.ok) {
        const cantidadSpan = document.querySelector(
          `.cantidad[data-pid="${pid}"]`
        );
        const subtotalSpan = document.querySelector(
          `.subtotal[data-pid="${pid}"]`
        );
        const filaProducto = btn.closest("tr");

        if (data.quantity === 0 || data.eliminado) {
          location.reload();
        } else {
          if (cantidadSpan) cantidadSpan.textContent = data.quantity;
          if (subtotalSpan) {
            const total = data.quantity * data.price;
            subtotalSpan.textContent = formatNumber(total);
          }
        }
      }
    });
  });

  document.querySelectorAll(".btn-eliminar").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const pid = btn.getAttribute("data-pid");
      if (confirm("¿Estás seguro de que querés eliminar el producto?")) {
        await fetch(`/api/carts/${cid}/products/${pid}`, { method: "DELETE" });
        location.reload();
      }
    });
  });

  document
    .getElementById("btn-vaciarCarrito")
    .addEventListener("click", async () => {
      if (confirm("¿Estás seguro de que querés vaciar el carrito?")) {
        await fetch(`/api/carts/${cid}`, {
          method: "DELETE",
        });
        location.reload();
      }
    });
  document.getElementById("btn-comprar").addEventListener("click", async () => {
    try {
      const url = `/api/carts/${cid}/validate`;
      console.log("Llamando a:", url);
      
      const response = await fetch(url);
      const rawResponse = await response.text(); // Primero lee como texto
      console.log("Respuesta cruda:", rawResponse);

      // Intenta parsear solo si parece JSON
      const data = rawResponse.startsWith('{') ? JSON.parse(rawResponse) : rawResponse;
      
      if (!response.ok) {
        throw new Error(data.error || data.mensaje || "Error desconocido");
      }

      if (!data.valido) {
        return alert("❌ Carrito no válido");
      }

      if (confirm("¿Confirmar compra?")) {
        window.location.href = `/cart/${cid}/buyCart`;
      }
      
    } catch (error) {
      console.error("Error completo:", error);
      alert(`Error: ${error.message || "Verifica la consola"}`);
    }
  });
});
