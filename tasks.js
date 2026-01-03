// tasks.js - Reusable Tasks & Gems Module for Fitted

const WORKER_URL = 'https://fitted.aihighstakes.workers.dev';

let currentUser = null;

const MILESTONES = [
  { id: "confirmed", text: "Email Confirmed", gems: 150, requiredRefs: 0 },
  { id: "friend", text: "Use a Ref", gems: 150, requiredRefs: 0 },
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
    const gemsEl = document.getElementById('gems-total');
    if (gemsEl) gemsEl.textContent = 'Gems Earned: 0';
    return;
  }

  // Safe update
  const gemsEl = document.getElementById('gems-total');
  if (gemsEl) {
    gemsEl.textContent = `Gems Earned: ${currentUser.gemsEarned || 0}`;
  }

  // Updated: "Your Progress" as separate heading above Gems Earned
  const gemsEarned = currentUser.gemsEarned || 0;
  const peopleAhead = (currentUser.rank ? currentUser.rank - 1 : 1293).toLocaleString();
  const refLink = `https://highstakes-ai.github.io/Odysseus/leaderboard.html?ref=${currentUser.code || 'YOURCODE'}`;

  container.innerHTML = `
  
    <div class="gems-earned-box">
      Gems Earned <img src="gem.png" alt="Gem" class="small-gem"> ${gemsEarned.toLocaleString()}
    </div>
  
    <div class="user-rank-info">
      <p class="people-ahead"><strong>${peopleAhead} People ahead of you</strong></p>
      <p class="motivation">Climb the ranks by referring more people.</p>
      
      <div class="user-stats-row">
        <div><strong>Rank:</strong> ${currentUser.rank || '—'}</div>
        <div><strong>Email:</strong> ${currentUser.email ? currentUser.email.split('@')[0] : '—'}</div>
        <div><strong>Refs:</strong> ${currentUser.referrals || 0}</div>
      </div>
    </div>

    <div class="share-section">
      <p class="share-title">Share Your Ref Code</p>
      <div class="ref-link-box">
        <span class="ref-link">${refLink}</span>
        <button class="copy-btn" onclick="TasksModule.copyRefLink('${refLink}')">Copy</button>
      </div>
    </div>

    <div class="milestone-list">
      ${MILESTONES.map(m => {
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
      }).join('')}
    </div>
  `;
}

// New function to copy ref link to clipboard
async function copyRefLink(link) {
  try {
    await navigator.clipboard.writeText(link);
    alert('Referral link copied to clipboard!');
  } catch (err) {
    console.error('Copy failed:', err);
    alert('Failed to copy – please select and copy manually.');
  }
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
  },
  copyRefLink
};

