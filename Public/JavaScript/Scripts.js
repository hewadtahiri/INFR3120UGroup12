window.addEventListener('DOMContentLoaded', event => {
  // Activates Bootstrap scrollspy on the main nav element.
  const mainNav = document.body.querySelector('#mainNav');
  if (mainNav) {
    new bootstrap.ScrollSpy(document.body, {
      target: '#mainNav',
      offset: 74,
    });
  }

  // Collapses responsive navbar when toggler is visible.
  const navbarToggler = document.body.querySelector('.navbar-toggler');
  const responsiveNavItems = [].slice.call(
    document.querySelectorAll('#navbarResponsive .nav-link')
  );
  responsiveNavItems.map(function (responsiveNavItem) {
    responsiveNavItem.addEventListener('click', () => {
      if (window.getComputedStyle(navbarToggler).display !== 'none') {
        navbarToggler.click();
      }
    });
  });
});

// Displays the edit reservations section.
function showEditSection(id) {
  const reservation = window.reservations.find(r => r.id === id);
  document.getElementById("customer_name").value = reservation.customer_name;
  document.getElementById("car_model").value = reservation.car_model;
  document.getElementById("reservation_date").value = reservation.reservation_date;
  document.getElementById("reservationId").value = reservation.id;
  document.getElementById("editForm").action = `/reservations/edit/${id}`;
  document.getElementById("editReservationSection").style.display = "block";
}

// Hides the edit reservations section.
function hideEditSection() {
  document.getElementById("editReservationSection").style.display = "none";
}