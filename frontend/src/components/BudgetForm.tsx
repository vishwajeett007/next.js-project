'use client';

import React from 'react';
import { useBudgetStore, BudgetData } from '@/store/useBudgetStore';
import {
    Wallet,
    ReceiptText,
    Utensils,
    Car,
    Youtube,
    MoreHorizontal,
    IndianRupee
} from 'lucide-react';

const fields: { key: keyof BudgetData; label: string; icon: any; color: string }[] = [
    { key: 'income', label: 'Monthly Income', icon: Wallet, color: 'text-emerald-500' },
    { key: 'bills', label: 'Monthly Bills', icon: ReceiptText, color: 'text-blue-500' },
    { key: 'food', label: 'Food & Dining', icon: Utensils, color: 'text-orange-500' },
    { key: 'transport', label: 'Transport', icon: Car, color: 'text-purple-500' },
    { key: 'subscriptions', label: 'Subscriptions', icon: Youtube, color: 'text-rose-500' },
    { key: 'miscellaneous', label: 'Miscellaneous', icon: MoreHorizontal, color: 'text-gray-400' },
];

export default function BudgetForm() {
    const { data, updateField } = useBudgetStore();

    const handleChange = (key: keyof BudgetData, value: string) => {
        const numValue = parseFloat(value) || 0;
        updateField(key, numValue);
    };

    return (
        <div className="bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-2xl space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-white tracking-tight">Edit Budget</h2>
                <p className="text-gray-400 text-sm mt-1">Changes are saved automatically as you type.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fields.map((field) => (
                    <div key={field.key} className="relative group">
                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-400 mb-2 group-focus-within:text-white transition-colors">
                            <field.icon className={`w-4 h-4 ${field.color}`} />
                            {field.label}
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                <IndianRupee className="w-4 h-4" />
                            </div>
                            <input
                                type="number"
                                value={data[field.key] || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder="0.00"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all text-lg font-medium"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
