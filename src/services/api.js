const BASE_URL = 'https://dev.api.saaradhigo.in/api/v1';

/**
 * Service for interacting with the VahanGo API.
 */
export const api = {
  /**
   * Request an OTP for a phone number.
   * @param {string} phoneNumber - The phone number (e.g., +919876543210).
   * @param {string} role - The user role (e.g., 'driver').
   */
  requestOTP: async (phoneNumber, role = 'driver') => {
    const response = await fetch(`${BASE_URL}/auth/otp/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, role }),
    });
    return response.json();
  },

  /**
   * Verify OTP and login.
   * @param {string} phoneNumber - The phone number.
   * @param {string} otp - The OTP received via SMS.
   * @param {string} deviceToken - Optional FCM/Device token.
   */
  login: async (phoneNumber, otp, deviceToken = 'web-client') => {
    const response = await fetch(`${BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone_number: phoneNumber, otp, device_token: deviceToken }),
    });
    return response.json();
  },

  /**
   * Update User Profile (Full Name, Avatar, etc.).
   * @param {string} token - JWT Access Token.
   * @param {Object} data - Profile data (full_name, email, avatar, etc.).
   */
  updateProfile: async (token, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${BASE_URL}/auth/update/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  /**
   * Update Driver Specific Profile (License details).
   * @param {string} token - JWT Access Token.
   * @param {Object} data - Driver details (license_expiry, license_doc).
   */
  updateDriver: async (token, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${BASE_URL}/driver/driver/update/`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },

  /**
   * Add a Vehicle to the driver's profile.
   * @param {string} token - JWT Access Token.
   * @param {Object} data - Vehicle details (vehicle_number, vehicle_type, etc.).
   */
  addVehicle: async (token, data) => {
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key]);
      }
    });

    const response = await fetch(`${BASE_URL}/driver/vehicles/add/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });
    return response.json();
  },
};
