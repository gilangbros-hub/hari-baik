import { verifyAuth } from '../_lib/auth.js';
import { supabaseAdmin } from '../_lib/supabase.js';
import { sendError, sendSuccess } from '../_lib/errors.js';

export default async function handler(req, res) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        return sendError(res, 405, 'Method not allowed');
    }

    try {
        const { user, error } = await verifyAuth(req);
        if (error) {
            return sendError(res, 401, error);
        }

        // Also fetch the profile
        const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

        return sendSuccess(res, {
            user: {
                id: user.id,
                email: user.email,
            },
            profile: profile || null,
        });
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
