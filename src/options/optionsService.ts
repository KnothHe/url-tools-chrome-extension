export const loadInitialSettings = async () => {
  return new Promise<string[]>((resolve) => {
    chrome.storage.local.get(['utmParams'], (result) => {
      if (result.utmParams) {
        resolve(result.utmParams);
      } else {
        resolve([]);
      }
    });
  });
};

export const addUTMParam = async (params: string[], newParam: string) => {
  if (newParam.trim() && !params.includes(newParam.trim())) {
    const updatedParams = [...params, newParam.trim()];
    await new Promise<void>((resolve) => {
      chrome.storage.local.set({ utmParams: updatedParams }, () => {
        chrome.runtime.sendMessage({ type: "settingsUpdated" });
        resolve();
      });
    });
    return updatedParams;
  }
  return params;
};

export const saveSettings = async (params: string[]) => {
  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ utmParams: params }, () => {
      chrome.runtime.sendMessage({ type: "settingsUpdated" });
      resolve();
    });
  });
};

export const updateJsonView = (params: string[]) => {
  return JSON.stringify(params, null, 2);
};

export const editJson = (json: string) => {
  try {
    const parsed = JSON.parse(json);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    throw new Error('Invalid JSON: Not an array');
  } catch {
    throw new Error('Invalid JSON format');
  }
};
