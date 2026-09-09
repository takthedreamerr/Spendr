/* SPENDR — connected prototype state + interactions */

const root = document.documentElement;

const KEY = {
  theme: 'spendr-theme',
  state: 'spendr-state'
};

const categories = {
  food: 'Food',
  transport: 'Transport',
  entertainment: 'Entertainment',
  bills: 'Bills',
  shopping: 'Shopping',
  income: 'Income'
};

const defaults = {
  balance: 2480.42,
  budget: 1600,
  payday: '2026-09-11',

  transactions: [
    {
      id: 1,
      name: 'Woolworths',
      category: 'food',
      amount: 186,
      date: '2026-09-08'
    },
    {
      id: 2,
      name: 'Bolt',
      category: 'transport',
      amount: 94,
      date: '2026-09-08'
    },
    {
      id: 3,
      name: 'Mobile data',
      category: 'bills',
      amount: 149,
      date: '2026-09-07'
    },
    {
      id: 4,
      name: 'Campus food',
      category: 'food',
      amount: 72,
      date: '2026-09-06'
    },
    {
      id: 5,
      name: 'Spotify',
      category: 'bills',
      amount: 89,
      date: '2026-09-05'
    },
    {
      id: 6,
      name: 'Mr Price',
      category: 'shopping',
      amount: 420,
      date: '2026-09-04'
    },
    {
      id: 7,
      name: 'Checkers',
      category: 'food',
      amount: 286,
      date: '2026-09-03'
    },
    {
      id: 8,
      name: 'Uber',
      category: 'transport',
      amount: 110,
      date: '2026-09-02'
    },
    {
      id: 9,
      name: 'Netflix',
      category: 'bills',
      amount: 99,
      date: '2026-09-01'
    },
    {
      id: 10,
      name: 'Freelance payment',
      category: 'income',
      amount: 1200,
      date: '2026-09-01'
    },
    {
      id: 11,
      name: 'Night out',
      category: 'entertainment',
      amount: 340,
      date: '2026-08-30'
    }
  ],

  goals: [
    {
      id: 1,
      name: 'Cape Town trip',
      target: 6000,
      saved: 2350,
      date: '2026-12-15'
    },
    {
      id: 2,
      name: 'New headphones',
      target: 2800,
      saved: 1650,
      date: '2026-10-20'
    }
  ],

  cards: [
    {
      id: 1,
      nickname: 'Everyday Card',
      bank: 'FNB',
      type: 'Debit',
      last4: '4821',
      primary: true
    }
  ],

  budgets: {
    food: 300,
    transport: 200,
    entertainment: 250,
    bills: 300,
    shopping: 400
  },

  selectedCategory: null
};

function clone(x) {
  return JSON.parse(JSON.stringify(x));
}

function load() {
  try {
    return {
      ...clone(defaults),
      ...JSON.parse(localStorage.getItem(KEY.state) || '{}')
    };
  } catch {
    return clone(defaults);
  }
}

let state = load();

function renderAll() {
  if (document.getElementById('dashboardBalance')) {
    renderDashboard();
  }

  if (document.getElementById('transactionList')) {
    renderTransactions();
  }

  if (document.getElementById('goalsGrid')) {
    renderGoals();
  }
}

function persist() {
  localStorage.setItem(KEY.state, JSON.stringify(state));
  renderAll();
}

