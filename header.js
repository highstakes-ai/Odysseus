// header.js – Super clean ShadowDrop top bar
export const renderHeader = () => {
  const headerHTML = `
    <header class="sd-topbar">
      <div class="sd-topbar-inner">
        <span class="sd-topbar-title">dashboard</span>
        <button class="sd-hamburger" aria-label="Menu">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
      </div>
    </header>
  `;

  if (!document.querySelector('.sd-topbar')) {
    document.body.insertAdjacentHTML('afterbegin', headerHTML);
  }
};
