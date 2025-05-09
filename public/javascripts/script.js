// script.js
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
  });

  setTimeout(function () {
    const successAlert = document.getElementById("success-alert");
    if (successAlert) {
      successAlert.classList.add("d-none"); // Ocultar en lugar de eliminar
    }
    const errorAlert = document.getElementById("error-alert");
    if (errorAlert) {
      errorAlert.classList.add("d-none"); // Ocultar en lugar de eliminar
    }
  }, 5000); // 5000 milisegundos = 5 segundos

});
