document.addEventListener("DOMContentLoaded", () => {
  const cid = getCookie("cid");

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  document
    .getElementById("btn-finalizarCompra")
    .addEventListener("click", async () => {
      if (!cid) return alert("❌ No se encontró el carrito.");
      const isLoggedIn = await fetch("/api/sessions/current")
        .then((res) => res.ok)
        .catch(() => false);

      if (!isLoggedIn)
        return alert("⚠️ Debes iniciar sesión para finalizar la compra.");

      const confirmar = confirm("¿Estás seguro de finalizar la compra?");
      if (!confirmar) return;

      const boton = document.getElementById("btn-finalizarCompra");
      boton.disabled = true;

      try {
        const res = await fetch(`/api/tickets/${cid}`, { method: "POST" });

        let data = {};
        try {
          data = await res.json();
        } catch (e) {
          return alert(
            "⚠️ Error inesperado. No se pudo leer la respuesta del servidor."
          );
        }

        const ticketId = data?.response?.ticketId;

        if (res.ok && ticketId) {
          window.location.href = `/ticket/${ticketId}`;
        } else {
          alert(
            "❌ No se pudo procesar la compra: " +
              (data?.response?.mensaje || "Error desconocido")
          );
          boton.disabled = false;
        }
      } catch (error) {
        console.error("❌ Error al finalizar compra:", error);
        alert("⚠️ Ocurrió un error inesperado.");
        boton.disabled = false;
      }
    });
});
