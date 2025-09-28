import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  Leaf, 
  LayoutDashboard, 
  FolderOpen, 
  CheckCircle, 
  MessageSquare, 
  LogOut 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Projects', href: '/projects', icon: FolderOpen },
    { name: 'Verifications', href: '/verifications', icon: CheckCircle },
    { name: 'Remarks (AI)', href: '/remarks', icon: MessageSquare },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 bg-card border-r border-border">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <Leaf className="h-8 w-8 text-primary" />
              <div>
                <h1 className="text-lg font-bold text-foreground">BlueCarbon MRV</h1>
                <p className="text-sm text-muted-foreground">Admin Panel</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User info and logout */}
          <div className="p-4 border-t border-border">
            <div className="mb-3">
              <p className="text-sm font-medium text-foreground">{user?.name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <Button
              onClick={logout}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-card border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌱</span>
              <h2 className="text-xl font-semibold text-foreground">
                BlueCarbon MRV Admin Panel
              </h2>
            </div>
            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
              <span>Welcome back, {user?.name || 'Admin'}</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};