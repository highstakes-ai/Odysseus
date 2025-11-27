// header.js – Reusable ShadowDrop Dashboard Header
// Usage: import { renderHeader } from 'https://cdn.jsdelivr.net/gh/highstakes-ai/Odysseus@main/header.js';
//        renderHeader();

export const renderHeader = () => {
  const headerHTML = `
    <header class="sd-header">
      <div class="sd-header-content">
        <h1 class="sd-header-title">Dashboard</h1>
        <button class="sd-menu-btn" aria-label="Open menu">Menu</button>
      </div>
    </header>
  `;

  // Insert at the very top of <body> (only once)
  if (!document.querySelector('.sd-header')) {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }
};
