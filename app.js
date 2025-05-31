// Mock email data
const MOCK_EMAILS = [
  {
    id: '1',
    from: 'alice@example.com',
    subject: 'Welcome to Inbox Zero!',
    date: '2024-06-01T09:00:00Z',
  },
  {
    id: '2',
    from: 'bob@example.com',
    subject: 'Your Invoice is Ready',
    date: '2024-06-02T14:30:00Z',
  },
  {
    id: '3',
    from: 'carol@example.com',
    subject: "Let's catch up soon",
    date: '2024-06-03T17:45:00Z',
  },
  {
    id: '4',
    from: 'dave@example.com',
    subject: 'Project Update',
    date: '2024-06-04T11:15:00Z',
  },
  {
    id: '5',
    from: 'eve@example.com',
    subject: 'Security Alert',
    date: '2024-06-05T08:20:00Z',
  },
]

const EMAILS_KEY = 'inboxzero_emails'
const SCORE_KEY = 'inboxzero_score'
const ONBOARD_KEY = 'inboxzero_onboarding'

function loadEmails() {
  const emails = localStorage.getItem(EMAILS_KEY)
  return emails ? JSON.parse(emails) : [...MOCK_EMAILS]
}
function saveEmails(emails) {
  localStorage.setItem(EMAILS_KEY, JSON.stringify(emails))
}
function loadScore() {
  return parseInt(localStorage.getItem(SCORE_KEY) || '0', 10)
}
function saveScore(score) {
  localStorage.setItem(SCORE_KEY, score)
}
function loadOnboarding() {
  return localStorage.getItem(ONBOARD_KEY) === 'dismissed'
}
function saveOnboarding() {
  localStorage.setItem(ONBOARD_KEY, 'dismissed')
}

function formatDate(dateStr) {
  const d = new Date(dateStr)
  return d.toLocaleString()
}

function showScoreBadge(points) {
  const badge = document.getElementById('score-badge')
  badge.textContent = `+${points} pts!`
  badge.classList.remove('hidden')
  badge.classList.add('show')
  setTimeout(() => {
    badge.classList.remove('show')
    setTimeout(() => badge.classList.add('hidden'), 300)
  }, 1200)
}

function renderInbox(emails) {
  const list = document.getElementById('inbox-list')
  const emptyMsg = document.getElementById('empty-message')
  list.innerHTML = ''
  if (emails.length === 0) {
    emptyMsg.classList.remove('hidden')
    return
  } else {
    emptyMsg.classList.add('hidden')
  }
  emails.forEach(email => {
    const item = document.createElement('div')
    item.className = 'email-item'
    item.innerHTML = `
      <div class="email-header">
        <span class="email-from">${email.from}</span>
        <span class="email-date">${formatDate(email.date)}</span>
      </div>
      <div class="email-subject">${email.subject}</div>
      <div class="email-actions">
        <button class="archive">Archive</button>
        <button class="delete">Delete</button>
      </div>
    `
    item.querySelector('.archive').onclick = () => handleAction(email.id, 'archive')
    item.querySelector('.delete').onclick = () => handleAction(email.id, 'delete')
    list.appendChild(item)
  })
}

function updateScore(score) {
  document.getElementById('score').textContent = score
  saveScore(score)
}

function handleAction(id, action) {
  let emails = loadEmails()
  let score = loadScore()
  emails = emails.filter(e => e.id !== id)
  saveEmails(emails)
  if (action === 'archive') {
    score += 5
    showScoreBadge(5)
  } else if (action === 'delete') {
    score += 3
    showScoreBadge(3)
  }
  updateScore(score)
  renderInbox(emails)
}

function dismissOnboarding() {
  document.getElementById('onboarding').style.display = 'none'
  saveOnboarding()
}

function init() {
  // Onboarding
  if (loadOnboarding()) {
    document.getElementById('onboarding').style.display = 'none'
  } else {
    document.getElementById('dismiss-onboarding').onclick = dismissOnboarding
  }
  // Score
  updateScore(loadScore())
  // Emails
  const emails = loadEmails()
  renderInbox(emails)
}

document.addEventListener('DOMContentLoaded', init) 