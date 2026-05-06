/* auth.js — sesión compartida entre todas las páginas */
(function () {
  const SESSION_KEY = 'tv_session';

  function getSession() {
    try { return JSON.parse(localStorage.getItem(SESSION_KEY)); } catch { return null; }
  }

  function logout() {
    localStorage.removeItem(SESSION_KEY);
    /* redirigir al index desde cualquier nivel de carpeta */
    const depth = location.pathname.split('/pages/').length - 1;
    window.location.href = depth > 0 ? '../index.html' : 'index.html';
  }

  function initNav() {
    const session = getSession();
    const loginBtn = document.querySelector('.nav-login-btn');
    if (!loginBtn) return;

    if (!session) {
      /* sin sesión: botón normal */
      return;
    }

    /* con sesión: mostrar primer nombre + dropdown de logout */
    const firstName = session.name.split(' ')[0];
    loginBtn.textContent = firstName;
    loginBtn.removeAttribute('href');
    loginBtn.style.cursor = 'pointer';

    const wrapper = document.createElement('div');
    wrapper.className = 'nav-user-wrapper';
    loginBtn.parentNode.insertBefore(wrapper, loginBtn);
    wrapper.appendChild(loginBtn);

    const dropdown = document.createElement('div');
    dropdown.className = 'nav-user-dropdown';
    dropdown.innerHTML = `
      <div class="nav-user-info">${session.name}<br><small>${session.email}</small></div>
      <a href="${window.location.pathname.includes('/pages/') ? 'mis-tickets.html' : 'pages/mis-tickets.html'}" class="nav-dropdown-item">Mis Tickets</a>
      <a href="${window.location.pathname.includes('/pages/') ? 'configuracion.html' : 'pages/configuracion.html'}" class="nav-dropdown-item">Configuración</a>
      <button class="nav-logout-btn" id="logout-btn">Cerrar sesión</button>
    `;
    wrapper.appendChild(dropdown);

    loginBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      dropdown.classList.toggle('open');
    });

    document.addEventListener('click', () => dropdown.classList.remove('open'));

    document.getElementById('logout-btn').addEventListener('click', logout);
  }

  document.addEventListener('DOMContentLoaded', initNav);

  window.__tvAuth = { getSession, logout };
})();