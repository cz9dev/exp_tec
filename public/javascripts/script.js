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
      
      // Actualizar tooltips después de cambiar el estado
      setupMenuTooltips();
    });

    // Cargar estado inicial
    const isCollapsed = localStorage.getItem("sidebarCollapsed") === "true";
    if (isCollapsed) {
      sidebar.classList.add("collapsed");
    }

    // Configurar tooltips para el menú
    setupMenuTooltips();
  }

  // Función para configurar tooltips en los ítems del menú
  function setupMenuTooltips() {
    const navLinks = document.querySelectorAll(".sidebar .nav-link");
    const isCollapsed = sidebar.classList.contains("collapsed");

    navLinks.forEach((link) => {
      // Eliminar tooltip existente si lo hay
      if (link._tippy) {
        link._tippy.destroy();
      }

      // Obtener el texto del menú
      const navText = link.querySelector(".nav-text");
      if (navText) {
        const tooltipText = navText.textContent;

        // Configurar tooltip solo si el sidebar está colapsado (CORRECCIÓN: quitamos el !)
        if (isCollapsed) {
          tippy(link, {
            content: tooltipText,
            placement: "right",
            animation: "fade",
            theme: "light",
            delay: [100, 0],
            appendTo: document.body,
          });
        }
      }
    });
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
  document.querySelectorAll(".alert").forEach((alert) => {
    setTimeout(() => {
      alert.style.transition = "opacity 0.5s";
      alert.style.opacity = "0";
      setTimeout(() => (alert.style.display = "none"), 500);
    }, 5000);
  });
});