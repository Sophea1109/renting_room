const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_BASE_URLS = [
  configuredBaseUrl,
  'http://localhost:8000/api',
  'http://127.0.0.1:8000/api',
].filter((url, index, list) => Boolean(url) && list.indexOf(url) === index);

const API_BASE_URL = API_BASE_URLS[0];

async function getApiErrorMessage(response, fallbackMessage) {
  try {
    const data = await response.json();
    return (
      data?.message ||
      data?.error ||
      JSON.stringify(data?.errors || data) ||
      fallbackMessage
    );
  } catch {
    return fallbackMessage;
  }
}

export async function fetchOwnerDashboard(ownerId) {
  const query = ownerId ? `?owner_id=${ownerId}` : '';
  let lastNetworkError = null;

  for (const baseUrl of API_BASE_URLS) {
    try {
      const response = await fetch(`${baseUrl}/owner/dashboard${query}`, {
        cache: 'no-store',
      });

      if (!response.ok) {
        const apiMessage = await getApiErrorMessage(
          response,
          'Failed to load owner dashboard data'
        );
        throw new Error(
          `Dashboard API error (${response.status}): ${apiMessage}`
        );
      }

      return await response.json();
    } catch (error) {
      const isNetworkError = error instanceof TypeError;

      if (!isNetworkError) {
        throw error; // API responded but failed → stop
      }

      lastNetworkError = error; // try next URL
    }
  }

  throw new Error(
    `Unable to reach dashboard API at ${API_BASE_URLS.join(', ')}. ${
      lastNetworkError?.message || ''
    }`.trim()
  );
}

export async function createOwnerRoom(payload) {
  const response = await fetch(`${API_BASE_URL}/owner/rooms`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, 'Failed to create room')
    );
  }

  return await response.json();
}

export async function updateOwnerRoom(roomId, payload) {
  const response = await fetch(`${API_BASE_URL}/owner/rooms/${roomId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(await getApiErrorMessage(response, 'Failed to update room'));
  }

  return await response.json();
}

export async function updateOwnerRoomStatus(roomId, payload) {
  const response = await fetch(
    `${API_BASE_URL}/owner/rooms/${roomId}/status`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, 'Failed to update room status')
    );
  }

  return await response.json();
}

export async function deleteOwnerRoom(roomId) {
  const response = await fetch(`${API_BASE_URL}/owner/rooms/${roomId}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(response, 'Failed to delete room')
    );
  }

  return await response.json();
}

const ownerDashboardApi = {
  fetchOwnerDashboard,
  createOwnerRoom,
  updateOwnerRoom,
  updateOwnerRoomStatus,
  deleteOwnerRoom,
};

export default ownerDashboardApi;