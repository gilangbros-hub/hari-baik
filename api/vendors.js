import { verifyAuth } from './_lib/auth.js';
import { supabaseAdmin } from './_lib/supabase.js';
import { sendError, sendSuccess } from './_lib/errors.js';

export default async function handler(req, res) {
    // Vendors are read-only but still require authentication
    const { error } = await verifyAuth(req);
    if (error) return sendError(res, 401, error);

    if (req.method !== 'GET') {
        return sendError(res, 405, 'Method not allowed');
    }

    try {
        const { data, error: fetchError } = await supabaseAdmin
            .from('vendors')
            .select('*')
            .order('rating', { ascending: false });

        if (fetchError) return sendError(res, 500, fetchError);
        return sendSuccess(res, data || []);
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
