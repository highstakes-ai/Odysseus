// tasks.js - Reusable Tasks & Gems Module for Fitted

const WORKER_URL = 'https://fitted.aihighstakes.workers.dev';

let currentUser = null;

const MILESTONES = [
  { id: "confirmed", text: "Email Confirmed", gems: 500, requiredRefs: 0 },
  { id: "3", text: "3 Referrals", gems: 500, requiredRefs: 3 },
  { id: "10", text: "10 Referrals", gems: "2,000", requiredRefs: 10 },
  { id: "25", text: "25 Referrals", gems: "10,000", requiredRefs: 25 },
  { id: "50", text: "50 Referrals", gems: "25,000", requiredRefs: 50 }
];

function renderMilestones() {
  const container = document.getElementById('milestones');
  const feedback = document.getElementById('claim-feedback');

  if (!container) return;

  feedback.textContent = '';

  if (!currentUser) {
    container.innerHTML = '<p style="text-align:center;color:#888;">Enter your email above to view progress</p>';
    document.getElementById('gems-total').textContent = 'Gems Earned: 0';
    return;
  }

  document.getElementById('gems-total').textContent = `Gems Earned: ${currentUser.gemsEarned || 0}`;

  container.innerHTML = MILESTONES.map(m => {
    const isReached = m.id === "confirmed" ? currentUser.confirmed : (currentUser.referrals || 0) >= m.requiredRefs;
    const isClaimed = currentUser.claimedMilestones?.includes(m.id) || false;

    let buttonClass = 'locked';
    let buttonText = 'Locked';
    let onclick = '';
    let cursor = 'default';

    if (isReached && !isClaimed) {
      buttonClass = 'claimable';
      buttonText = 'Claim';
      onclick = `onclick="TasksModule.claimGems('${m.id}')"`
      cursor = 'pointer';
    } else if (isClaimed) {
      buttonClass = 'claimed';
      buttonText = 'Claimed!';
      cursor = 'default';
    }

    const check = isClaimed ? '✓' : '';

    return `
      <div class="milestone">
        <div class="milestone-left">
          <span class="milestone-check">${check}</span>
          <span class="milestone-text">${m.text}</span>
        </div>
        <div class="milestone-gems">
          <span class="gem-amount">${m.gems}</span>
          <img src="gem.png" alt="Gem" class="small-gem">
        </div>
        <div class="milestone-button ${buttonClass}" style="cursor:${cursor};" ${onclick}>
          ${buttonText}
        </div>
      </div>
    `;
  }).join('');
}

async function claimGems(milestone) {
  const feedback = document.getElementById('claim-feedback');
  if (!feedback || !currentUser) return;

  feedback.textContent = 'Claiming...';
  feedback.style.color = '#000';

  try {
    const res = await fetch(`${WORKER_URL}/claim`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: currentUser.email, milestone })
    });
    const data = await res.json();

    if (data.success) {
      currentUser.gemsEarned = data.totalGems;
      if (!currentUser.claimedMilestones) currentUser.claimedMilestones = [];
      currentUser.claimedMilestones.push(milestone);
      feedback.textContent = `+${data.gemsAdded} gems claimed!`;
      feedback.style.color = '#2e8b57';
      renderMilestones();
    } else {
      feedback.textContent = data.error || 'Error claiming';
      feedback.style.color = '#c53030';
    }
  } catch {
    feedback.textContent = 'Network error';
    feedback.style.color = '#c53030';
  }

  setTimeout(() => feedback.textContent = '', 4000);
}

window.TasksModule = {
  render: renderMilestones,
  claimGems,
  setUser: (user) => {
    currentUser = user;
    renderMilestones();
  }
};

