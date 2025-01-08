function parseURL(url: string): URL | null {
  try {
    return new URL(url);
  } catch (error) {
    console.error("Invalid URL:", error);
    return null;
  }
}

function getURLParameters(url: string): Record<string, string> {
  const parsedURL = parseURL(url);
  if (!parsedURL) return {};

  const params: Record<string, string> = {};
  parsedURL.searchParams.forEach((value, key) => {
    params[key] = value;
  });
  return params;
}

function removeUTMParameters(url: string, utmParams: string[]): Record<string, string> {
  const parsedURL = parseURL(url);
  if (!parsedURL) return {};

  const params: Record<string, string> = {};
  parsedURL.searchParams.forEach((value, key) => {
    if (!utmParams.includes(key)) {
      params[key] = value;
    }
  });
  return params;
}

export { parseURL, getURLParameters, removeUTMParameters };
