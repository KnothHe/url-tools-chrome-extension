import { removeUTMParameters } from "@/utils/urlParser";

export const loadUTMParams = async () => {
  return new Promise<string[]>((resolve) => {
    chrome.storage.local.get(["options"], (result) => {
      if (result.options) {
        resolve(result.options);
      } else {
        resolve([]);
      }
    });
  });
};


export const getCurrentTabURL = async () => {
  const tabs = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  
  const [tab] = tabs;
  if (!tab?.url) {
    throw new Error('No active tab URL found');
  }

  if (tab.url.startsWith("chrome://") || tab.url.startsWith("chrome-extension://")) {
    throw new Error('Cannot access chrome internal pages');
  }

  return tab.url;
};

export const getClipboardURL = async () => {
  const text = await navigator.clipboard.readText();
  if (text && isValidUrl(text)) {
    return text;
  }
  throw new Error('Invalid URL in clipboard');
};

export const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const generateModifiedURL = (url: string, params: Record<string, string>) => {
  try {
    const parsedURL = new URL(url);
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.set(key, value);
    });
    parsedURL.search = searchParams.toString();
    return parsedURL.toString();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Invalid URL format: ${error.message}`);
    }
    throw new Error('Invalid URL format');
  }
};

export const removeUTMParams = (url: string, utmParams: string[]) => {
  const params = removeUTMParameters(url, utmParams);
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    searchParams.set(key, value);
  });

  const parsedURL = new URL(url);
  parsedURL.search = searchParams.toString();
  return parsedURL.toString();
};

export const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
};

export const openURLInCurrentTab = (url: string) => {
  chrome.tabs.update({ url });
};

export const openURLInNewTab = (url: string) => {
  chrome.tabs.create({ url });
};

export const openOptionsPage = () => {
  chrome.runtime.openOptionsPage();
};
