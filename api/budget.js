import { verifyAuth } from './_lib/auth.js';
import { supabaseAdmin } from './_lib/supabase.js';
import { sendError, sendSuccess } from './_lib/errors.js';

export default async function handler(req, res) {
    const { user, error } = await verifyAuth(req);
    if (error) return sendError(res, 401, error);

    try {
        // GET — list budget categories
        if (req.method === 'GET') {
            const { data, error: fetchError } = await supabaseAdmin
                .from('budget_categories')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at');

            if (fetchError) return sendError(res, 500, fetchError);
            return sendSuccess(res, data || []);
        }

        // POST — create budget category
        if (req.method === 'POST') {
            const { name, allocated, color } = req.body || {};

            if (!name || typeof name !== 'string' || name.trim().length === 0) {
                return sendError(res, 400, 'Nama kategori wajib diisi.');
            }

            const { data, error: insertError } = await supabaseAdmin
                .from('budget_categories')
                .insert({
                    user_id: user.id,
                    name: String(name).trim().slice(0, 100),
                    allocated: Math.max(0, parseInt(allocated) || 0),
                    color: String(color || '#B76E79').trim().slice(0, 20),
                })
                .select()
                .single();

            if (insertError) return sendError(res, 500, insertError);
            return sendSuccess(res, data, 201);
        }

        // PUT — update budget category
        if (req.method === 'PUT') {
            const { id, ...updates } = req.body || {};
            if (!id) return sendError(res, 400, 'ID kategori wajib.');

            const allowed = ['name', 'allocated', 'color'];
            const sanitized = {};

            for (const key of allowed) {
                if (updates[key] !== undefined) {
                    if (key === 'allocated') {
                        sanitized[key] = Math.max(0, parseInt(updates[key]) || 0);
                    } else {
                        sanitized[key] = String(updates[key]).trim().slice(0, 100);
                    }
                }
            }

            const { data, error: updateError } = await supabaseAdmin
                .from('budget_categories')
                .update(sanitized)
                .eq('id', id)
                .eq('user_id', user.id)
                .select()
                .single();

            if (updateError) return sendError(res, 500, updateError);
            return sendSuccess(res, data);
        }

        // DELETE — delete budget category
        if (req.method === 'DELETE') {
            const { id } = req.body || {};
            if (!id) return sendError(res, 400, 'ID kategori wajib.');

            const { error: deleteError } = await supabaseAdmin
                .from('budget_categories')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id);

            if (deleteError) return sendError(res, 500, deleteError);
            return sendSuccess(res, { deleted: true });
        }

        return sendError(res, 405, 'Method not allowed');
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
