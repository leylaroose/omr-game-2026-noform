// ===== GAME STATE =====
const state = {
  currentScreen: 1,
  currentRound: 0,
  answers: [null, null, null],
  giftSelected: null
};

// ===== SCREEN NAVIGATION =====
function showScreen(screenNumber) {
  document.querySelectorAll('.screen, .modal-overlay').forEach(el => {
    el.classList.remove('active');
  });

  const target = document.getElementById(`screen-${screenNumber}`);
  if (target) {
    target.classList.add('active');
  }

  // Screen 7 is an overlay on Screen 6 — keep Screen 6 visible
  if (screenNumber === 7) {
    document.getElementById('screen-6').classList.add('active');
  }

  state.currentScreen = screenNumber;

  // Toggle background layers: show raffle bg for screens 6/7, game bg otherwise
  const gameBg = document.getElementById('bg-game');
  const raffleBg = document.getElementById('bg-raffle');
  const headerShadow = document.getElementById('raffle-header-shadow');
  if (screenNumber === 6 || screenNumber === 7) {
    gameBg.style.display = 'none';
    raffleBg.classList.add('visible');
    if (headerShadow) headerShadow.classList.add('visible');
    updateRaffleBgGradient();
  } else {
    gameBg.style.display = '';
    raffleBg.classList.remove('visible');
    raffleBg.style.background = '';
    if (headerShadow) headerShadow.classList.remove('visible');
  }

  // Screen 7: show dark overlay background (hide T&C card)
  const bgTcLayer = document.getElementById('bg-tc');
  if (screenNumber === 7) {
    bgTcLayer.classList.add('visible', 'no-tc');
    const card = document.querySelector('.screen7-card');
    if (card) card.dataset.activeView = 'form';
  } else if (bgTcLayer.classList.contains('no-tc')) {
    // Leaving the form overlay: cross-fade — keep the form card rendered
    // while the dark layer's opacity transitions out.
    bgTcLayer.classList.remove('visible');
    setTimeout(() => bgTcLayer.classList.remove('no-tc'), 300);
  } else {
    bgTcLayer.classList.remove('visible', 'no-tc');
  }

  // Screen 5: slide modal in from the right after 1s
  if (screenNumber === 5) {
    const modal = document.querySelector('.screen5-modal');
    modal.classList.remove('visible');
    setTimeout(() => modal.classList.add('visible'), 400);
  }
}

function updateRaffleBgGradient() {
  const raffleBg = document.getElementById('bg-raffle');
  const header = document.querySelector('.raffle-header');
  if (!raffleBg || !header) return;
  const rect = header.getBoundingClientRect();
  const top = Math.max(0, rect.top);
  const bottom = rect.bottom;
  raffleBg.style.background = `linear-gradient(to bottom, #f5f5f5 ${top}px, #ffffff ${top}px, #ffffff ${bottom}px, #f5f5f5 ${bottom}px)`;
  const headerShadow = document.getElementById('raffle-header-shadow');
  if (headerShadow) headerShadow.style.top = `${bottom}px`;
}

if (typeof ResizeObserver !== 'undefined') {
  const ro = new ResizeObserver(() => {
    if (state.currentScreen === 6 || state.currentScreen === 7) {
      updateRaffleBgGradient();
    }
  });
  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.raffle-header');
    if (header) ro.observe(header);
  });
}

window.addEventListener('resize', () => {
  if (state.currentScreen === 6 || state.currentScreen === 7) {
    updateRaffleBgGradient();
  }
});

function resetGame() {
  state.currentScreen = 1;
  state.currentRound = 0;
  state.answers = [null, null, null];
  state.giftSelected = null;

  // Clear all round selections
  document.querySelectorAll('.option-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelectorAll('.options-grid').forEach(grid => {
    grid.classList.remove('has-selection');
  });
  document.querySelectorAll('.btn-round').forEach(btn => {
    btn.classList.remove('btn-active');
  });

  // Clear raffle selections and scroll the list back to the top
  document.querySelectorAll('.raffle-card').forEach(c => c.classList.remove('selected'));
  document.getElementById('raffle-count').textContent = '0/1';
  document.getElementById('raffle-bar-fill').style.width = '2%';
  const raffleList = document.getElementById('raffle-list');
  if (raffleList) raffleList.scrollTop = 0;

  // Hide screen 5 modal instantly so it doesn't slide out on next playthrough
  const screen5Modal = document.querySelector('.screen5-modal');
  if (screen5Modal) {
    screen5Modal.style.transition = 'none';
    screen5Modal.classList.remove('visible');
    void screen5Modal.offsetWidth;
    screen5Modal.style.transition = '';
  }

  showScreen(1);
}

// ===== IMAGE ERROR HANDLING =====
function handleImageError(img) {
  img.classList.add('img-fallback');
  img.alt = '';
  img.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>';
}

