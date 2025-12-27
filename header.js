// header.js - Reusable Fitted Header Module (vanilla JS - no modules)

document.addEventListener('DOMContentLoaded', () => {
  // Avoid injecting multiple headers if script loads twice
  if (document.querySelector('.fitted-header')) return;

  // Create header element
  const header = document.createElement('header');
  header.className = 'fitted-header';

  header.innerHTML = `
    <div class="header-container">
      <a href="/" class="logo-link">
        <img src="fitted_logo_black_transparent.png" alt="Fitted Logo" class="fitted-logo">
      </a>
      <button class="hamburger-menu" aria-label="Open menu">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  // Insert at the very top of body
  document.body.insertBefore(header, document.body.firstChild);

  // Optional: Add hamburger click (for future menu)
  const hamburger = header.querySelector('.hamburger-menu');
  hamburger.addEventListener('click', () => {
    alert('Menu clicked — add your mobile menu here!');
    // Replace with real menu toggle later
  });
});
