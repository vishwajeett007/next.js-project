'use client';

import React, { useState, useEffect } from 'react';
import { Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginGuard({ children }: { children: React.ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = () => {
            const auth = localStorage.getItem('budgetbox_auth');
            if (auth === 'true') {
                setIsLoggedIn(true);
            }
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (email === 'hire-me@anshumat.org' && password === 'HireMe@2025!') {
            localStorage.setItem('budgetbox_auth', 'true');
            setIsLoggedIn(true);
            setError('');
        } else {
            setError('Invalid credentials. Please use the demo account.');
        }
    };

    if (isLoading) return null;

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-6 bg-[#0a0a0a]">
                <div className="w-full max-w-md space-y-8 bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10 shadow-2xl">
                    <div className="text-center space-y-2">
                        <h2 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h2>
                        <p className="text-gray-400 font-medium">Please sign in to your demo account</p>
                    </div>

                    <form onSubmit={handleLogin} className="mt-8 space-y-6">
                        <div className="space-y-4">
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="Email address"
                                />
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-indigo-400 transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium"
                                    placeholder="Password"
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-rose-500 text-sm font-semibold text-center bg-rose-500/10 py-2 rounded-lg border border-rose-500/20">
                                {error}
                            </p>
                        )}

                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-sm font-bold rounded-2xl text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-lg shadow-indigo-500/20 transition-all active:scale-[0.98]"
                        >
                            Sign in
                            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="pt-4 text-center">
                            <p className="text-xs text-gray-500 font-medium italic">
                                Demo: hire-me@anshumat.org / HireMe@2025!
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return <>{children}</>;
}