// ===== BUILD ROUND SCREENS =====
function buildRoundScreen(roundIndex) {
  const round = CONFIG.rounds[roundIndex];
  const screenNum = roundIndex + 2; // rounds are screens 2, 3, 4
  const container = document.querySelector(`#screen-${screenNum} .round-content`);
  const totalRounds = CONFIG.rounds.length;
  const isLastRound = roundIndex === totalRounds - 1;

  // Progress indicator
  const progress = document.createElement('div');
  progress.className = 'round-progress';
  progress.innerHTML = `
    <span class="round-progress-text">Round ${roundIndex + 1} of ${totalRounds}</span>
    <div class="round-progress-dots">
      ${CONFIG.rounds.map((_, i) => `<div class="progress-dot ${i <= roundIndex ? 'progress-dot-active' : ''}"></div>`).join('')}
    </div>
  `;

  // Persona card
  const persona = document.createElement('div');
  persona.className = 'glass-card persona-card';
  persona.innerHTML = `
    <div class="persona-info">
      <span class="persona-name">${round.persona.name}, ${round.persona.age}</span>
      <span class="persona-bought">bought a</span>
      <span class="persona-product">${round.purchaseLabel}</span>
    </div>
    <div class="persona-image-wrap">
      <img src="${round.purchaseImage}" alt="${round.purchaseLabel}" class="persona-image">
    </div>
  `;

  // Question
  const question = document.createElement('h2');
  question.className = 'round-question';
  question.textContent = round.question;

  const hint = document.createElement('p');
  hint.className = 'round-hint';
  hint.textContent = round.hint;

  // 2x2 options grid
  const grid = document.createElement('div');
  grid.className = 'options-grid';

  round.options.forEach((option, optIndex) => {
    const card = document.createElement('div');
    card.className = 'glass-card option-card';
    card.dataset.round = roundIndex;
    card.dataset.option = optIndex;
    card.innerHTML = `<img src="${option.image}" alt="${option.label}" class="option-image">`;

    card.addEventListener('click', () => {
      const wasSelected = card.classList.contains('selected');

      // Deselect all cards in this round
      grid.querySelectorAll('.option-card').forEach(c => c.classList.remove('selected'));

      if (wasSelected) {
        // Unselect — clear answer and dim button
        state.answers[roundIndex] = null;
        grid.classList.remove('has-selection');
        container.querySelector('.btn-round').classList.remove('btn-active');
      } else {
        // Select this card
        card.classList.add('selected');
        grid.classList.add('has-selection');
        state.answers[roundIndex] = optIndex;
        container.querySelector('.btn-round').classList.add('btn-active');
      }
    });

    grid.appendChild(card);
  });

  // Continue / Submit button
  const btn = document.createElement('button');
  btn.className = 'btn-primary btn-round';
  btn.textContent = isLastRound ? 'Finish' : 'Continue';

  btn.addEventListener('click', () => {
    if (state.answers[roundIndex] === null) return;
    if (isLastRound) {
      showScreen(5);
    } else {
      showScreen(screenNum + 1);
    }
  });

  // Sovendus logo (restart)
  const logo = document.createElement('img');
  logo.src = '../assets/Sovendus_Logo_Blue.svg';
  logo.alt = 'Sovendus';
  logo.className = 'logo-bottom logo-restart';
  logo.addEventListener('click', () => resetGame());

  container.appendChild(progress);
  container.appendChild(persona);
  container.appendChild(question);
  container.appendChild(hint);
  container.appendChild(grid);
  container.appendChild(btn);
  container.appendChild(logo);
}


