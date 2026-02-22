import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { CheckSquare, Wallet, Sparkles } from 'lucide-react';

export default function ModeSelectPage() {
    const navigate = useNavigate();
    const [_, setUser] = useLocalStorage('rhb_user', null);

    const selectMode = (mode) => {
        setUser({ name: 'Guest', role: 'CPP', mode });
        navigate('/');
    };

    return (
        <div style={{ padding: '2rem 1rem', minHeight: '100vh', backgroundColor: 'var(--bg-color)' }}>
            <h1 className="mb-sm text-center">Pilih Mode Anda</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center' }}>
                Sesuaikan aplikasi dengan kebutuhan prioritas Anda saat ini.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <button
                    className="card"
                    onClick={() => selectMode('all-in-one')}
                    style={{ border: '2px solid var(--primary)', position: 'relative', overflow: 'hidden', textAlign: 'left' }}
                >
                    <div style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--primary)', color: 'white', fontSize: '0.7rem', padding: '0.2rem 0.6rem', borderBottomLeftRadius: '8px', fontWeight: 600 }}>PILIHAN POPULER</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
                        <div style={{ backgroundColor: 'var(--primary-light)', padding: '1rem', borderRadius: '50%', color: 'white', display: 'flex' }}>
                            <Sparkles size={24} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>All-in-One</h3>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', width: '90%' }}>Gunakan semua fitur lengkap: vendor, checklist & budget</p>
                        </div>
                    </div>
                </button>

                <button className="card" onClick={() => selectMode('checklist')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.04)', padding: '1rem', borderRadius: '50%', color: 'var(--text-main)', display: 'flex' }}>
                        <CheckSquare size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Tugas & Vendor</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fokus pada daftar checklist & kontak vendor</p>
                    </div>
                </button>

                <button className="card" onClick={() => selectMode('budget')} style={{ display: 'flex', alignItems: 'center', gap: '1rem', textAlign: 'left' }}>
                    <div style={{ backgroundColor: 'rgba(0,0,0,0.04)', padding: '1rem', borderRadius: '50%', color: 'var(--text-main)', display: 'flex' }}>
                        <Wallet size={24} />
                    </div>
                    <div>
                        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Dana Saja</h3>
                        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fokus melacak pengeluaran & pembayaran</p>
                    </div>
                </button>
            </div>
        </div>
    );
}
