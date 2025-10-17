document.addEventListener("DOMContentLoaded", () => {
  const btnSave = document.getElementById("btn-save-name");
  const inputName = document.getElementById("input-name");
  const profileField = document.querySelector(".profile-field");
  const userId = "68efb7502fe44041dbb7056a";

  btnSave.addEventListener("click", async () => {
    const nuevoNombre = inputName.value.trim();

    if (!nuevoNombre) {
      alert("⚠️ El nombre no puede estar vacío");
      return;
    }
    console.log(userId);

    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nuevoNombre }),
      });

      const data = await res.json(); // 👈 lee el JSON del body

      console.log("🔹 Respuesta del servidor:", data);

      console.log(res);

      if (res.ok) {
        alert("✅ Nombre actualizado correctamente");

        // Actualiza el valor visible en la página sin recargar
        document.querySelector(".value-name").textContent = nuevoNombre;
      }

      alert("✅ Nombre actualizado correctamente");
      // location.reload();
    } catch (err) {
      console.error(err);
      alert("❌ " + err.message);
    }
  });
});
