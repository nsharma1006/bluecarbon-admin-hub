import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiService } from '@/services/apiService';
import { 
  FolderOpen, 
  CheckCircle, 
  Clock, 
  TrendingUp,
  Users,
  Leaf
} from 'lucide-react';

interface DashboardStats {
  totalProjects: number;
  approvedProjects: number;
  pendingVerifications: number;
  totalCO2: number;
}

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    approvedProjects: 0,
    pendingVerifications: 0,
    totalCO2: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [projects, verifications] = await Promise.all([
          apiService.getProjects(),
          apiService.getVerifications()
        ]);

        const approvedCount = projects.filter((p: any) => p.status === 'approved').length;
        const pendingVerifications = verifications.filter((v: any) => v.status === 'pending').length;
        const totalCO2 = projects.reduce((sum: number, p: any) => sum + (p.co2Sequestered || 0), 0);

        setStats({
          totalProjects: projects.length,
          approvedProjects: approvedCount,
          pendingVerifications,
          totalCO2
        });
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Projects',
      value: stats.totalProjects.toString(),
      icon: FolderOpen,
      description: 'Active carbon projects',
      color: 'text-primary'
    },
    {
      title: 'Approved Projects',
      value: stats.approvedProjects.toString(),
      icon: CheckCircle,
      description: 'Successfully verified',
      color: 'text-green-600'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications.toString(),
      icon: Clock,
      description: 'Awaiting review',
      color: 'text-orange-600'
    },
    {
      title: 'Total CO₂ Sequestered',
      value: `${stats.totalCO2.toLocaleString()}t`,
      icon: Leaf,
      description: 'Carbon offset achieved',
      color: 'text-green-700'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <TrendingUp className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Monitor your carbon projects and verification progress
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="border-border/50 hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <Icon className={`h-5 w-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-primary" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 bg-accent/30 rounded-lg">
              <h4 className="font-medium text-foreground">Review Pending Verifications</h4>
              <p className="text-sm text-muted-foreground">
                {stats.pendingVerifications} verification requests need your attention
              </p>
            </div>
            <div className="p-3 bg-accent/30 rounded-lg">
              <h4 className="font-medium text-foreground">Generate AI Insights</h4>
              <p className="text-sm text-muted-foreground">
                Use AI-powered analysis for project evaluations
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Leaf className="h-5 w-5 text-green-600" />
              <span>Environmental Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Projects Active</span>
              <span className="font-semibold text-foreground">{stats.totalProjects}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Approval Rate</span>
              <span className="font-semibold text-green-600">
                {stats.totalProjects > 0 ? Math.round((stats.approvedProjects / stats.totalProjects) * 100) : 0}%
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">CO₂ Impact</span>
              <span className="font-semibold text-green-700">{stats.totalCO2.toLocaleString()}t</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer Message */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-full">
              <Leaf className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Making a Difference</h3>
              <p className="text-sm text-muted-foreground">
                Every approved project contributes to global carbon reduction goals and environmental sustainability.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};