export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api";
/* =========================================================
   TOKEN
========================================================= */
export const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

/* =========================================================
   CORE REQUEST
========================================================= */
export async function request(url, options = {}) {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.error("❌ Invalid JSON response:", text);
      throw new Error("Server returned invalid JSON");
    }

    // Handle 401 Unauthorized - Token expired
    if (res.status === 401) {
      console.error("❌ Authentication failed - token may be expired");
      //clearAuth();
      //if (typeof window !== "undefined") {
       // const isAuthPage = window.location.pathname === "/login" || 
         //                  window.location.pathname === "/register";
        //if (!isAuthPage) {
         // alert("Your session has expired. Please login again.");
          //window.location.href = "/login";
       /// }
      //}
      throw new Error(data?.message || "Session expired. Please login again.");
    }

    if (!res.ok) {
      console.error("❌ API ERROR:", data);
      throw new Error(data?.message || data?.error || `Request failed (${res.status})`);
    }

    return data;
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please check if backend is running.');
    }
    throw error;
  }
}

// Safe request for notifications (doesn't throw on 401)
async function safeRequest(url, options = {}) {
  const token = getAuthToken();
  const isFormData = options.body instanceof FormData;

  // Don't even try if no token
  if (!token) {
    console.log("No token found, skipping request");
    return null;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        Accept: "application/json",
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });

    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      console.warn("Invalid JSON response from safe request");
      return null;
    }

    // For 401, just return null (don't throw)
    if (res.status === 401) {
      console.log("Auth failed, skipping request");
      return null;
    }

    if (!res.ok) {
      console.warn(`Safe request failed with status ${res.status}`);
      return null;
    }

    return data;
  } catch (error) {
    console.warn("Safe request error:", error.message);
    return null;
  }
}

/* =========================================================
   AUTH
========================================================= */

export const loginApi = async (email, password) => {
  const data = await request(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (data?.access_token) {
    localStorage.setItem("token", data.access_token);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }

  return data;
};

export const logoutApi = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");

  return request(`${API_URL}/logout`, {
    method: "POST",
  });
};

export const fetchUser = () =>
  request(`${API_URL}/user`, { method: "GET" });

export const updateUserProfile = (payload) =>
  request(`${API_URL}/user`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

/* =========================================================
   OTP
========================================================= */

export const sendOtpApi = (email, telegram_id, telegram_username = null) =>
  request(`${API_URL}/send-otp`, {
    method: "POST",
    body: JSON.stringify({
      email,
      telegram_id,
      telegram_username,
    }),
  });

export const verifyOtpApi = (
  email,
  otp,
  name,
  password,
  password_confirmation,
  gender,
  telegramId,
  telegramUsername
) =>
  request(`${API_URL}/verify-otp`, {
    method: "POST",
    body: JSON.stringify({
      email,
      otp,
      name,
      password,
      password_confirmation,
      gender,
      telegram_id: telegramId,
      telegram_username: telegramUsername,
      is_new: true,
    }),
  });

/* =========================================================
   CHAT & NOTIFICATIONS (Aligned with Laravel Routes)
========================================================= */

// 1. Aligned with: api/chat/users
export const fetchChatUsers = () => 
  request(`${API_URL}/chat/users`, { method: "GET" });

// 2. Aligned with: api/chat/messages/{id}
export const fetchMessages = (userId) => 
  request(`${API_URL}/chat/messages/${userId}`, { method: "GET" });

// 3. Aligned with: api/chat/send
export const sendMessage = (receiverId, messageText) => 
  request(`${API_URL}/chat/send`, { 
    method: "POST", 
    body: JSON.stringify({
      receiver_id: receiverId,
      message: messageText,
    })
  });

// 4. Aligned with: api/messages/read/{id}
export const markMessagesAsRead = (senderId) => 
  request(`${API_URL}/messages/read/${senderId}`, { method: "PUT" });

// 5. Aligned with: api/unread-messages
export const fetchUnreadMessagesApi = () => 
  request(`${API_URL}/unread-messages`, { method: "GET" });
/* =========================================================
   AUTH HELPERS
========================================================= */

export const getCurrentUser = () => {
  if (typeof window === "undefined") return null;

  try {
    return JSON.parse(localStorage.getItem("user"));
  } catch {
    return null;
  }
};

export const clearAuth = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const isAuthenticated = () => {
  if (typeof window === "undefined") return false;
  return !!localStorage.getItem("token");
};

/* =========================================================
   AVATAR UPLOAD
========================================================= */

export const uploadAvatar = (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  return fetch(`${API_URL}/user/avatar`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      ...(getAuthToken() ? { Authorization: `Bearer ${getAuthToken()}` } : {}),
    },
    body: formData,
  }).then(async (res) => {
    const text = await res.text();
    let data;
    try {
      data = text ? JSON.parse(text) : {};
    } catch {
      throw new Error("Invalid server response");
    }
    if (!res.ok) {
      throw new Error(data?.message || "Upload failed");
    }
    return data;
  });
};

