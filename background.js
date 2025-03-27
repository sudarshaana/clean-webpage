// Default website configurations
const defaultConfigs = {
  'engnovate.com': {
    selectors: [
      '.announcement-bar',
      '.entry-content',
      '.ielts-reading-comment-section',
      '.site-footer'
    ]
  }
};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Clean Webpage extension installed');

  // Add default configurations if they don't exist
  const result = await chrome.storage.local.get('websiteConfigs');
  const websiteConfigs = result.websiteConfigs || {};

  // Merge default configs with existing ones
  const updatedConfigs = {
    ...defaultConfigs,
    ...websiteConfigs
  };

  // Save the merged configurations
  await chrome.storage.local.set({ websiteConfigs: updatedConfigs });
});

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  const url = new URL(tab.url);
  const hostname = url.hostname;

  // Get stored configurations
  const result = await chrome.storage.local.get('websiteConfigs');
  const websiteConfigs = result.websiteConfigs || {};

  // Check if current website is supported
  const isSupported = Object.keys(websiteConfigs).some(website =>
    hostname.includes(website)
  );

  if (isSupported) {
    chrome.tabs.sendMessage(tab.id, { action: 'cleanPage' });
  } else {
    // Show notification for unsupported website
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Clean Webpage',
      message: `This website (${hostname}) is not supported. Right-click the extension icon and select "Options" to add new websites.`
    });
  }
});