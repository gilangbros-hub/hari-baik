import { supabaseAdmin } from '../_lib/supabase.js';
import { sendError, sendSuccess } from '../_lib/errors.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return sendError(res, 405, 'Method not allowed');
    }

    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return sendError(res, 400, 'Email dan password wajib diisi.');
        }

        const sanitizedEmail = String(email).trim().toLowerCase();
        const finalEmail = sanitizedEmail.includes('@')
            ? sanitizedEmail
            : `${sanitizedEmail.replace(/\s+/g, '')}@app.local`;

        const { data, error } = await supabaseAdmin.auth.signInWithPassword({
            email: finalEmail,
            password: String(password),
        });

        if (error) {
            return sendError(res, 401, error);
        }

        return sendSuccess(res, {
            user: {
                id: data.user.id,
                email: data.user.email,
            },
            session: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                expires_at: data.session.expires_at,
            },
        });
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