function money(n) {
  return 'R' + Number(n || 0).toLocaleString('en-ZA', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function money0(n) {
  return 'R' + Math.round(Number(n || 0)).toLocaleString('en-ZA');
}

function esc(s) {
  return String(s).replace(/[&<>"']/g, c => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }[c]));
}

function dateLabel(s) {
  if (!s) return '—';

  return new Date(s + 'T12:00:00').toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'short'
  }).toUpperCase();
}

function spent() {
  return state.transactions
    .filter(t => t.category !== 'income')
    .reduce((a, t) => a + Number(t.amount), 0);
}

function income() {
  return state.transactions
    .filter(t => t.category === 'income')
    .reduce((a, t) => a + Number(t.amount), 0);
}

function categoryTotal(c) {
  return state.transactions
    .filter(t => t.category === c)
    .reduce((a, t) => a + Number(t.amount), 0);
}

function goalSaved() {
  return state.goals.reduce((a, g) => a + Number(g.saved || 0), 0);
}

function safeToSpend() {
  return Math.max(0, state.balance - goalSaved());
}

function daysUntilPayday() {
  if (!state.payday) return 1;

  return Math.max(
    1,
    Math.ceil(
      (new Date(state.payday + 'T12:00:00') - new Date()) / 86400000
    )
  );
}

function today() {
  const d = new Date();

  return d.toLocaleDateString('en-ZA', {
    weekday: 'long',
    day: '2-digit',
    month: 'long'
  }).toUpperCase();
}

function applyTheme(t) {
  root.dataset.theme = t;

  localStorage.setItem(KEY.theme, t);

  document.querySelectorAll('.theme-toggle').forEach(b => {
    b.textContent = t === 'dark' ? '☼' : '◐';

    b.setAttribute(
      'aria-label',
      t === 'dark'
        ? 'Switch to light mode'
        : 'Switch to dark mode'
    );
  });
}

applyTheme(localStorage.getItem(KEY.theme) || 'dark');

document.querySelectorAll('.theme-toggle').forEach(b => {
  b.addEventListener('click', () => {
    applyTheme(
      root.dataset.theme === 'dark'
        ? 'light'
        : 'dark'
    );
  });
});

document.querySelectorAll('.magnetic').forEach(el => {

  el.addEventListener('mousemove', e => {

    const r = el.getBoundingClientRect();

    el.style.transform =
      `translate(${(e.clientX - r.left - r.width / 2) * .1}px,${(e.clientY - r.top - r.height / 2) * .1}px)`;
  });

  el.addEventListener('mouseleave', () => {
    el.style.transform = '';
  });

});

function showToast(msg) {

  const t = document.getElementById('toast');

  if (!t) return;

  t.textContent = msg;

  t.classList.add('show');

  clearTimeout(window.__toast);

  window.__toast = setTimeout(
    () => t.classList.remove('show'),
    2300
  );
}

function modal(id, open = true) {

  const m = document.getElementById(id);

  if (!m) return;

  m.classList.toggle('open', open);

  m.setAttribute(
    'aria-hidden',
    String(!open)
  );
}

document.querySelectorAll('[data-close-modal]').forEach(b => {

  b.addEventListener(
    'click',
    () => modal(b.dataset.closeModal, false)
  );

});

document.querySelectorAll('.modal-backdrop').forEach(m => {

  m.addEventListener('click', e => {

    if (e.target === m) {
      modal(m.id, false);
    }

  });

});

document.addEventListener('keydown', e => {

  if (e.key === 'Escape') {

    document
      .querySelectorAll('.modal-backdrop.open')
      .forEach(m => modal(m.id, false));

  }

});

function renderDashboard() {

  const bal = document.getElementById('dashboardBalance');

  if (!bal) return;

  const safe = safeToSpend();

  const commit = Math.max(
    0,
    state.balance - safe
  );

  const pct = state.balance
    ? Math.min(
        100,
        safe / state.balance * 100
      )
    : 0;

  bal.textContent = money(state.balance);

  document.getElementById('safeSpend').textContent =
    money(safe);

  document.getElementById('committedTotal').textContent =
    money(commit);

  document.getElementById('safePercent').textContent =
    Math.round(pct) + '%';

  document
    .getElementById('safeRing')
    .style
    .setProperty('--ring', pct + '%');

  document.getElementById('safeTrack').style.width =
    pct + '%';

  document.getElementById('todayLabel').textContent =
    today();

  document.getElementById('daysToPayday').textContent =
    state.payday
      ? `${daysUntilPayday()} day${daysUntilPayday() === 1 ? '' : 's'} to payday`
      : 'Set payday';

  const status =
    document.getElementById('financialStatus');

  status.textContent =
    safe < state.balance * .25
      ? 'Your buffer is getting thin.'
      : safe < state.balance * .5
        ? 'Your spending has some pressure.'
        : 'You have room to move.';

  document.getElementById('setupStrip').style.display =
    state.balance ? 'flex' : 'none';

  renderSpending();
  renderTimeline();
  renderWeekly();
  renderGoalMini();
  renderFlow();
  renderWallet();
}

function renderSpending() {

  const el = document.getElementById('spendingList');

  if (!el) return;

  const rows = Object.keys(categories)
    .filter(c => c !== 'income')
    .map(c => [c, categoryTotal(c)])
    .filter(x => x[1] > 0);

  const total = rows.reduce(
    (a, x) => a + x[1],
    0
  );

  el.innerHTML = rows.length

    ? rows.map(([c, v]) => {

        const planned =
          Number(state.budgets[c] || 0);

        const delta =
          v - planned;

        return `
          <div class="spend-row ${state.selectedCategory === c ? 'selected' : ''}" data-category="${c}">

            <span class="name">
              ${categories[c]}
            </span>

            <span class="amount">
              ${money(v)}
            </span>

            <div class="spend-bar">
              <i style="width:${total ? v / total * 100 : 0}%"></i>
            </div>

            <small class="spend-compare ${delta > 0 ? 'over' : ''}">
              Planned ${money(planned)} ·
              ${
                delta > 0
                  ? money(delta) + ' over'
                  : delta < 0
                    ? money(-delta) + ' under'
                    : 'on plan'
              }
            </small>

          </div>
        `;

      }).join('')

    : `
      <div class="wallet-empty">
        Your money hasn't started talking yet.<br>
        <button class="goal-add" id="emptyAddTx">
          Add your first transaction
        </button>
      </div>
    `;

  el
    .querySelectorAll('[data-category]')
    .forEach(x => {

      x.addEventListener('click', () => {

        state.selectedCategory =
          x.dataset.category;

        renderDashboard();

        showCategory(
          x.dataset.category
        );

      });

    });

  const add =
    document.getElementById('emptyAddTx');

  if (add) {
    add.addEventListener(
      'click',
      () => location.href = 'transactions.html'
    );
  }
}

function showCategory(c) {

  const drawer =
    document.getElementById('categoryContext');

  if (!drawer) return;

  drawer.classList.add('open');

  document.getElementById('contextTitle').textContent =
    categories[c];

  const tx =
    state.transactions.filter(
      t => t.category === c
    );

  const total =
    categoryTotal(c);

  const all =
    spent();

  document.getElementById('contextSummary').textContent =
    `${money(total)} across ${tx.length} transaction${tx.length === 1 ? '' : 's'} · ${all ? Math.round(total / all * 100) : 0}% of spending`;

  document.getElementById('contextTransactions').innerHTML =
    tx.slice(0, 4)
      .map(t => `
        <div class="context-tx">
          <span>${esc(t.name)}</span>
          <b>${money(t.amount)}</b>
        </div>
      `)
      .join('') ||
    '<div class="context-tx">No transactions yet.</div>';
}

const clearCat =
  document.getElementById('clearCategory');

if (clearCat) {

  clearCat.addEventListener('click', () => {

    state.selectedCategory = null;

    persist();

  });

}

function renderTimeline() {

  const el =
    document.getElementById('moneyTimeline');

  if (!el) return;

  const tx =
    [...state.transactions]
      .sort((a, b) => b.date.localeCompare(a.date))
      .slice(0, 4);

  const goal =
    state.goals[0];

  el.innerHTML =
    tx.length

      ? tx.map(t => `
          <div class="timeline-item ${t.category === 'income' ? 'income' : 'expense'}">

            <span class="timeline-dot"></span>

            <div>

              <b>
                ${esc(t.name).toUpperCase()}
              </b>

              <small>
                ${dateLabel(t.date)} ·
                ${t.category === 'income' ? '+' : '−'}
                ${money(t.amount)}
              </small>

            </div>

          </div>
        `).join('')

        +

        (
          goal

            ? `
              <div class="timeline-item next">

                <span class="timeline-dot"></span>

                <div>

                  <b>
                    ${esc(goal.name).toUpperCase()} GOAL
                  </b>

                  <small>
                    ${money(goal.target - goal.saved)} still to save
                  </small>

                </div>

              </div>
            `

            : ''
        )

      : `
        <div class="wallet-empty">
          Add transactions to build your timeline.
        </div>
      `;
}

function weekData() {

  const now = new Date();

  const out = [];

  for (let i = 6; i >= 0; i--) {

    const d = new Date(now);

    d.setHours(12, 0, 0, 0);

    d.setDate(
      d.getDate() - i
    );

    const iso =
      d.toISOString().slice(0, 10);

    out.push({
      iso,

      label:
        d.toLocaleDateString(
          'en-ZA',
          { weekday: 'short' }
        )
        .slice(0, 1)
        .toUpperCase(),

      value:
        state.transactions
          .filter(
            t =>
              t.date === iso &&
              t.category !== 'income'
          )
          .reduce(
            (a, t) => a + t.amount,
            0
          )
    });

  }

  return out;
}

function renderWeekly() {

  const el =
    document.getElementById('weeklyChart');

  if (!el) return;

  const data =
    weekData();

  const max =
    Math.max(
      ...data.map(x => x.value),
      1
    );

  const total =
    data.reduce(
      (a, x) => a + x.value,
      0
    );

  el.innerHTML =
    data.map(x => `
      <i
        class="chart-bar"
        data-tip="${x.label}: ${money(x.value)}"
        style="height:${Math.max(4, x.value / max * 100)}%"
      ></i>
    `).join('');

  document.getElementById('weeklyTotal').textContent =
    money(total);

  el
    .querySelectorAll('.chart-bar')
    .forEach((b, i) => {

      b.addEventListener('click', () => {

        el
          .querySelectorAll('.chart-bar')
          .forEach(x =>
            x.classList.remove('active')
          );

        b.classList.add('active');

        showToast(
          `${data[i].label}: ${money(data[i].value)} spent`
        );

      });

    });
}

function renderGoalMini() {

  const el =
    document.getElementById('goalMiniContent');

  if (!el) return;

  const g =
    state.goals[0];

  if (!g) {

    el.innerHTML = `
      <div class="goal-empty">

        <h2>
          Give your money somewhere to go.
        </h2>

        <p>
          Create your first goal in Goals.
        </p>

      </div>
    `;

    return;
  }

  const p =
    Math.min(
      100,
      g.saved / g.target * 100
    );

  el.innerHTML = `
    <div class="goal-title">

      <h3>
        ${esc(g.name)}
      </h3>

      <span>
        ${Math.round(p)}%
      </span>

    </div>

    <div class="goal-bar">
      <i style="width:${p}%"></i>
    </div>

    <div class="goal-money">

      <strong>
        ${money(g.saved)}
      </strong>

      <span>
        of ${money(g.target)}
      </span>

    </div>

    <p>
      ${money(Math.max(0, g.target - g.saved))}
      to go · target ${dateLabel(g.date)}
    </p>
  `;
}

function renderFlow() {

  const el =
    document.getElementById('moneyFlow');

  if (!el) return;

  const cats =
    Object.keys(categories)
      .filter(
        c =>
          c !== 'income' &&
          categoryTotal(c) > 0
      );

  const nodes = [
    ['balance', 'Balance', state.balance],
    ...cats.map(c => [
      c,
      categories[c],
      categoryTotal(c)
    ]),
    ['remaining', 'Remaining', safeToSpend()]
  ];

  el.innerHTML =
    nodes
      .map(
        (n, i) =>
          `${i ? '<span class="flow-arrow">→</span>' : ''}
          <div
            class="flow-node ${state.selectedCategory === n[0] ? 'selected' : ''}"
            data-flow="${n[0]}"
          >
            <strong>${n[1]}</strong>
            <span>${money(n[2])}</span>
          </div>`
      )
      .join('');

  el
    .querySelectorAll('[data-flow]')
    .forEach(n => {

      n.addEventListener('click', () => {

        if (
          n.dataset.flow === 'balance' ||
          n.dataset.flow === 'remaining'
        ) {

          showToast(
            `${n.dataset.flow === 'balance' ? 'Current balance' : 'Safe to spend'}: ${money(
              n.dataset.flow === 'balance'
                ? state.balance
                : safeToSpend()
            )}`
          );

        } else {

          state.selectedCategory =
            n.dataset.flow;

          renderDashboard();

          showCategory(
            n.dataset.flow
          );

        }

      });

    });
}

function renderWallet() {

  const el =
    document.getElementById('walletStack');

  if (!el) return;

  if (!state.cards.length) {

    el.innerHTML = `
      <div class="wallet-empty">

        Your wallet is looking light.<br>

        <button class="goal-add" id="emptyCard">
          Add a card
        </button>

      </div>
    `;

    document
      .getElementById('emptyCard')
      ?.addEventListener(
        'click',
        () => modal('cardModal')
      );

    return;
  }

  el.innerHTML =
    state.cards
      .map(c => `
        <div
          class="wallet-card-ui ${c.primary ? 'primary' : ''}"
          data-card="${c.id}"
        >

          <div class="card-top">

            <span class="card-bank">
              ${esc(c.bank)}
            </span>

            <span class="card-chip"></span>

          </div>

          <div class="card-number">
            •••• ${esc(c.last4)}
          </div>

          <div class="card-bottom">

            <span>
              ${esc(c.nickname)}
            </span>

            <span>
              ${c.primary ? 'PRIMARY' : 'SET PRIMARY'}
            </span>

          </div>

          <div class="card-actions">

            <button
              data-card-primary="${c.id}"
              aria-label="Set primary"
            >
              ✓
            </button>

            <button
              data-card-rename="${c.id}"
              aria-label="Rename card"
            >
              ✎
            </button>

            <button
              data-card-delete="${c.id}"
              aria-label="Remove card"
            >
              ×
            </button>

          </div>

        </div>
      `)
      .join('');

  el
    .querySelectorAll('[data-card-primary]')
    .forEach(b => {

      b.addEventListener('click', e => {

        e.stopPropagation();

        state.cards.forEach(
          c =>
            c.primary =
              String(c.id) ===
              b.dataset.cardPrimary
        );

        persist();

        showToast(
          'Primary card updated'
        );

      });

    });

  el
    .querySelectorAll('[data-card-rename]')
    .forEach(b => {

      b.addEventListener('click', e => {

        e.stopPropagation();

        const c =
          state.cards.find(
            x =>
              String(x.id) ===
              b.dataset.cardRename
          );

        if (!c) return;

        const name =
          prompt(
            'Card nickname',
            c.nickname
          );

        if (name && name.trim()) {

          c.nickname =
            name.trim();

          persist();

          showToast(
            'Card renamed'
          );

        }

      });

    });

  el
    .querySelectorAll('[data-card-delete]')
    .forEach(b => {

      b.addEventListener('click', e => {

        e.stopPropagation();

        if (state.cards.length === 1) {

          showToast(
            'Keep at least one card or remove it after adding another.'
          );

          return;
        }

        state.cards =
          state.cards.filter(
            c =>
              String(c.id) !==
              b.dataset.cardDelete
          );

        if (
          !state.cards.some(
            c => c.primary
          )
        ) {
          state.cards[0].primary = true;
        }

        persist();

        showToast(
          'Card removed'
        );

      });

    });
}

function updateAfford() {

  const input =
    document.getElementById('affordInput');

  if (!input) return;

  const price =
    Math.max(
      0,
      Number(input.value) || 0
    );

  const safe =
    safeToSpend();

  const after =
    safe - price;

  const days =
    daysUntilPayday();

  const daily =
    Math.max(
      0,
      after / days
    );

  const status =
    document.getElementById('affordStatus');

  const title =
    document.getElementById('affordTitle');

  const copy =
    document.getElementById('affordCopy');

  document.getElementById('afterPurchase').textContent =
    money(after);

  document.getElementById('dailyAllowance').textContent =
    money(daily);

  const decision =
    document.getElementById('decisionText');

  status.className =
    'result-status';

  if (!price) {

    status.innerHTML =
      '<span></span> ENTER A PURCHASE';

    title.innerHTML =
      'Put a number in.<br><em>SPENDR will do the maths.</em>';

    copy.textContent =
      'See what a purchase does to your safe-to-spend amount before you commit.';

    decision.textContent =
      '—';

    return;
  }

  if (after < 0) {

    status.classList.add('bad');

    status.innerHTML =
      '<span></span> OVER THE LINE';

    title.innerHTML =
      'That purchase needs<br><em>more room than you have.</em>';

    copy.textContent =
      `It is ${money(-after)} beyond your current safe-to-spend amount.`;

    decision.textContent =
      'NO';

  } else if (
    after <
    Math.max(
      250,
      safe * .25
    )
  ) {

    status.classList.add('warn');

    status.innerHTML =
      '<span></span> TIGHTER WEEK';

    title.innerHTML =
      'You can buy it.<br><em>But you will feel it.</em>';

    copy.textContent =
      `You would have ${money(after)} left for everything else before payday.`;

    decision.textContent =
      'CAREFUL';

  } else {

    status.classList.add('good');

    status.innerHTML =
      '<span></span> LOOKS COMFORTABLE';

    title.innerHTML =
      'The numbers say<br><em>you have room.</em>';

    copy.textContent =
      `You would still have ${money(after)} safe to spend.`;

    decision.textContent =
      'YES';
  }
}

const ai =
  document.getElementById('affordInput');

if (ai) {

  ai.addEventListener(
    'input',
    updateAfford
  );

  ai.addEventListener(
    'keydown',
    e => {

      if (e.key === 'Enter') {
        updateAfford();
      }

    }
  );

  updateAfford();
}

function renderTransactions() {

  const list =
    document.getElementById('transactionList');

  if (!list) return;

  const q =
    (
      document.getElementById('transactionSearch').value ||
      ''
    ).toLowerCase();

  const f =
    document
      .querySelector('.filter-btn.active')
      ?.dataset.filter ||
    'all';

  const sort =
    document.getElementById(
      'sortTransactions'
    ).value;

  let items =
    state.transactions.filter(
      t =>
        `${t.name} ${t.category}`
          .toLowerCase()
          .includes(q) &&
        (f === 'all' || t.category === f)
    );

  items.sort(
    (a, b) =>
      sort === 'oldest'
        ? a.date.localeCompare(b.date)
        : sort === 'high'
          ? b.amount - a.amount
          : sort === 'low'
            ? a.amount - b.amount
            : b.date.localeCompare(a.date)
  );

  list.innerHTML =
    items.length

      ? items.map(t => `
          <div class="transaction-row">

            <div class="tx-name">
              ${esc(t.name)}
            </div>

            <div class="tx-category">

              ${categories[t.category]}

              ${
                t.cardId
                  ? `
                    <small>
                      ${
                        esc(
                          state.cards.find(
                            c =>
                              String(c.id) ===
                              String(t.cardId)
                          )?.bank ||
                          'Card'
                        )
                      }
                      ••••
                      ${
                        esc(
                          state.cards.find(
                            c =>
                              String(c.id) ===
                              String(t.cardId)
                          )?.last4 ||
                          ''
                        )
                      }
                    </small>
                  `
                  : ''
              }

            </div>

            <div class="tx-date">
              ${dateLabel(t.date)}
            </div>

            <div class="tx-amount ${t.category === 'income' ? 'income' : ''}">
              ${t.category === 'income' ? '+' : '−'}
              ${money(t.amount)}
            </div>

            <button
              class="tx-edit"
              data-edit="${t.id}"
              aria-label="Edit ${esc(t.name)}"
            >
              ↗
            </button>

            <button
              class="tx-delete"
              data-delete="${t.id}"
              aria-label="Delete ${esc(t.name)}"
            >
              ×
            </button>

          </div>
        `).join('')

      : `
        <div class="transaction-row">

          <div class="tx-name">
            Nothing matches that search.
          </div>

        </div>
      `;

  list
    .querySelectorAll('[data-delete]')
    .forEach(b => {

      b.addEventListener(
        'click',
        () =>
          deleteTransaction(
            Number(b.dataset.delete)
          )
      );

    });

  list
    .querySelectorAll('[data-edit]')
    .forEach(b => {

      b.addEventListener(
        'click',
        () =>
          editTransaction(
            Number(b.dataset.edit)
          )
      );

    });

  document.getElementById('monthSpend').textContent =
    money(spent());

  document.getElementById('transactionCount').textContent =
    state.transactions.length;

  const uniqueCategories =
    new Set(
      state.transactions.map(
        t => t.category
      )
    ).size;

  document.getElementById('categoryCount').textContent =
    `Across ${uniqueCategories} categor${uniqueCategories === 1 ? 'y' : 'ies'}`;

  const top =
    Object.entries(categories)
      .filter(([c]) => c !== 'income')
      .sort(
        (a, b) =>
          categoryTotal(b[0]) -
          categoryTotal(a[0])
      )[0];

  document.getElementById('temperatureCopy').innerHTML =
    top &&
    categoryTotal(top[0])

      ? `
        <b>
          ${categories[top[0]]} is leading.
        </b>

        It currently makes up
        ${
          Math.round(
            categoryTotal(top[0]) /
            Math.max(1, spent()) *
            100
          )
        }%
        of your spending.
      `

      : 'Add transactions to see your spending pattern.';

  const tb =
    document.getElementById(
      'temperatureBars'
    );

  tb.innerHTML =
    Object.keys(categories)
      .filter(c => c !== 'income')
      .slice(0, 5)
      .map(
        c =>
          `<i style="height:${Math.min(
            100,
            15 +
              categoryTotal(c) /
              Math.max(1, spent()) *
              100
          )}%"></i>`
      )
      .join('');

  populateCardSelect();
}

function editTransaction(id) {

  const t =
    state.transactions.find(
      x => x.id === id
    );

  const f =
    document.getElementById(
      'transactionForm'
    );

  if (!t || !f) return;

  f.elements.name.value =
    t.name;

  f.elements.amount.value =
    t.amount;

  f.elements.category.value =
    t.category;

  f.elements.date.value =
    t.date;

  populateCardSelect();

  f.elements.card.value =
    t.cardId || '';

  f.dataset.editing =
    id;

  document.getElementById(
    'transactionSubmit'
  ).innerHTML =
    'Save changes <span>→</span>';

  modal(
    'transactionModal'
  );
}

function deleteTransaction(id) {

  const t =
    state.transactions.find(
      x => x.id === id
    );

  if (!t) return;

  state.transactions =
    state.transactions.filter(
      x => x.id !== id
    );

  state.balance +=
    t.category === 'income'
      ? -t.amount
      : t.amount;

  persist();

  showToast(
    `${t.name} removed`
  );
}

function populateCardSelect() {

  const s =
    document.getElementById(
      'transactionCard'
    );

  if (!s) return;

  s.innerHTML =
    '<option value="">No card</option>' +

    state.cards
      .map(
        c =>
          `<option value="${c.id}">
            ${esc(c.bank)} •••• ${esc(c.last4)}
          </option>`
      )
      .join('');
}

if (
  document.getElementById(
    'transactionList'
  )
) {

  renderTransactions();

  document
    .getElementById(
      'transactionSearch'
    )
    .addEventListener(
      'input',
      renderTransactions
    );

  document
    .getElementById(
      'sortTransactions'
    )
    .addEventListener(
      'change',
      renderTransactions
    );

  document
    .querySelectorAll('.filter-btn')
    .forEach(b => {

      b.addEventListener(
        'click',
        () => {

          document
            .querySelectorAll('.filter-btn')
            .forEach(x =>
              x.classList.remove('active')
            );

          b.classList.add('active');

          renderTransactions();

        }
      );

    });
}

const addTx =
  document.getElementById(
    'addTransactionBtn'
  );

if (addTx) {

  addTx.addEventListener(
    'click',
    () => {

      const f =
        document.getElementById(
          'transactionForm'
        );

      f.reset();

      delete f.dataset.editing;

      f.elements.date.value =
        new Date()
          .toISOString()
          .slice(0, 10);

      populateCardSelect();

      document.getElementById(
        'transactionSubmit'
      ).innerHTML =
        'Add to SPENDR <span>→</span>';

      modal(
        'transactionModal'
      );

    }
  );
}

const txForm =
  document.getElementById(
    'transactionForm'
  );

if (txForm) {

  txForm.addEventListener(
    'submit',
    e => {

      e.preventDefault();

      const fd =
        new FormData(txForm);

      const amount =
        Number(fd.get('amount'));

      if (!amount || amount <= 0) {
        return;
      }

      const category =
        fd.get('category');

      const editing =
        Number(
          txForm.dataset.editing || 0
        );

      if (editing) {

        const t =
          state.transactions.find(
            x => x.id === editing
          );

        if (t) {

          state.balance +=
            t.category === 'income'
              ? -t.amount
              : t.amount;

          t.name =
            fd.get('name').trim();

          t.amount =
            amount;

          t.category =
            category;

          t.date =
            fd.get('date');

          t.cardId =
            fd.get('card') || null;

          state.balance +=
            category === 'income'
              ? amount
              : -amount;

          showToast(
            'Transaction updated'
          );
        }

      } else {

        state.transactions.unshift({
          id: Date.now(),
          name: fd.get('name').trim(),
          amount,
          category,
          date: fd.get('date'),
          cardId: fd.get('card') || null
        });

        state.balance +=
          category === 'income'
            ? amount
            : -amount;

        showToast(
          'Transaction added'
        );
      }

      delete txForm.dataset.editing;

      persist();

      modal(
        'transactionModal',
        false
      );

      renderTransactions();

    }
  );
}

function renderGoals() {

  const grid =
    document.getElementById(
      'goalsGrid'
    );

  if (!grid) return;

  if (!state.goals.length) {

    grid.innerHTML = `
      <div class="goal-empty">

        <h2>
          Give your money somewhere to go.
        </h2>

        <p>
          Create a goal and make the trade-off visible.
        </p>

        <button
          class="button button-primary"
          id="emptyGoal"
        >
          + New goal
        </button>

      </div>
    `;

    document
      .getElementById('emptyGoal')
      .onclick =
      () => modal('goalModal');

    return;
  }

  grid.innerHTML =
    state.goals
      .map(g => {

        const p =
          Math.min(
            100,
            g.saved / g.target * 100
          );

        const rem =
          Math.max(
            0,
            g.target - g.saved
          );

        return `
          <article class="goal-card">

            <div class="goal-card-head">

              <span class="panel-label">
                ${dateLabel(g.date)} TARGET
              </span>

              <span class="goal-percentage">
                ${Math.round(p)}%
              </span>

            </div>

            <h2>
              ${esc(g.name)}
            </h2>

            <div class="goal-bar">
              <i style="width:${p}%"></i>
            </div>

            <div class="goal-money">

              <strong>
                ${money(g.saved)}
              </strong>

              <span>
                of ${money(g.target)}
              </span>

            </div>

            <div class="goal-card-foot">

              <span>
                ${money(rem)} remaining
              </span>

              <button
                class="goal-add"
                data-goal-add="${g.id}"
              >
                + Add money
              </button>

            </div>

            <div class="goal-actions">

              <button
                data-goal-delete="${g.id}"
              >
                Remove
              </button>

            </div>

          </article>
        `;
      })
      .join('');

  grid
    .querySelectorAll('[data-goal-add]')
    .forEach(b => {

      b.addEventListener(
        'click',
        () => {

          const amount =
            Number(
              prompt(
                'How much are you adding to this goal?',
                '200'
              )
            );

          if (!amount || amount <= 0) {
            return;
          }

          const g =
            state.goals.find(
              x =>
                x.id ==
                b.dataset.goalAdd
            );

          const room =
            g.target - g.saved;

          const add =
            Math.min(
              amount,
              room,
              state.balance
            );

          g.saved += add;

          state.balance -= add;

          persist();

          showToast(
            `${money(add)} moved into ${g.name}`
          );

        }
      );

    });

  grid
    .querySelectorAll('[data-goal-delete]')
    .forEach(b => {

      b.addEventListener(
        'click',
        () => {

          const g =
            state.goals.find(
              x =>
                x.id ==
                b.dataset.goalDelete
            );

          if (!g) return;

          if (
            confirm(
              `Remove ${g.name}? Its saved money will return to available balance.`
            )
          ) {

            state.balance +=
              g.saved;

            state.goals =
              state.goals.filter(
                x =>
                  x.id != g.id
              );

            persist();

            showToast(
              'Goal removed'
            );
          }

        }
      );

    });
}

if (
  document.getElementById(
    'goalsGrid'
  )
) {
  renderGoals();
}

const newGoal =
  document.getElementById(
    'newGoalBtn'
  );

if (newGoal) {

  newGoal.addEventListener(
    'click',
    () => modal('goalModal')
  );

}

const gf =
  document.getElementById(
    'goalForm'
  );

if (gf) {

  gf.addEventListener(
    'submit',
    e => {

      e.preventDefault();

      const fd =
        new FormData(gf);

      const target =
        Number(
          fd.get('target')
        );

      const saved =
        Math.min(
          Number(
            fd.get('saved')
          ) || 0,
          target,
          state.balance
        );

      if (!target || target <= 0) {
        return;
      }

      state.goals.unshift({
        id: Date.now(),
        name: fd.get('name').trim(),
        target,
        saved,
        date: fd.get('date')
      });

      state.balance -=
        saved;

      persist();

      gf.reset();

      modal(
        'goalModal',
        false
      );

      showToast(
        'Goal created'
      );

    }
  );
}

const editBalance =
  document.getElementById(
    'editBalanceBtn'
  );

const editBalance2 =
  document.getElementById(
    'editBalanceSecondary'
  );

function openBalance() {

  const f =
    document.getElementById(
      'balanceForm'
    );

  if (!f) return;

  f.elements.balance.value =
    state.balance;

  f.elements.budget.value =
    state.budget;

  f.elements.payday.value =
    state.payday || '';

  modal(
    'balanceModal'
  );
}

editBalance?.addEventListener(
  'click',
  openBalance
);

editBalance2?.addEventListener(
  'click',
  openBalance
);

const bf =
  document.getElementById(
    'balanceForm'
  );

if (bf) {

  bf.addEventListener(
    'submit',
    e => {

      e.preventDefault();

      const fd =
        new FormData(bf);

      state.balance =
        Math.max(
          0,
          Number(
            fd.get('balance')
          ) || 0
        );

      state.budget =
        Math.max(
          0,
          Number(
            fd.get('budget')
          ) || 0
        );

      state.payday =
        fd.get('payday') || '';

      persist();

      modal(
        'balanceModal',
        false
      );

      showToast(
        'Financial setup updated'
      );

    }
  );
}

const addCard =
  document.getElementById(
    'addCardBtn'
  );

addCard?.addEventListener(
  'click',
  () => modal('cardModal')
);

const cf =
  document.getElementById(
    'cardForm'
  );

if (cf) {

  cf.addEventListener(
    'submit',
    e => {

      e.preventDefault();

      const fd =
        new FormData(cf);

      const last =
        String(
          fd.get('last4')
        ).replace(
          /\D/g,
          ''
        );

      if (last.length !== 4) {

        showToast(
          'Enter the last four digits only'
        );

        return;
      }

      state.cards.push({
        id: Date.now(),
        nickname:
          fd.get('nickname').trim(),
        bank:
          fd.get('bank').trim(),
        type:
          fd.get('type'),
        last4:
          last,
        primary:
          state.cards.length === 0
      });

      persist();

      cf.reset();

      modal(
        'cardModal',
        false
      );

      showToast(
        'Card added to wallet'
      );

    }
  );
}

document
  .getElementById('resetDemo')
  ?.addEventListener(
    'click',
    () => {

      if (
        confirm(
          'Reset SPENDR to the portfolio demo data?'
        )
      ) {

        state =
          clone(defaults);

        persist();

        location.reload();
      }

    }
  );

if (
  document.getElementById(
    'dashboardBalance'
  )
) {
  renderDashboard();
}

if (
  document.querySelector(
    '.reveal'
  )
) {

  const io =
    new IntersectionObserver(
      es =>
        es.forEach(e => {

          if (e.isIntersecting) {

            e.target.classList.add(
              'visible'
            );

            io.unobserve(
              e.target
            );
          }

        }),
      {
        threshold: .12
      }
    );

  document
    .querySelectorAll('.reveal')
    .forEach(e =>
      io.observe(e)
    );
}

/* Interactive landing-page money core */

(function setupHeroCore() {

  const core =
    document.getElementById(
      'heroMoneyCore'
    );

  if (!core) return;

  const label =
    document.getElementById(
      'heroCoreLabel'
    );

  const value =
    document.getElementById(
      'heroCoreValue'
    );

  const hint =
    document.getElementById(
      'heroCoreHint'
    );

  const signal =
    document.getElementById(
      'heroSignal'
    );

  const signalTitle =
    document.getElementById(
      'heroSignalTitle'
    );

  const signalCopy =
    document.getElementById(
      'heroSignalCopy'
    );

  const inValue =
    document.getElementById(
      'heroInValue'
    );

  const committed =
    document.getElementById(
      'heroCommittedValue'
    );

  const decision =
    document.getElementById(
      'heroDecisionValue'
    );

  const decisionLabel =
    document.getElementById(
      'heroDecisionLabel'
    );

  const states = [

    {
      label: 'SAFE TO SPEND',
      value: 'R1 860',
      hint: 'after commitments',
      title: 'YOU HAVE ROOM',
      copy: 'Your essentials are covered. There is room for a decision.',
      in: '+ R1 200',
      commit: '− R620',
      decision: 'R350?',
      decisionLabel: 'next decision',
      tone: 'good'
    },

    {
      label: 'AFTER A R350 SPEND',
      value: 'R1 510',
      hint: 'still within your range',
      title: 'YOU CAN DO IT',
      copy: 'The purchase fits. You would still keep a useful buffer.',
      in: '+ R1 200',
      commit: '− R970',
      decision: 'R1 510',
      decisionLabel: 'left afterwards',
      tone: 'good'
    },

    {
      label: 'IF YOU PUSH IT',
      value: 'R860',
      hint: 'buffer gets thinner',
      title: 'WATCH THE BUFFER',
      copy: 'Nothing is technically wrong — but the next few choices matter more.',
      in: '+ R1 200',
      commit: '− R1 340',
      decision: 'R860',
      decisionLabel: 'left afterwards',
      tone: 'tight'
    }

  ];

  let index = 0;

  function show(i) {

    const d =
      states[i];

    core.dataset.heroState =
      String(i);

    label.textContent =
      d.label;

    value.textContent =
      d.value;

    hint.textContent =
      d.hint;

    signalTitle.textContent =
      d.title;

    signalCopy.textContent =
      d.copy;

    inValue.textContent =
      d.in;

    committed.textContent =
      d.commit;

    decision.textContent =
      d.decision;

    decisionLabel.textContent =
      d.decisionLabel;

    signal.className =
      'hero-signal show ' +
      (
        d.tone === 'tight'
          ? 'tight'
          : ''
      );

    clearTimeout(
      window.__heroSignalTimer
    );

    window.__heroSignalTimer =
      setTimeout(
        () =>
          signal.classList.remove(
            'show'
          ),
        4200
      );
  }

  core.addEventListener(
    'click',
    () => {

      index =
        (index + 1) %
        states.length;

      show(index);

    }
  );

  core.addEventListener(
    'keydown',
    e => {

      if (
        e.key === 'Enter' ||
        e.key === ' '
      ) {

        e.preventDefault();

        core.click();
      }

    }
  );

  setTimeout(
    () =>
      signal.classList.add(
        'show'
      ),
    900
  );

  setTimeout(
    () =>
      signal.classList.remove(
        'show'
      ),
    5000
  );

})();