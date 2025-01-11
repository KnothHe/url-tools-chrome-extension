export interface OptionSetting {
  utmParams: string[];
  lang: string;
  theme: "light" | "dark";
  showAddUtmButton: boolean;
}

export const loadInitialSettings = async () => {
  return new Promise<OptionSetting>((resolve) => {
    chrome.storage.local.get(['options'], (result) => {
      if (result.options) {
        resolve(result.options);
      } else {
        resolve({ utmParams: [], lang: 'en', theme: 'light', showAddUtmButton: true });
      }
    });
  });
};

export const addUTMParam = async (params: string[], newParam: string) => {
  if (newParam.trim() && !params.includes(newParam.trim())) {
    return [...params, newParam.trim()];
  }
  return params;
};

export const saveSettings = async (optionSetting: OptionSetting) => {
  await new Promise<void>((resolve) => {
    chrome.storage.local.set({ options: optionSetting }, () => {
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
