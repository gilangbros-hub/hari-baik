/**
 * Frontend API wrapper.
 * All requests go to /api/* — never directly to Supabase.
 * Handles token management and error responses.
 */

const TOKEN_KEY = 'app_access_token';
const REFRESH_KEY = 'app_refresh_token';

export function getToken() {
    return sessionStorage.getItem(TOKEN_KEY);
}

export function setTokens(accessToken, refreshToken) {
    if (accessToken) sessionStorage.setItem(TOKEN_KEY, accessToken);
    if (refreshToken) sessionStorage.setItem(REFRESH_KEY, refreshToken);
}

export function clearTokens() {
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
}

async function request(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
    };

    const res = await fetch(url, {
        ...options,
        headers,
    });

    const json = await res.json();

    if (!res.ok) {
        throw new Error(json.error || 'Terjadi kesalahan.');
    }

    return json.data;
}

export const api = {
    // Auth
    async signup(email, password, name, role) {
        const data = await request('/api/auth/signup', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, role }),
        });
        if (data.session) {
            setTokens(data.session.access_token, data.session.refresh_token);
        }
        return data;
    },

    async login(email, password) {
        const data = await request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        if (data.session) {
            setTokens(data.session.access_token, data.session.refresh_token);
        }
        return data;
    },

    async logout() {
        try {
            await request('/api/auth/logout', { method: 'POST' });
        } finally {
            clearTokens();
        }
    },

    async getSession() {
        const token = getToken();
        if (!token) return null;
        try {
            return await request('/api/auth/session');
        } catch {
            clearTokens();
            return null;
        }
    },

    // Profile
    async getProfile() {
        return request('/api/profile');
    },

    async updateProfile(updates) {
        return request('/api/profile', {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    // Tasks
    async getTasks() {
        return request('/api/tasks');
    },

    async createTask(task) {
        return request('/api/tasks', {
            method: 'POST',
            body: JSON.stringify(task),
        });
    },

    async updateTask(id, updates) {
        return request('/api/tasks', {
            method: 'PUT',
            body: JSON.stringify({ id, ...updates }),
        });
    },

    async deleteTask(id) {
        return request('/api/tasks', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },

    // Budget
    async getBudgetCategories() {
        return request('/api/budget');
    },

    async createBudgetCategory(category) {
        return request('/api/budget', {
            method: 'POST',
            body: JSON.stringify(category),
        });
    },

    async updateBudgetCategory(id, updates) {
        return request('/api/budget', {
            method: 'PUT',
            body: JSON.stringify({ id, ...updates }),
        });
    },

    async deleteBudgetCategory(id) {
        return request('/api/budget', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },

    // Payments
    async getPayments() {
        return request('/api/payments');
    },

    async createPayment(payment) {
        return request('/api/payments', {
            method: 'POST',
            body: JSON.stringify(payment),
        });
    },

    async deletePayment(id) {
        return request('/api/payments', {
            method: 'DELETE',
            body: JSON.stringify({ id }),
        });
    },

    // Vendors
    async getVendors() {
        return request('/api/vendors');
    },
};
