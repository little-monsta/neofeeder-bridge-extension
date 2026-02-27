const DEFAULT_ORIGINS = [
  'http://localhost:8100/*',
  'http://localhost:3003/*',
  'http://127.0.0.1:8100/*',
  'http://127.0.0.1:3003/*',
]

const STORAGE_KEY = 'neofeeder_cors_config'

// Chrome uses chrome.storage, Firefox uses browser.storage
const storage = typeof browser !== 'undefined' ? browser.storage : chrome.storage

document.addEventListener('DOMContentLoaded', async () => {
  const toggle = document.getElementById('enableToggle')
  const statusText = document.getElementById('statusText')
  const originList = document.getElementById('originList')
  const addOriginInput = document.getElementById('addOriginInput')
  const addOriginBtn = document.getElementById('addOriginBtn')
  const resetBtn = document.getElementById('resetBtn')

  const config = await getConfig()

  updateUI()

  toggle.addEventListener('change', async (e) => {
    config.enabled = e.target.checked
    await saveConfig()
    updateUI()
  })

  addOriginBtn.addEventListener('click', async () => {
    try {
      const newOrigin = addOriginInput.value.trim()
      if (newOrigin && !config.origins.includes(newOrigin)) {
        config.origins.push(newOrigin)
        await saveConfig()
        addOriginInput.value = ''
        updateUI()
      }
    } catch (error) {
      alert(`Error: ${error.message}`)
    }
  })

  addOriginInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      addOriginBtn.click()
    }
  })

  resetBtn.addEventListener('click', async () => {
    config.origins = [...DEFAULT_ORIGINS]
    config.enabled = true
    await saveConfig()
    updateUI()
  })

  async function getConfig() {
    const stored = await storage.local.get(STORAGE_KEY)
    const data = stored[STORAGE_KEY]

    if (data) {
      return data
    }

    return {
      origins: [...DEFAULT_ORIGINS],
      enabled: true,
    }
  }

  async function saveConfig() {
    await storage.local.set({
      [STORAGE_KEY]: config,
    })
  }

  function updateUI() {
    toggle.checked = config.enabled

    if (config.enabled) {
      statusText.textContent = 'Active'
      statusText.className = 'status-active'
    } else {
      statusText.textContent = 'Inactive'
      statusText.className = 'status-inactive'
    }

    originList.innerHTML = config.origins
      .map(
        (origin) => `
      <div class="origin-item">
        <span class="origin-text">${escapeHtml(origin)}</span>
        <button class="remove-btn" data-origin="${escapeHtml(origin)}">&times;</button>
      </div>
    `
      )
      .join('')

    for (const btn of originList.querySelectorAll('.remove-btn')) {
      btn.addEventListener('click', async (e) => {
        const origin = e.target.dataset.origin
        config.origins = config.origins.filter((o) => o !== origin)
        await saveConfig()
        updateUI()
      })
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }
})
