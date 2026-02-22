import React from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { defaultBudget } from '../data/mockData';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Plus } from 'lucide-react';

ChartJS.register(ArcElement, Tooltip);

export default function BudgetPage() {
    const [budget] = useLocalStorage('rhb_budget', defaultBudget);

    const totalSpent = budget.categories.reduce((acc, cat) => acc + cat.spent, 0);
    const remaining = budget.total - totalSpent;
    const progressPercent = Math.round((totalSpent / budget.total) * 100);

    const formatRp = (num) => {
        return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(num);
    };

    const donutData = {
        labels: budget.categories.map(c => c.name),
        datasets: [{
            data: budget.categories.map(c => c.spent),
            backgroundColor: budget.categories.map(c => c.color),
            borderWidth: 0,
        }]
    };

    const donutOptions = {
        cutout: '80%',
        plugins: {
            legend: { display: false },
            tooltip: { enabled: true }
        },
        responsive: true,
        maintainAspectRatio: true,
    };

    return (
        <div style={{ paddingBottom: '2rem' }}>
            <header className="mb-md" style={{ paddingTop: '1rem' }}>
                <h1 style={{ margin: 0, fontSize: '1.5rem', marginBottom: '1rem' }}>Dana Pernikahan</h1>

                <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.5rem' }}>
                    <div style={{ width: '100px', height: '100px', position: 'relative' }}>
                        {totalSpent > 0 ? (
                            <Doughnut data={donutData} options={donutOptions} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '10px solid var(--border)' }}></div>
                        )}
                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)' }}>
                            {progressPercent}%
                        </div>
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Target Dana</p>
                        <h3 style={{ fontSize: '1.1rem', marginBottom: '0.75rem' }}>{formatRp(budget.total)}</h3>

                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Dana Keluar</p>
                        <h3 style={{ fontSize: '1.1rem', color: 'var(--warning)', margin: 0 }}>{formatRp(totalSpent)}</h3>
                    </div>
                </div>
            </header>

            <div className="flex-between mb-sm" style={{ marginTop: '2rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Rincian Kategori</h3>
                <button style={{ color: 'var(--primary)', fontWeight: 600, fontSize: '0.85rem' }}>+ Tambah</button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {budget.categories.map(cat => {
                    const catProgress = Math.round((cat.spent / cat.allocated) * 100) || 0;
                    return (
                        <div key={cat.id} className="card" style={{ padding: '1rem', marginBottom: 0 }}>
                            <div className="flex-between mb-sm">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: cat.color }}></div>
                                    <h4 style={{ margin: 0, fontSize: '1rem' }}>{cat.name}</h4>
                                </div>
                                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{catProgress}%</span>
                            </div>

                            <div style={{ backgroundColor: 'var(--border)', height: '8px', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                                <div style={{ backgroundColor: cat.color, width: `${Math.min(100, catProgress)}%`, height: '100%', borderRadius: '4px' }}></div>
                            </div>

                            <div className="flex-between" style={{ fontSize: '0.85rem' }}>
                                <div>
                                    <div style={{ color: 'var(--text-muted)' }}>Dialokasikan</div>
                                    <div style={{ fontWeight: 500 }}>{formatRp(cat.allocated)}</div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ color: 'var(--text-muted)' }}>Terpakai</div>
                                    <div style={{ fontWeight: 500 }}>{formatRp(cat.spent)}</div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            <button className="btn-primary" style={{ position: 'fixed', bottom: '90px', right: '20px', width: 'auto', padding: '1rem', borderRadius: '50%', boxShadow: 'var(--shadow-lg)' }}>
                <Plus size={24} />
            </button>
        </div>
    );
}