export const getAvatar = (userId) =>
  request(`${API_URL}/user/avatar/${userId}`, { method: "GET" });


/* =========================================================
   PROPERTY TYPES (ADMIN CRUD)
========================================================= */

// Fetch all property types
export const fetchPropertyTypes = () =>
  request(`${API_URL}/property-types`, { method: "GET" });

// Create a new property type
export const createPropertyType = (name) =>
  request(`${API_URL}/property-types`, {
    method: "POST",
    body: JSON.stringify({ name }),
  });

// Update an existing property type name by ID
export const updatePropertyType = (id, name) =>
  request(`${API_URL}/property-types/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });

// Delete a property type by ID
export const deletePropertyType = (id) =>
  request(`${API_URL}/property-types/${id}`, {
    method: "DELETE",
  });
/* =========================================================
   USERS (ADMIN) - FIXED
========================================================= */

export const fetchUsers = async () => {
  const url = `${API_URL}/users`;
  console.log("=========================================");
  console.log("📡 FETCHING USERS");
  console.log("URL:", url);
  console.log("API_URL env:", process.env.NEXT_PUBLIC_API_URL);
  console.log("=========================================");
  
  try {
    const response = await request(url, { method: "GET" });
    console.log("📦 Request response:", response);
    
    // Your backend returns: { users: [...] }
    if (response && response.users && Array.isArray(response.users)) {
      console.log("✅ Found users array with length:", response.users.length);
      return response.users;
    }
    
    if (Array.isArray(response)) {
      console.log("✅ Response is array with length:", response.length);
      return response;
    }
    
    console.warn("⚠️ Unexpected response format:", response);
    return [];
  } catch (error) {
    console.error("❌ fetchUsers failed:", error);
    throw error;
  }
};

export const createUser = (payload) =>
  request(`${API_URL}/users`, {
    method: "POST",
    body: JSON.stringify(payload),
  });

export const updateUser = (id, payload) =>
  request(`${API_URL}/users/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });

export const deleteUser = (id) =>
  request(`${API_URL}/users/${id}`, {
    method: "DELETE",
  });

/* =========================================================
   BOOKINGS & PAYMENTS (UPDATED AND ALIGNED)
========================================================= */

export const createBookingApi = async (payload) => {
  return request(`${API_URL}/bookings`, {
    method: "POST",
    body: JSON.stringify({
      unit_id: payload.unit_id,
      check_in: payload.check_in || payload.check_in_date, 
      check_out: payload.check_out || payload.check_out_date, 
      payment_method: payload.payment_method, 
      transaction_ref: payload.transaction_ref || null,
    }),
  });
};

export const fetchPaymentGatewayDetails = async (bookingId) => {
  return request(`${API_URL}/payment/gateway/${bookingId}`, { 
    method: "GET",
  });
};

export const captureVisaPaymentApi = async (bookingId, cardName) => {
  return request(`${API_URL}/payment/visa-checkout`, { 
    method: "POST",
    body: JSON.stringify({
      booking_id: bookingId,
      card_name: cardName,
    }),
  });
};

export const fetchBookingsApi = () => 
  request(`${API_URL}/bookings`, { method: "GET" });
/* =========================================================
   UNITS (CORRECT SYSTEM)
========================================================= */
// REPLACE your current fetchPropertiesApi with this:
export const fetchPropertiesApi = () => 
  request(`${API_URL}/properties`, { method: "GET" });

/* =========================================================
   PROPERTIES (UPDATED)
========================================================= */

// This uses your existing 'request' helper to include the Auth token
export const fetchProperties = () => 
  request(`${API_URL}/properties`, { method: "GET" });

export const deletePropertyApi = (id) => 
  request(`${API_URL}/properties/${id}`, { method: "DELETE" });

export const deleteUnitApi = (unitId) => 
  request(`${API_URL}/units/${unitId}`, { method: "DELETE" });

  

/* =========================================================
   UNITS (CORRECT SYSTEM)
========================================================= */

export const fetchUnitsByProperty = (propertyId) =>
  request(`${API_URL}/units/property/${propertyId}`, {
    method: "GET",
  });

export const createUnit = (data) =>
  request(`${API_URL}/units`, {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateUnit = (id, data) =>
  request(`${API_URL}/units/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteUnit = (id) =>
  request(`${API_URL}/units/${id}`, {
    method: "DELETE",
  });

  export const submitReview = async (data) => {
    const token = localStorage.getItem("token");
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
        "Accept": "application/json"
      },
      body: JSON.stringify(data),
    });
  
    const result = await response.json();
    if (!response.ok) throw new Error(result.message || "Failed to post review");
    return result;
  };