// ===== BUILD RAFFLE SCREEN =====
function buildRaffleScreen() {
  const list = document.getElementById('raffle-list');

  const bagSVG = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20" class="raffle-cta-icon"><path fill="transparent" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667" d="M13.333 8.333a3.334 3.334 0 0 1-6.666 0M2.586 5.028h14.828"/><path fill="transparent" stroke="currentcolor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667" d="M2.833 4.556c-.216.288-.333.64-.333 1v11.11a1.667 1.667 0 0 0 1.667 1.667h11.666a1.667 1.667 0 0 0 1.667-1.666V5.556c0-.36-.117-.712-.333-1L15.5 2.333a1.67 1.67 0 0 0-1.333-.666H5.833a1.67 1.67 0 0 0-1.333.666z"/></svg>`;

  const checkSVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="raffle-cta-check"><path fill="rgba(255,255,255,0)" d="M0 0H24V24H0z"/><path d="m8.83 19.544-.013.012-7.071-7.071 2.121-2.121 4.962 4.962L20.157 4l2.121 2.121L8.843 19.556Z"/></svg>`;

  CONFIG.gifts.forEach((gift, index) => {
    const card = document.createElement('div');
    card.className = 'raffle-card';
    card.style.setProperty('--card-color', gift.bannerColor);

    const productHtml = gift.product
      ? `<img src="${gift.product}" alt="" class="raffle-banner-product">`
      : '';

    const descHtml = gift.description
      ? `<div class="raffle-card-desc">${gift.description}</div>`
      : '';

    const priceHtml = gift.cta
      ? `<div class="raffle-card-price">${gift.cta}</div>`
      : gift.price
        ? `<div class="raffle-card-price">Original price: ${gift.price}</div>`
        : '';

    card.innerHTML = `
      <div class="raffle-banner" style="background:${gift.bannerColor};">
        <img src="${gift.logo}" alt="${gift.brand}" class="raffle-banner-logo">
        ${productHtml}
      </div>
      <div class="raffle-card-content">
        <div class="raffle-card-text">
          <div class="raffle-card-name">${gift.name}</div>
          ${descHtml}
          ${priceHtml}
        </div>
        <button class="raffle-card-cta" type="button">
          ${bagSVG}
          ${checkSVG}
        </button>
      </div>
    `;

    card.addEventListener('click', () => {
      list.querySelectorAll('.raffle-card').forEach(c => c.classList.remove('selected'));
      card.classList.add('selected');
      state.giftSelected = `${gift.brand} ${gift.name}`;
      document.getElementById('raffle-count').textContent = '1/1';
      document.getElementById('raffle-bar-fill').style.width = '100%';
      setTimeout(() => showScreen(7), 600);
    });

    list.appendChild(card);
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  // Set up broken-image fallback for all images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => handleImageError(img));
  });

  // Build all round screens
  CONFIG.rounds.forEach((_, i) => buildRoundScreen(i));

  // Build raffle screen
  buildRaffleScreen();

  // Also attach error handlers to dynamically created images
  document.querySelectorAll('img').forEach(img => {
    img.addEventListener('error', () => handleImageError(img));
  });

  // Screen 1 — Start button → Ready (badge scan) screen
  document.getElementById('btn-start').addEventListener('click', () => {
    showScreen('ready');
  });

  // Screen Ready — proceed to round 1
  document.getElementById('btn-ready').addEventListener('click', () => {
    showScreen(2);
  });

  // Screen 8 — Play again button
  document.getElementById('btn-restart').addEventListener('click', () => {
    resetGame();
  });

  // Screen 5 — Pick now button
  document.getElementById('btn-pick-now').addEventListener('click', () => {
    showScreen(6);
  });

  // Screen 6 — T&C overlay toggle
  const bgTc = document.getElementById('bg-tc');
  document.getElementById('info-toggle').addEventListener('click', () => {
    bgTc.classList.toggle('visible');
  });
  function goBackToRaffle() {
    document.querySelectorAll('.raffle-card').forEach(c => c.classList.remove('selected'));
    state.giftSelected = null;
    document.getElementById('raffle-count').textContent = '0/1';
    document.getElementById('raffle-bar-fill').style.width = '2%';
    showScreen(6);
  }

  bgTc.addEventListener('click', (e) => {
    if (e.target === bgTc || (!e.target.closest('.tc-card') && !e.target.closest('.screen7-card'))) {
      // If on Screen 7, go back to raffle; otherwise dismiss T&C
      if (bgTc.classList.contains('no-tc')) {
        goBackToRaffle();
      } else {
        bgTc.classList.remove('visible');
      }
    }
  });

  // Screen 7 — Back button
  document.getElementById('screen7-back').addEventListener('click', goBackToRaffle);

  // Screen 7 — Legal views (terms & privacy) swap inside the card
  const screen7Card = document.querySelector('.screen7-card');
  function showScreen7View(view) {
    screen7Card.dataset.activeView = view;
    if (view !== 'form') {
      const scroll = screen7Card.querySelector(`[data-legal-view="${view}"] .screen7-legal-text`);
      if (scroll) scroll.scrollTop = 0;
    }
  }
  document.getElementById('link-terms').addEventListener('click', (e) => {
    e.preventDefault();
    showScreen7View('terms');
  });
  document.getElementById('link-privacy').addEventListener('click', (e) => {
    e.preventDefault();
    showScreen7View('privacy');
  });
  screen7Card.querySelectorAll('[data-legal-back]').forEach(btn => {
    btn.addEventListener('click', () => showScreen7View('form'));
  });

  // Screen 7 — Confirm participation & submit
  document.getElementById('screen7-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const roundLabel = (i) => {
      const idx = state.answers[i];
      return idx == null ? '' : CONFIG.rounds[i].options[idx].label;
    };
    const score = state.answers.reduce(
      (sum, idx, i) => sum + (idx === CONFIG.rounds[i].correctIndex ? 1 : 0),
      0
    );

    if (window.electronAPI && window.electronAPI.saveEntry) {
      window.electronAPI.saveEntry({
        round1: roundLabel(0),
        round2: roundLabel(1),
        round3: roundLabel(2),
        score,
        rafflePrize: state.giftSelected,
        fullName: '',
        company: '',
        companyEmail: ''
      }).then(result => {
        if (!result || !result.success) {
          console.error('Save failed:', result && result.error);
        }
      });
    }

    showScreen(8);
  });
});
