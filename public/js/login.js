document.addEventListener("DOMContentLoaded", () => {
  if (loginError) {
    Swal.fire({
      icon: "error",
      title: "Error al iniciar sesión",
      text: decodeURIComponent(loginError),
      confirmButtonText: "Reintentar",
    });
  }

  if (registroExitoso === "true") {
    Swal.fire({
      icon: "success",
      title: "Registro exitoso",
      text: "¡Ahora podés iniciar sesión!",
      confirmButtonText: "Continuar",
    });
  }
});
