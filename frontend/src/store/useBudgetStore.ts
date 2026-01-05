import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import localforage from 'localforage';

export interface BudgetData {
    income: number;
    bills: number;
    food: number;
    transport: number;
    subscriptions: number;
    miscellaneous: number;
}

export type SyncStatus = 'local-only' | 'sync-pending' | 'synced';

interface BudgetState {
    data: BudgetData;
    syncStatus: SyncStatus;
    lastSynced: string | null;
    updateField: (field: keyof BudgetData, value: number) => void;
    setSyncStatus: (status: SyncStatus) => void;
    setLastSynced: (timestamp: string) => void;
    setData: (data: BudgetData) => void;
}

const initialState: BudgetData = {
    income: 0,
    bills: 0,
    food: 0,
    transport: 0,
    subscriptions: 0,
    miscellaneous: 0,
};

// Configure localforage
localforage.config({
    name: 'BudgetBox',
    storeName: 'budget_store',
});

export const useBudgetStore = create<BudgetState>()(
    persist(
        (set) => ({
            data: initialState,
            syncStatus: 'local-only',
            lastSynced: null,
            updateField: (field, value) =>
                set((state) => ({
                    data: { ...state.data, [field]: value },
                    syncStatus: 'sync-pending',
                })),
            setSyncStatus: (status) => set({ syncStatus: status }),
            setLastSynced: (timestamp) => set({ lastSynced: timestamp }),
            setData: (data) => set({ data, syncStatus: 'synced' }),
        }),
        {
            name: 'budget-storage',
            storage: createJSONStorage(() => localforage as any),
        }
    )
);
