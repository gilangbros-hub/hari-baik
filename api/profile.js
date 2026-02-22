import { verifyAuth } from './_lib/auth.js';
import { supabaseAdmin } from './_lib/supabase.js';
import { sendError, sendSuccess } from './_lib/errors.js';

export default async function handler(req, res) {
    const { user, error } = await verifyAuth(req);
    if (error) return sendError(res, 401, error);

    try {
        if (req.method === 'GET') {
            const { data, error: fetchError } = await supabaseAdmin
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .maybeSingle();

            if (fetchError) return sendError(res, 500, fetchError);
            return sendSuccess(res, data);
        }

        if (req.method === 'PUT') {
            const allowed = ['name', 'role', 'mode', 'wedding_date'];
            const updates = {};

            for (const key of allowed) {
                if (req.body[key] !== undefined) {
                    updates[key] = typeof req.body[key] === 'string'
                        ? req.body[key].trim().slice(0, 200)
                        : req.body[key];
                }
            }

            // Validate role if provided
            if (updates.role && !['CPP', 'CPW'].includes(updates.role)) {
                return sendError(res, 400, 'Peran tidak valid.');
            }

            // Validate mode if provided
            if (updates.mode && !['all-in-one', 'checklist', 'budget'].includes(updates.mode)) {
                return sendError(res, 400, 'Mode tidak valid.');
            }

            const { data, error: updateError } = await supabaseAdmin
                .from('profiles')
                .update(updates)
                .eq('id', user.id)
                .select()
                .maybeSingle();

            if (updateError) return sendError(res, 500, updateError);
            return sendSuccess(res, data);
        }

        return sendError(res, 405, 'Method not allowed');
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
