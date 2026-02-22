import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
    const navigate = useNavigate();
    const { signIn } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(email.trim(), password);
            navigate('/');
        } catch (err) {
            setError(err.message || 'Login gagal. Periksa email dan password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '2rem 1rem', minHeight: '100vh', backgroundColor: 'var(--surface)' }}>
            <button onClick={() => navigate(-1)} style={{ marginBottom: '2rem', color: 'var(--text-muted)' }}>← Kembali</button>

            <h1 className="mb-sm">Selamat Datang</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Masuk untuk melanjutkan perencanaan Anda.</p>

            {error && (
                <div style={{ backgroundColor: '#fde8e8', color: 'var(--danger)', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-md">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Email / Username</label>
                    <input type="text" className="input-base" required maxLength={100} value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-lg">
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem', fontWeight: 500 }}>Password</label>
                    <input type="password" className="input-base" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn-primary mb-md" disabled={loading}>
                    {loading ? 'Masuk...' : 'Masuk'}
                </button>
            </form>
        </div>
    );
}
