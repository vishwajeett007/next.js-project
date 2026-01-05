import BudgetForm from '@/components/BudgetForm';
import Dashboard from '@/components/Dashboard';
import SyncStatus from '@/components/SyncStatus';
import LoginGuard from '@/components/LoginGuard';
import { LayoutDashboard, WalletCards } from 'lucide-react';

export default function Home() {
  return (
    <LoginGuard>
      <main className="min-h-screen px-4 py-8 md:px-8 lg:px-12 max-w-7xl mx-auto space-y-12">

        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <WalletCards className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">BudgetBox</h1>
              <p className="text-gray-400 text-sm font-medium">Offline-First Personal Finance</p>
            </div>
          </div>

          <SyncStatus />
        </header>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
          {/* Left Side: Form */}
          <section className="xl:col-span-5 space-y-6">
            <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-2">
              <span className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse" />
              Budget Input
            </div>
            <BudgetForm />
          </section>

          {/* Right Side: Analytics */}
          <section className="xl:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-2">
              <LayoutDashboard className="w-4 h-4" />
              Dashboard Overveiw
            </div>
            <Dashboard />
          </section>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t border-white/5 text-center">
          <p className="text-gray-600 text-xs font-medium uppercase tracking-widest">
            BudgetBox &copy; 2025 • Local-First Experience
          </p>
        </footer>
      </main>
    </LoginGuard>
  );
}
