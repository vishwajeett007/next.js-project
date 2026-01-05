'use client';

import React, { useEffect, useState } from 'react';
import { useBudgetStore } from '@/store/useBudgetStore';
import axios from 'axios';
import { Wifi, WifiOff, RefreshCw, CheckCircle2, Clock } from 'lucide-react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function SyncStatus() {
    const { data, syncStatus, lastSynced, setSyncStatus, setLastSynced } = useBudgetStore();
    const [isOnline, setIsOnline] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        setIsOnline(navigator.onLine);
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);

        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    const handleSync = async () => {
        if (!isOnline) return;
        setIsSyncing(true);
        try {
            const response = await axios.post(`${API_URL}/budget/sync`, data);
            if (response.data.success) {
                setSyncStatus('synced');
                setLastSynced(response.data.timestamp);
            }
        } catch (error) {
            console.error('Sync failed:', error);
            // Keep sync-pending if it fails
        } finally {
            setIsSyncing(false);
        }
    };

    const statusIcons = {
        'local-only': <Clock className="w-4 h-4 text-gray-400" />,
        'sync-pending': <RefreshCw className="w-4 h-4 text-amber-500 animate-spin" />,
        'synced': <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
    };

    const statusLabels = {
        'local-only': 'Local Only',
        'sync-pending': 'Sync Pending',
        'synced': 'Synced',
    };

    return (
        <div className="flex items-center gap-4 bg-white/5 backdrop-blur-md p-2 px-4 rounded-full border border-white/10 shadow-xl">
            <div className="flex items-center gap-2">
                {isOnline ? (
                    <Wifi className="w-4 h-4 text-emerald-500" />
                ) : (
                    <WifiOff className="w-4 h-4 text-rose-500" />
                )}
                <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                    {isOnline ? 'Online' : 'Offline'}
                </span>
            </div>

            <div className="w-px h-4 bg-white/10" />

            <div className="flex items-center gap-2">
                {statusIcons[syncStatus]}
                <span className="text-xs font-medium uppercase tracking-wider text-gray-300">
                    {statusLabels[syncStatus]}
                </span>
            </div>

            <button
                onClick={handleSync}
                disabled={!isOnline || isSyncing}
                className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${isOnline && !isSyncing
                    ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                    : 'bg-white/5 text-gray-500 cursor-not-allowed'
                    }`}
            >
                <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                {isSyncing ? 'Syncing...' : 'Sync Now'}
            </button>

            {lastSynced && (
                <span className="text-[10px] text-gray-500 hidden md:block">
                    Last: {new Date(lastSynced).toLocaleTimeString()}
                </span>
            )}
        </div>
    );
}
