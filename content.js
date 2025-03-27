// Configuration for different websites
const websiteConfigs = {
  'engnovate.com': {
    selectors: [
      '.announcement-bar',
      '.entry-content',
      '.ielts-reading-comment-section',
      '.site-footer'
    ]
  }
  // Add more websites here in the same format
  // 'example.com': {
  //   selectors: [
  //     '.selector1',
  //     '.selector2'
  //   ]
  // }
};

// Function to get the current website's configuration
async function getCurrentWebsiteConfig() {
  const hostname = window.location.hostname;
  const result = await chrome.storage.local.get('websiteConfigs');
  const websiteConfigs = result.websiteConfigs || {};

  // Find matching website configuration
  for (const [website, config] of Object.entries(websiteConfigs)) {
    if (hostname.includes(website)) {
      return config;
    }
  }

  return null;
}

// Function to remove elements based on selectors
function removeElements(selectors) {
  let removedCount = 0;

  selectors.forEach(selector => {
    const elements = document.querySelectorAll(selector);
    elements.forEach(element => {
      element.remove();
      removedCount++;
    });
  });

  return removedCount;
}

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'cleanPage') {
    getCurrentWebsiteConfig().then(config => {
      if (config) {
        removeElements(config.selectors);
      }
    });
  }
});