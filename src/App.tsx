import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LandingPage } from './pages/LandingPage';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { GlobalTodoDrawer } from './components/layout/GlobalTodoDrawer';

// Modules
import { DashboardPage } from './pages/DashboardPage';
import { EventsPage } from './pages/EventsPage';
import { StudentRecordsPage } from './pages/StudentRecordsPage';
import { DigitalIdPage } from './pages/DigitalIdPage';
import { WhatIfAIPage } from './pages/WhatIfAIPage';
import { ToolScoutPage } from './pages/ToolScoutPage';
import { NotesLibraryPage } from './pages/NotesLibraryPage';
import { StudyPlannerPage } from './pages/StudyPlannerPage';
import { NexoraMarketplacePage } from './pages/NexoraMarketplacePage';
import { ExpenseTrackerPage } from './pages/ExpenseTrackerPage';
import { ScholarshipPage } from './pages/ScholarshipPage';
import { EcoRoutePage } from './pages/EcoRoutePage';
import { BasketWisePage } from './pages/BasketWisePage';
import { LostFoundPage } from './pages/LostFoundPage';
import { QuizPortalPage } from './pages/QuizPortalPage';
import { AdminConsolePage } from './pages/AdminConsolePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { ProfilePage } from './pages/ProfilePage';
import { HelpPage } from './pages/HelpPage';
import { Menu, Home, ChevronRight } from 'lucide-react';

const AppContent: React.FC = () => {
  const { user, role, switchRole } = useAuth();
  const [viewMode, setViewMode] = useState<'landing' | 'portal'>('portal');
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isTodoDrawerOpen, setIsTodoDrawerOpen] = useState(false);

  // If viewing public landing page
  if (viewMode === 'landing') {
    return (
      <LandingPage
        onEnterPortal={() => setViewMode('portal')}
        onSelectRole={async targetRole => {
          await switchRole(targetRole);
          setViewMode('portal');
        }}
      />
    );
  }

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'events':
        return <EventsPage />;
      case 'records':
        return <StudentRecordsPage />;
      case 'digital-id':
        return <DigitalIdPage />;
      case 'whatif':
        return <WhatIfAIPage />;
      case 'toolscout':
        return <ToolScoutPage />;
      case 'notes':
        return <NotesLibraryPage />;
      case 'planner':
        return <StudyPlannerPage />;
      case 'marketplace':
        return <NexoraMarketplacePage />;
      case 'expenses':
        return <ExpenseTrackerPage />;
      case 'scholarships':
        return <ScholarshipPage />;
      case 'ecoroute':
        return <EcoRoutePage />;
      case 'basketwise':
        return <BasketWisePage />;
      case 'lost-found':
        return <LostFoundPage />;
      case 'quizzes':
        return <QuizPortalPage />;
      case 'admin':
        return <AdminConsolePage />;
      case 'notifications':
        return <NotificationsPage />;
      case 'profile':
        return <ProfilePage />;
      case 'help':
        return <HelpPage />;
      case 'todos':
        return <StudyPlannerPage />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  const getBreadcrumbTitle = (tab: string) => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard',
      events: 'Campus Life / Events & Tickets',
      records: 'Academic Hub / Student Records',
      'digital-id': 'Campus Life / Digital ID Card',
      whatif: 'Academic Hub / WhatIf AI Simulator',
      toolscout: 'Academic Hub / ToolScout AI',
      notes: 'Academic Hub / Notes Library',
      planner: 'Academic Hub / Study Planner',
      marketplace: 'Micro-Economy / Nexora Marketplace',
      expenses: 'Micro-Economy / Personal Expenses',
      scholarships: 'Academic Hub / Scholarships',
      ecoroute: 'Sustainability / EcoRoute AI Transit',
      basketwise: 'Micro-Economy / BasketWise Comparison',
      'lost-found': 'Campus Life / Lost & Found',
      quizzes: 'Academic Hub / Quiz Learning Portal',
      admin: 'System / Administrator Console',
      notifications: 'Overview / Notifications',
      profile: 'Overview / My Profile',
      help: 'System / Help & Support',
    };
    return titles[tab] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation */}
      <Navbar
        onOpenTodos={() => setIsTodoDrawerOpen(true)}
        onOpenNotifications={() => setActiveTab('notifications')}
        unreadNotificationsCount={2}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Grouped Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={tab => {
            if (tab === 'todos') {
              setIsTodoDrawerOpen(true);
            } else {
              setActiveTab(tab);
            }
          }}
          isOpenMobile={isMobileSidebarOpen}
          setIsOpenMobile={setIsMobileSidebarOpen}
        />

        {/* Main Content Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 space-y-6">
          {/* Top Contextual Breadcrumb & Mobile Toggle Bar */}
          <div className="flex items-center justify-between gap-4 pb-2">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <button
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200"
                title="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-slate-900 flex items-center gap-1"
              >
                <Home className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Portal</span>
              </button>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              <span className="font-semibold text-slate-800">{getBreadcrumbTitle(activeTab)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('landing')}
                className="text-[11px] font-medium text-slate-500 hover:text-indigo-600 transition-colors"
              >
                Public Homepage
              </button>
            </div>
          </div>

          {/* Active Module Canvas */}
          {renderActiveModule()}
        </main>
      </div>

      {/* Global Quick To-Do Drawer */}
      <GlobalTodoDrawer
        isOpen={isTodoDrawerOpen}
        onClose={() => setIsTodoDrawerOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
