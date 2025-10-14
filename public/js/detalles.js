document.addEventListener("DOMContentLoaded", () => {
  const cid = getCookie("cid");

  function getCookie(name) {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    return match ? match[2] : null;
  }

  // Cambiar imagen principal al hacer clic en una miniatura
  const image = document.querySelectorAll(".miniatura");
  const mainImage = document.getElementById("imagen-principal");

  image.forEach((image) => {
    image.addEventListener("click", () => {
      const newSrc = image.getAttribute("src");
      mainImage.setAttribute("src", newSrc);
    });
  });

  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      e.stopPropagation();
      const pid = btn.getAttribute("data-pid");

      if (!cid) {
        alert("Carrito no existente.");
        return;
      }

      await fetch(`/api/carts/${cid}/products/${pid}`, { method: "POST" });
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Producto agregado al carrito",
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true,
      });
    });
  });
});
