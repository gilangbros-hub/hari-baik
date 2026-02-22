/**
 * OWASP-compliant error handling.
 * Maps internal Supabase errors to generic user-friendly messages.
 * Never exposes stack traces, SQL details, or internal error codes.
 */

const ERROR_MAP = {
    // Auth errors
    'invalid_credentials': 'Email atau password salah.',
    'email_not_confirmed': 'Akun belum dikonfirmasi.',
    'user_already_exists': 'Akun sudah terdaftar.',
    'email_provider_disabled': 'Pendaftaran email dinonaktifkan.',
    'over_email_send_rate_limit': 'Terlalu banyak percobaan. Coba lagi nanti.',
    'weak_password': 'Password terlalu lemah. Minimal 6 karakter.',
    'signup_disabled': 'Pendaftaran sementara ditutup.',

    // Database errors
    'PGRST116': 'Data tidak ditemukan.',
    '23505': 'Data sudah ada.',
    '23503': 'Referensi data tidak valid.',
    '42501': 'Akses ditolak.',
};

export function sanitizeError(error) {
    if (!error) return 'Terjadi kesalahan. Coba lagi.';

    const code = error.code || error.error_code || '';
    const mapped = ERROR_MAP[code];

    if (mapped) return mapped;

    // Fallback — never leak internal messages
    return 'Terjadi kesalahan. Coba lagi nanti.';
}

export function sendError(res, statusCode, error) {
    const message = typeof error === 'string' ? error : sanitizeError(error);
    return res.status(statusCode).json({ error: message });
}

export function sendSuccess(res, data, statusCode = 200) {
    return res.status(statusCode).json({ data });
}
