document.addEventListener('DOMContentLoaded', function() {
  const addButton = document.getElementById('addButton');
  const websiteInput = document.getElementById('website');
  const selectorsInput = document.getElementById('selectors');
  const statusDiv = document.getElementById('status');
  const savedList = document.getElementById('savedList');

  // Load saved websites
  loadSavedWebsites();

  addButton.addEventListener('click', async () => {
    const website = websiteInput.value.trim();
    const selectors = selectorsInput.value
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    if (!website || selectors.length === 0) {
      showStatus('Please enter both website and selectors', 'error');
      return;
    }

    try {
      // Get existing configurations
      const result = await chrome.storage.local.get('websiteConfigs');
      const websiteConfigs = result.websiteConfigs || {};

      // Add new configuration
      websiteConfigs[website] = {
        selectors: selectors
      };

      // Save updated configurations
      await chrome.storage.local.set({ websiteConfigs });

      // Update UI
      showStatus('Website added successfully!', 'success');
      websiteInput.value = '';
      selectorsInput.value = '';
      loadSavedWebsites();
    } catch (error) {
      showStatus('Error saving website: ' + error.message, 'error');
    }
  });

  async function loadSavedWebsites() {
    try {
      const result = await chrome.storage.local.get('websiteConfigs');
      const websiteConfigs = result.websiteConfigs || {};

      savedList.innerHTML = '';

      Object.entries(websiteConfigs).forEach(([website, config]) => {
        const websiteItem = document.createElement('div');
        websiteItem.className = 'website-item';

        const websiteInfo = document.createElement('div');
        websiteInfo.innerHTML = `
          <strong>${website}</strong><br>
          <small>Selectors:</small><br>
          <code style="display: block; margin-top: 5px; padding: 5px; background: #fff; border-radius: 3px;">
            ${config.selectors.join('<br>')}
          </code>
        `;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.className = 'delete-btn';
        deleteButton.onclick = () => deleteWebsite(website);

        websiteItem.appendChild(websiteInfo);
        websiteItem.appendChild(deleteButton);
        savedList.appendChild(websiteItem);
      });
    } catch (error) {
      showStatus('Error loading saved websites: ' + error.message, 'error');
    }
  }

  async function deleteWebsite(website) {
    try {
      const result = await chrome.storage.local.get('websiteConfigs');
      const websiteConfigs = result.websiteConfigs || {};

      delete websiteConfigs[website];
      await chrome.storage.local.set({ websiteConfigs });

      showStatus('Website deleted successfully!', 'success');
      loadSavedWebsites();
    } catch (error) {
      showStatus('Error deleting website: ' + error.message, 'error');
    }
  }

  function showStatus(message, type) {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    statusDiv.style.display = 'block';
    setTimeout(() => {
      statusDiv.style.display = 'none';
    }, 3000);
  }
});