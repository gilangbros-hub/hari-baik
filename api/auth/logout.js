import { supabaseAdmin } from '../_lib/supabase.js';
import { verifyAuth } from '../_lib/auth.js';
import { sendError, sendSuccess } from '../_lib/errors.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return sendError(res, 405, 'Method not allowed');
    }

    try {
        const { user, error } = await verifyAuth(req);
        if (error) {
            // Even if token is invalid, return success (user is "logged out" from their perspective)
            return sendSuccess(res, { message: 'Berhasil keluar.' });
        }

        // Revoke session server-side
        await supabaseAdmin.auth.admin.signOut(user.id);

        return sendSuccess(res, { message: 'Berhasil keluar.' });
    } catch {
        return sendSuccess(res, { message: 'Berhasil keluar.' });
    }
}
