const API_BASE_URLS = [
  process.env.NEXT_PUBLIC_API_BASE_URL,
  'http://localhost:8000/api',
  'http://127.0.0.1:8000/api',
].filter((url, index, list) => Boolean(url) && list.indexOf(url) === index);

async function getApiErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallbackMessage;
  } catch {
    return fallbackMessage;
  }
}

export async function fetchHotels() {
  let lastNetworkError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/hotels`, { cache: 'no-store' });
      if (!response.ok) {
        const msg = await getApiErrorMessage(response, 'Failed to load hotels');
        throw new Error(msg);
      }
      return await response.json();
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      lastNetworkError = error;
    }
  }

  throw new Error(
    `Unable to reach hotels API. ${lastNetworkError?.message || ''}`.trim()
  );
}

export async function fetchHotel(id) {
  let lastNetworkError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/hotels/${id}`, { cache: 'no-store' });
      if (!response.ok) {
        const msg = await getApiErrorMessage(response, 'Hotel not found');
        throw new Error(msg);
      }
      return await response.json();
    } catch (error) {
      if (!(error instanceof TypeError)) throw error;
      lastNetworkError = error;
    }
  }

  throw new Error(
    `Unable to reach hotels API. ${lastNetworkError?.message || ''}`.trim()
  );
}
