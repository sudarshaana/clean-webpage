// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('Clean Webpage extension installed');
});

// List of supported websites
const supportedWebsites = ['engnovate.com'];

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
  const url = new URL(tab.url);
  const hostname = url.hostname;

  if (supportedWebsites.some(site => hostname.includes(site))) {
    chrome.tabs.sendMessage(tab.id, { action: 'cleanPage' });
  } else {
    // Show notification for unsupported website
    chrome.notifications.create({
      type: 'basic',
      iconUrl: 'icons/icon128.png',
      title: 'Clean Webpage',
      message: `This website (${hostname}) is not supported. Currently supported websites: ${supportedWebsites.join(', ')}`
    });
  }
});