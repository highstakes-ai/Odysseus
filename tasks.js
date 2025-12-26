// tasks.js - Shared Tasks Tracker Module
// Used in leaderboard.html and confirm-success.html

const WORKER_URL = 'https://fitted.aihighstakes.workers.dev';

let currentUser = null; // { email, referrals, gemsEarned, confirmed, claimedMilestones }

const MILESTONES = [
  { id: "confirmed", text: "Email Confirmed", gems: 500, requiredRefs: 0 },
  { id: "3", text: "3 Referrals", gems: 500, requiredRefs: 3 },
  { id: "10", text: "10 Referrals", gems: 2000, requiredRefs: 10 },
  { id: "25", text: "25 Referrals", gems: 10000, requiredRefs: 25 },
  { id: "50", text: "50 Referrals", gems: 25000, requiredRefs: 50 }
];

function renderTasks(containerId = 'milestones', gemsTotalId = 'gems-total', feedbackId = 'claim-feedback') {
  const container = document.getElementById(containerId);
  const gemsTotal = document.getElementById(gemsTotalId);
  const feedback = document.getElementById(feedbackId);

  if (!container) return;

  if (feedback) feedback.textContent = '';

  if (!currentUser) {
    container.innerHTML = '<p style="text-align:center;color:#888;padding:1rem;">Enter your email to view your progress</p>';
    if (gemsTotal) gemsTotal.textContent = 'Gems Earned: 0';
    return;
  }

  if (gemsTotal) gemsTotal.textContent = `Gems Earned: ${currentUser.gemsEarned || 0}`;

  container.innerHTML = MILESTONES.map(m => {
    const isReached = m.id === "confirmed" 
      ? currentUser.confirmed 
      : (currentUser.referrals || 0) >= m.requiredRefs;

    const isClaimed = currentUser.claimedMilestones?.includes(m.id) || false;

    let buttonClass = 'locked';
    let buttonText = 'Locked';
    let onclick = '';

    if (isReached && !isClaimed) {
      buttonClass = 'claimable';
      buttonText = 'Claim';
      onclick = `onclick="claimGems('${m.id}', '${feedbackId}')"`
    } else if (isClaimed) {
      buttonClass = 'claimed';
      buttonText = 'Claimed!';
    }

    const check = isClaimed ? '✓' : '';

    return `
      <div class="milestone">
        <div class="milestone-left">
          <span class="milestone-check">${check}</span>
          <span class="milestone-text">${m.text}</span>
        </div>
        <div class="milestone-gems">
          ${m.gems}
          <img src="https://www.shutterstock.com/image-vector/blue-diamond-icon-polygonal-gem-260nw-2535489491.jpg" alt="Gem" class="small-gem">
        </div>
        <div class="milestone-button ${buttonClass}" ${onclick}>
          ${buttonText}
        </div>
      </div>
    `;
  }).join('');
}

async function claimGems(milestone, feedbackId = 'claim-feedback') {
  const feedback = document.getElementById(feedbackId);
  if (!feedback) return;

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
      renderTasks(); // Re-render all task modules
    } else {
      feedback.textContent = data.error || 'Error claiming';
      feedback.style.color = '#c53030';
    }
  } catch (err) {
    feedback.textContent = 'Network error';
    feedback.style.color = '#c53030';
  }

  setTimeout(() => feedback.textContent = '', 4000);
}

// Optional: expose for debugging or other pages
window.TasksModule = {
  setUser: (user) => { currentUser = user; renderTasks(); },
  render: renderTasks,
  claimGems
};
