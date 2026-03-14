const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://127.0.0.1:8000/api';

export async function fetchOwnerDashboard(ownerId) {
  const query = ownerId ? `?owner_id=${ownerId}` : '';
  const response = await fetch(`${API_BASE_URL}/owner/dashboard${query}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error('Failed to load owner dashboard data');
  }

  return response.json();
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
    throw new Error('Failed to create room');
  }

  return response.json();
}

export async function updateOwnerRoomStatus(roomId, payload) {
  const response = await fetch(`${API_BASE_URL}/owner/rooms/${roomId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error('Failed to update room status');
  }

  return response.json();
}