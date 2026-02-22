import { supabaseAdmin } from '../_lib/supabase.js';
import { sendError, sendSuccess } from '../_lib/errors.js';

export default async function handler(req, res) {
    // OWASP: Only allow POST
    if (req.method !== 'POST') {
        return sendError(res, 405, 'Method not allowed');
    }

    try {
        const { email, password, name, role } = req.body || {};

        // Input validation
        if (!email || !password || !name) {
            return sendError(res, 400, 'Semua field wajib diisi.');
        }

        // Sanitize inputs
        const sanitizedName = String(name).trim().slice(0, 100);
        const sanitizedRole = ['CPP', 'CPW'].includes(role) ? role : 'CPP';
        const sanitizedEmail = String(email).trim().toLowerCase();

        if (sanitizedName.length < 1) {
            return sendError(res, 400, 'Nama tidak boleh kosong.');
        }

        if (String(password).length < 6) {
            return sendError(res, 400, 'Password minimal 6 karakter.');
        }

        // Format email if username-only
        const finalEmail = sanitizedEmail.includes('@')
            ? sanitizedEmail
            : `${sanitizedEmail.replace(/\s+/g, '')}@app.local`;

        // Create auth user
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email: finalEmail,
            password: String(password),
            email_confirm: true, // Auto-confirm — no email verification needed
        });

        if (authError) {
            return sendError(res, 400, authError);
        }

        // Create profile row (using admin client — bypasses RLS)
        const { error: profileError } = await supabaseAdmin.from('profiles').insert({
            id: authData.user.id,
            name: sanitizedName,
            role: sanitizedRole,
            mode: 'all-in-one',
        });

        if (profileError) {
            // Rollback: delete the auth user if profile creation fails
            await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
            return sendError(res, 500, profileError);
        }

        // Sign in to get session tokens
        const { data: sessionData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
            email: finalEmail,
            password: String(password),
        });

        if (signInError) {
            return sendError(res, 500, signInError);
        }

        return sendSuccess(res, {
            user: {
                id: authData.user.id,
                email: finalEmail,
            },
            session: {
                access_token: sessionData.session.access_token,
                refresh_token: sessionData.session.refresh_token,
                expires_at: sessionData.session.expires_at,
            },
        }, 201);
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
