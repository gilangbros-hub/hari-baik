import { verifyAuth } from './_lib/auth.js';
import { supabaseAdmin } from './_lib/supabase.js';
import { sendError, sendSuccess } from './_lib/errors.js';

export default async function handler(req, res) {
    const { user, error } = await verifyAuth(req);
    if (error) return sendError(res, 401, error);

    try {
        // GET — list tasks
        if (req.method === 'GET') {
            const { data, error: fetchError } = await supabaseAdmin
                .from('tasks')
                .select('*')
                .eq('user_id', user.id)
                .order('due_date', { ascending: true });

            if (fetchError) return sendError(res, 500, fetchError);
            return sendSuccess(res, data || []);
        }

        // POST — create task
        if (req.method === 'POST') {
            const { title, category, due_date, pic, contact_person } = req.body || {};

            if (!title || typeof title !== 'string' || title.trim().length === 0) {
                return sendError(res, 400, 'Judul tugas wajib diisi.');
            }

            const { data, error: insertError } = await supabaseAdmin
                .from('tasks')
                .insert({
                    user_id: user.id,
                    title: String(title).trim().slice(0, 200),
                    category: String(category || 'Pernikahan').trim().slice(0, 100),
                    status: 'todo',
                    pic: String(pic || 'CPP').trim().slice(0, 50),
                    due_date: due_date || null,
                    contact_person: contact_person ? String(contact_person).trim().slice(0, 100) : null,
                })
                .select()
                .single();

            if (insertError) return sendError(res, 500, insertError);
            return sendSuccess(res, data, 201);
        }

        // PUT — update task
        if (req.method === 'PUT') {
            const { id, ...updates } = req.body || {};
            if (!id) return sendError(res, 400, 'ID tugas wajib.');

            const allowed = ['title', 'category', 'status', 'pic', 'due_date', 'contact_person'];
            const sanitized = {};

            for (const key of allowed) {
                if (updates[key] !== undefined) {
                    if (typeof updates[key] === 'string') {
                        sanitized[key] = updates[key].trim().slice(0, 200);
                    } else {
                        sanitized[key] = updates[key];
                    }
                }
            }

            // Validate status
            if (sanitized.status && !['todo', 'in-progress', 'done'].includes(sanitized.status)) {
                return sendError(res, 400, 'Status tidak valid.');
            }

            const { data, error: updateError } = await supabaseAdmin
                .from('tasks')
                .update(sanitized)
                .eq('id', id)
                .eq('user_id', user.id) // Ensure ownership
                .select()
                .single();

            if (updateError) return sendError(res, 500, updateError);
            return sendSuccess(res, data);
        }

        // DELETE — delete task
        if (req.method === 'DELETE') {
            const { id } = req.body || {};
            if (!id) return sendError(res, 400, 'ID tugas wajib.');

            const { error: deleteError } = await supabaseAdmin
                .from('tasks')
                .delete()
                .eq('id', id)
                .eq('user_id', user.id); // Ensure ownership

            if (deleteError) return sendError(res, 500, deleteError);
            return sendSuccess(res, { deleted: true });
        }

        return sendError(res, 405, 'Method not allowed');
    } catch {
        return sendError(res, 500, 'Terjadi kesalahan server.');
    }
}
