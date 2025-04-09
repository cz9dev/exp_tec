// script.js
document.addEventListener("DOMContentLoaded", function () {
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.getElementById("sidebar-toggle");

  sidebarToggle.addEventListener("click", function () {
    sidebar.classList.toggle("hide");
  });
});
