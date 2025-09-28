import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/apiService';
import { FolderOpen, MapPin, User, TrendingUp } from 'lucide-react';

interface Project {
  id: string;
  title: string;
  status: 'approved' | 'pending' | 'rejected';
  verifier: string;
  location: string;
  co2Sequestered: number;
}

export const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await apiService.getProjects();
        setProjects(data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <FolderOpen className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Carbon Projects</h1>
          <p className="text-muted-foreground">
            Manage and monitor carbon sequestration projects
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">✅</span>
              <div>
                <p className="text-2xl font-bold text-green-700">
                  {projects.filter(p => p.status === 'approved').length}
                </p>
                <p className="text-sm text-green-600">Approved Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⏳</span>
              <div>
                <p className="text-2xl font-bold text-orange-700">
                  {projects.filter(p => p.status === 'pending').length}
                </p>
                <p className="text-sm text-orange-600">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">
                  {projects.reduce((sum, p) => sum + p.co2Sequestered, 0).toLocaleString()}t
                </p>
                <p className="text-sm text-primary/80">Total CO₂ Offset</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card 
            key={project.id} 
            className="hover:shadow-lg transition-all duration-200 border-border/50 hover:border-primary/30"
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg font-semibold text-foreground line-clamp-2">
                  {project.title}
                </CardTitle>
                <span className="text-2xl ml-2">
                  {getStatusIcon(project.status)}
                </span>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Status Badge */}
              <Badge 
                className={`${getStatusColor(project.status)} font-medium capitalize`}
                variant="secondary"
              >
                {project.status}
              </Badge>

              {/* Project Details */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium text-foreground">{project.location}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Verifier:</span>
                  <span className="font-medium text-foreground">{project.verifier}</span>
                </div>

                <div className="flex items-center space-x-2 text-sm">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-muted-foreground">CO₂ Sequestered:</span>
                  <span className="font-bold text-green-700">{project.co2Sequestered.toLocaleString()}t</span>
                </div>
              </div>

              {/* Impact Indicator */}
              <div className="pt-2 border-t border-border/30">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-muted-foreground">Environmental Impact</span>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(5, Math.floor(project.co2Sequestered / 200) + 1) }).map((_, i) => (
                      <span key={i} className="text-green-500">🌱</span>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Projects State */}
      {projects.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <FolderOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Projects Found</h3>
            <p className="text-muted-foreground">
              No carbon projects are currently available in the system.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};