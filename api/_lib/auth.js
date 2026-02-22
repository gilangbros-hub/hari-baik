import { supabaseAdmin } from './supabase.js';

/**
 * Extracts and verifies the JWT from the Authorization header.
 * Returns { user, error }.
 */
export async function verifyAuth(req) {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return { user: null, error: 'Unauthorized' };
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
        if (error || !user) {
            return { user: null, error: 'Invalid or expired token' };
        }
        return { user, token, error: null };
    } catch {
        return { user: null, error: 'Authentication failed' };
    }
}
