'use client';

import React, { useMemo } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend
} from 'recharts';
import { AlertCircle, TrendingUp, PiggyBank, CalendarRange, CheckCircle2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#f97316', '#8b5cf6', '#f43f5e', '#64748b'];

export default function Dashboard() {
    const { data } = useBudgetStore();

    const analytics = useMemo(() => {
        const totalExpenses = data.bills + data.food + data.transport + data.subscriptions + data.miscellaneous;
        const savings = data.income - totalExpenses;
        const burnRate = data.income > 0 ? (totalExpenses / data.income) * 100 : 0;

        // Simple month end prediction: assume expenses are linear and we are halfway through? 
        // Actually, prediction based on "current trend" usually means if this continues. 
        // Let's just project the current savings status.
        const monthEndSavings = savings;

        const chartData = [
            { name: 'Bills', value: data.bills },
            { name: 'Food', value: data.food },
            { name: 'Transport', value: data.transport },
            { name: 'Subscriptions', value: data.subscriptions },
            { name: 'Misc', value: data.miscellaneous },
        ].filter(item => item.value > 0);

        // Anomalies
        const warnings = [];
        if (data.income > 0) {
            if (data.subscriptions > data.income * 0.3) {
                warnings.push('Subscriptions are >30% of your income — too high!');
            }
            if (data.food > data.income * 0.4) {
                warnings.push('Reduce food spend next month.');
            }
            if (savings < 0) {
                warnings.push('Your expenses exceed income.');
            }
        }

        return { totalExpenses, savings, burnRate, monthEndSavings, chartData, warnings };
    }, [data]);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Burn Rate */}
                <div className="bg-indigo-600 rounded-3xl p-6 text-white shadow-xl shadow-indigo-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <TrendingUp className="w-8 h-8 opacity-80" />
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Monthly</span>
                    </div>
                    <p className="text-indigo-100 text-sm font-medium mb-1">Burn Rate</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold">{analytics.burnRate.toFixed(1)}%</h3>
                        <span className="text-indigo-200 text-xs text-nowrap">of total income</span>
                    </div>
                </div>

                {/* Savings Potential */}
                <div className="bg-emerald-600 rounded-3xl p-6 text-white shadow-xl shadow-emerald-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <PiggyBank className="w-8 h-8 opacity-80" />
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Potential</span>
                    </div>
                    <p className="text-emerald-100 text-sm font-medium mb-1">Savings Potential</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold">₹{analytics.savings.toLocaleString()}</h3>
                    </div>
                </div>

                {/* Prediction */}
                <div className="bg-purple-600 rounded-3xl p-6 text-white shadow-xl shadow-purple-500/20">
                    <div className="flex justify-between items-start mb-4">
                        <CalendarRange className="w-8 h-8 opacity-80" />
                        <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">Forecast</span>
                    </div>
                    <p className="text-purple-100 text-sm font-medium mb-1">Month-End Savings</p>
                    <div className="flex items-baseline gap-2">
                        <h3 className="text-3xl font-bold">₹{analytics.monthEndSavings.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Chart */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 flex flex-col items-center justify-center min-h-[400px]">
                    <h4 className="text-gray-300 font-bold self-start mb-4">Expense Distribution</h4>
                    {analytics.chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={analytics.chartData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {analytics.chartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#111827', border: 'none', borderRadius: '12px', color: '#fff' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="text-gray-500 italic">No data to display</div>
                    )}
                </div>

                {/* Warnings */}
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-4">
                    <h4 className="text-gray-300 font-bold mb-4">Anomaly Warnings</h4>
                    <div className="space-y-3">
                        {analytics.warnings.length > 0 ? (
                            analytics.warnings.map((warning, i) => (
                                <div key={i} className="flex items-center gap-4 bg-rose-500/10 border border-rose-500/20 p-4 rounded-2xl text-rose-200">
                                    <AlertCircle className="w-6 h-6 shrink-0" />
                                    <p className="text-sm font-medium">{warning}</p>
                                </div>
                            ))
                        ) : (
                            <div className="flex items-center gap-4 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-200">
                                <CheckCircle2 className="w-6 h-6 shrink-0" />
                                <p className="text-sm font-medium">All systems normal. Your budget looks healthy!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
