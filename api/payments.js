import { verifyAuth } from './_lib/auth.js';
import { supabaseAdmin } from './_lib/supabase.js';
import { sendError, sendSuccess } from './_lib/errors.js';

export default async function handler(req, res) {
    const { user, error } = await verifyAuth(req);
    if (error) return sendError(res, 401, error);

    try {
        // GET — list payments
        if (req.method === 'GET') {
            const { data, error: fetchError } = await supabaseAdmin
                .from('payments')
                .select('*')
                .eq('user_id', user.id)
                .order('paid_at', { ascending: false });

            if (fetchError) return sendError(res, 500, fetchError);
            return sendSuccess(res, data || []);
        }

        // POST — create payment
        if (req.method === 'POST') {
            const { category_id, amount, type, note, paid_at } = req.body || {};

            if (!category_id || !amount) {
                return sendError(res, 400, 'Kategori dan jumlah wajib diisi.');
            }

            const validTypes = ['dp', 'cicilan', 'pelunasan'];
            const sanitizedType = validTypes.includes(type) ? type : 'dp';

            const { data, error: insertError } = await supabaseAdmin
                .from('payments')
                .insert({
                    user_id: user.id,
                    category_id,
                    amount: Math.max(0, parseInt(amount) || 0),
                    type: sanitizedType,
                    note: note ? String(note).trim().slice(0, 500) : null,
                    paid_at: paid_at || new Date().toISOString().split('T')[0],
                })
                .select()
                .single();

            if (insertError) return sendError(res, 500, insertError);
            return sendSuccess(res, data, 201);
        }

        // DELETE — delete payment
        if (req.method === 'DELETE') {
            const { id } = req.body || {};
            if (!id) return sendError(res, 400, 'ID pembayaran wajib.');

            const { error: deleteError } = await supabaseAdmin
                .from('payments')
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
