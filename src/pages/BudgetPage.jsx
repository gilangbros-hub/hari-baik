import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Plus, X } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip);

export default function BudgetPage() {
    const { user } = useAuth();
    const [categories, setCategories] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [showCatForm, setShowCatForm] = useState(false);
    const [newCat, setNewCat] = useState({ name: '', allocated: '' });
    const [newPayment, setNewPayment] = useState({ category_id: '', amount: '', type: 'dp', note: '' });

    useEffect(() => { fetchData(); }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const catData = await api.getBudgetCategories();
            setCategories(catData || []);

            const payData = await api.getPayments();
            setPayments(payData || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    const totalAllocated = categories.reduce((s, c) => s + Number(c.allocated), 0);
    const totalSpent = payments.reduce((s, p) => s + Number(p.amount), 0);
    const progressPercent = totalAllocated > 0 ? Math.round((totalSpent / totalAllocated) * 100) : 0;

    const spentPerCat = (catId) => payments.filter(p => p.category_id === catId).reduce((s, p) => s + Number(p.amount), 0);

    const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);

    const colors = ['#B76E79', '#e6a8b1', '#8c4c56', '#d69ca4', '#E8DCD4', '#c97f88'];

    async function addCategory(e) {
        e.preventDefault();
        try {
            const data = await api.createBudgetCategory({
                name: newCat.name, allocated: parseInt(newCat.allocated) || 0, color: colors[categories.length % colors.length]
            });
            if (data) { setCategories([...categories, data]); setNewCat({ name: '', allocated: '' }); setShowCatForm(false); }
        } catch (err) {
            console.error(err);
        }
    }

    async function addPayment(e) {
        e.preventDefault();
        try {
            const data = await api.createPayment({
                category_id: newPayment.category_id, amount: parseInt(newPayment.amount) || 0, type: newPayment.type, note: newPayment.note
            });
            if (data) { setPayments([data, ...payments]); setNewPayment({ category_id: '', amount: '', type: 'dp', note: '' }); setShowPaymentForm(false); }
        } catch (err) {
            console.error(err);
        }
    }

    const donutData = {
        labels: categories.map(c => c.name),
        datasets: [{ data: categories.map(c => spentPerCat(c.id) || 1), backgroundColor: categories.map((c, i) => c.color || colors[i % colors.length]), borderWidth: 0 }]
    };
    const donutOptions = { cutout: '80%', plugins: { legend: { display: false }, tooltip: { enabled: true } }, responsive: true, maintainAspectRatio: true };

    if (loading) return <div className="flex-center" style={{ height: '60vh', color: 'var(--text-muted)' }}>Memuat dana...</div>;

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header className="mb-md" style={{ paddingTop: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '1rem' }}>Dana Pernikahan</h1>
                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                        {categories.length > 0 ? <Doughnut data={donutData} options={donutOptions} /> : <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '10px solid var(--border)' }}></div>}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>{progressPercent}%</div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Target Dana</p>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{formatRp(totalAllocated)}</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Dana Keluar</p>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--warning)', margin: 0 }}>{formatRp(totalSpent)}</h3>
                    </div>
                </div>
            </header>

            <div className="flex-between mb-sm" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Rincian Kategori</h3>
                <button onClick={() => setShowCatForm(!showCatForm)} style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>{showCatForm ? 'Tutup' : '+ Tambah'}</button>
            </div>

            {showCatForm && (
                <form onSubmit={addCategory} className="card mb-md" style={{ padding: '1rem' }}>
                    <input type="text" className="input-base" placeholder="Nama kategori (e.g. Venue)" required value={newCat.name} onChange={(e) => setNewCat({ ...newCat, name: e.target.value })} />
                    <input type="number" className="input-base" placeholder="Alokasi dana (Rp)" required value={newCat.allocated} onChange={(e) => setNewCat({ ...newCat, allocated: e.target.value })} />
                    <button type="submit" className="btn-primary">Simpan Kategori</button>
                </form>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {categories.map((cat, i) => {
                    const spent = spentPerCat(cat.id);
                    const catProgress = cat.allocated > 0 ? Math.round((spent / Number(cat.allocated)) * 100) : 0;
                    return (
                        <div key={cat.id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                            <div className="flex-between mb-sm">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color || colors[i % colors.length] }}></div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{cat.name}</h4>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{catProgress}%</span>
                            </div>
                            <div style={{ backgroundColor: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                <div style={{ backgroundColor: cat.color || colors[i % colors.length], width: `${Math.min(100, catProgress)}%`, height: '100%', borderRadius: '4px' }}></div>
                            </div>
                            <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                                <div><div style={{ color: 'var(--text-muted)' }}>Dialokasikan</div><div style={{ fontWeight: 500 }}>{formatRp(Number(cat.allocated))}</div></div>
                                <div style={{ textAlign: 'right' }}><div style={{ color: 'var(--text-muted)' }}>Terpakai</div><div style={{ fontWeight: 500 }}>{formatRp(spent)}</div></div>
                            </div>
                        </div>
                    );
                })}
                {categories.length === 0 && <p className="text-center" style={{ color: 'var(--text-muted)', padding: '2rem' }}>Belum ada kategori dana.</p>}
            </div>

            {/* Add Payment FAB */}
            <button onClick={() => setShowPaymentForm(!showPaymentForm)} className="btn-primary" style={{ position: 'fixed', bottom: '90px', right: '20px', width: 'auto', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-lg)' }}>
                {showPaymentForm ? <X size={24} /> : <Plus size={24} />}
            </button>

            {showPaymentForm && (
                <form onSubmit={addPayment} className="card mt-lg" style={{ padding: '1rem' }}>
                    <h3 style={{ marginBottom: '1rem' }}>Tambah Pembayaran</h3>
                    <select className="input-base" required value={newPayment.category_id} onChange={(e) => setNewPayment({ ...newPayment, category_id: e.target.value })}>
                        <option value="">Pilih Kategori</option>
                        {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <input type="number" className="input-base" placeholder="Jumlah (Rp)" required value={newPayment.amount} onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })} />
                    <select className="input-base" value={newPayment.type} onChange={(e) => setNewPayment({ ...newPayment, type: e.target.value })}>
                        <option value="dp">DP</option>
                        <option value="cicilan">Cicilan</option>
                        <option value="pelunasan">Pelunasan</option>
                    </select>
                    <input type="text" className="input-base" placeholder="Catatan (opsional)" value={newPayment.note} onChange={(e) => setNewPayment({ ...newPayment, note: e.target.value })} />
                    <button type="submit" className="btn-primary">Simpan Pembayaran</button>
                </form>
            )}
        </div>
    );
}
