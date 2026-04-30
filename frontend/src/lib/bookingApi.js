const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

async function getApiErrorMessage(response, fallback) {
  try {
    const data = await response.json();
    return data?.message || data?.error || fallback;
  } catch {
    return fallback;
  }
}

export async function fetchOwnerBookings(ownerId, status = null) {
  const query = status ? `?owner_id=${ownerId}&status=${status}` : `?owner_id=${ownerId}`;
  const response = await fetch(`${API_BASE_URL}/owner/bookings${query}`, { //send GET request to backend to fetch bookings for the owner with optional status filter
    cache: 'no-store',
  });
  if (!response.ok) throw new Error(await getApiErrorMessage(response, 'Failed to fetch bookings'));
  return await response.json(); //return data in the format { bookings: [...] } to frontend
}

export async function fetchPendingCount(ownerId) {
  const response = await fetch(`${API_BASE_URL}/owner/bookings/pending-count?owner_id=${ownerId}`, {
    cache: 'no-store',
  });
  if (!response.ok) return { pending_count: 0 };
  return await response.json();
}

export async function approveBooking(bookingId, startDate, endDate) {
  const response = await fetch(`${API_BASE_URL}/owner/bookings/${bookingId}/approve`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ start_date: startDate, end_date: endDate }),
  });
  if (!response.ok) throw new Error(await getApiErrorMessage(response, 'Failed to approve booking'));
  return await response.json();
}

export async function rejectBooking(bookingId) {
  const response = await fetch(`${API_BASE_URL}/owner/bookings/${bookingId}/reject`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) throw new Error(await getApiErrorMessage(response, 'Failed to reject booking'));
  return await response.json();
}

export async function createBooking(payload) {
  const response = await fetch(`${API_BASE_URL}/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error(await getApiErrorMessage(response, 'Failed to submit booking'));
  return await response.json();
}
