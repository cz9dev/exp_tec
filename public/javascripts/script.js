document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const userAvatar = document.getElementById("user-avatar");
  const dropdownMenu = document.getElementById("dropdown-menu");

  // Manejar el menú toggle para colapsar/expandir
  if (menuToggle && sidebar) {
    menuToggle.addEventListener("click", function (e) {
      e.stopPropagation();
      sidebar.classList.toggle("collapsed");

      // Guardar el estado en localStorage
      const isCollapsed = sidebar.classList.contains("collapsed");
      localStorage.setItem("sidebarCollapsed", isCollapsed);
    });

    // Cargar estado inicial
    const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    if (isCollapsed) {
      sidebar.classList.add("collapsed");
    }
  }

  // Resto del código para el dropdown de usuario...
  if (userAvatar && dropdownMenu) {
    userAvatar.addEventListener("click", function (e) {
      e.stopPropagation();
      userAvatar.parentElement.classList.toggle("active");
      dropdownMenu.style.display =
        dropdownMenu.style.display === "block" ? "none" : "block";
    });

    document.addEventListener("click", function () {
      if (dropdownMenu) dropdownMenu.style.display = "none";
      if (userAvatar?.parentElement) {
        userAvatar.parentElement.classList.remove("active");
      }
    });

    dropdownMenu.addEventListener("click", function (e) {
      e.stopPropagation();
    });
  }

  // Ocultar alertas después de 5 segundos
  setTimeout(function () {
    document
      .querySelectorAll(".alert:not(.alert-dismissible)")
      .forEach((alert) => {
        alert.classList.add("d-none");
      });
  }, 5000);
});
