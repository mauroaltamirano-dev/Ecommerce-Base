document.addEventListener("DOMContentLoaded", () => {
  const avatarBtn = document.getElementById("avatar-btn");
  const dropdown = document.getElementById("dropdown-menu");
  const cartCount = document.getElementById("cart-count");
  const cid = getCookie("cid");

  // --- Avatar dropdown ---
  if (avatarBtn && dropdown) {
    avatarBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.style.display =
        dropdown.style.display === "flex" ? "none" : "flex";
    });

    document.addEventListener("click", (e) => {
      if (!dropdown.contains(e.target) && !avatarBtn.contains(e.target)) {
        dropdown.style.display = "none";
      }
    });
  }

  // --- Mostrar cantidad del carrito ---
  async function showCartCount() {
    if (!cid || !cartCount) return;

    try {
      const response = await fetch(`/api/carts/${cid}/products`);
      const data = await response.json();

      const totalItems = data.response.length;
      cartCount.textContent = totalItems;

      // Ocultar si el carrito está vacío
      cartCount.style.display = totalItems > 0 ? "flex" : "none";
    } catch (err) {
      console.error("❌ Error al obtener carrito:", err);
    }
  }

  showCartCount();
});

function getCookie(name) {
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? match[2] : null;
}
