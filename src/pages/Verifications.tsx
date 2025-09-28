import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { apiService } from '@/services/apiService';
import { toast } from '@/hooks/use-toast';
import { CheckCircle, User, Clock, FolderOpen, Check, X } from 'lucide-react';

interface Verification {
  id: string;
  verifierName: string;
  type: 'Community' | 'Technical';
  status: 'pending' | 'approved' | 'rejected';
  projectTitle: string;
  submittedAt: string;
}

export const Verifications: React.FC = () => {
  const [verifications, setVerifications] = useState<Verification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchVerifications = async () => {
      try {
        setLoading(true);
        const data = await apiService.getVerifications();
        setVerifications(data);
      } catch (error) {
        console.error('Error fetching verifications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifications();
  }, []);

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      setActionLoading(id);
      await apiService.updateVerification(id, status);
      
      // Update local state
      setVerifications(prev =>
        prev.map(v => v.id === id ? { ...v, status } : v)
      );

      toast({
        title: `Verification ${status}`,
        description: `The verification request has been ${status} successfully.`,
      });
    } catch (error) {
      console.error('Error updating verification:', error);
      toast({
        variant: "destructive",
        title: "Update failed",
        description: "Could not update verification status.",
      });
    } finally {
      setActionLoading(null);
    }
  };

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

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Technical':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Community':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const pendingCount = verifications.filter(v => v.status === 'pending').length;
  const approvedCount = verifications.filter(v => v.status === 'approved').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-3">
        <div className="p-3 bg-primary/10 rounded-full">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Verifications</h1>
          <p className="text-muted-foreground">
            Review and manage verification requests
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-orange-200 bg-orange-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-700">{pendingCount}</p>
                <p className="text-sm text-orange-600">Pending Review</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-700">{approvedCount}</p>
                <p className="text-sm text-green-600">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-primary">{verifications.length}</p>
                <p className="text-sm text-primary/80">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verifications List */}
      <div className="grid grid-cols-1 gap-6">
        {verifications.map((verification) => (
          <Card 
            key={verification.id} 
            className="hover:shadow-md transition-all duration-200 border-border/50"
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {verification.verifierName}
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    Submitted on {formatDate(verification.submittedAt)}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Badge 
                    className={`${getTypeColor(verification.type)} font-medium`}
                    variant="secondary"
                  >
                    {verification.type}
                  </Badge>
                  <Badge 
                    className={`${getStatusColor(verification.status)} font-medium capitalize`}
                    variant="secondary"
                  >
                    {verification.status}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Project Info */}
              <div className="flex items-center space-x-2 text-sm">
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Project:</span>
                <span className="font-medium text-foreground">{verification.projectTitle}</span>
              </div>

              <div className="flex items-center space-x-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Verification Type:</span>
                <span className="font-medium text-foreground">{verification.type} Verification</span>
              </div>

              {/* Action Buttons for Pending Verifications */}
              {verification.status === 'pending' && (
                <div className="flex space-x-3 pt-4 border-t border-border/30">
                  <Button
                    onClick={() => handleStatusUpdate(verification.id, 'approved')}
                    disabled={actionLoading === verification.id}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                  >
                    {actionLoading === verification.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => handleStatusUpdate(verification.id, 'rejected')}
                    disabled={actionLoading === verification.id}
                    variant="destructive"
                    className="flex-1"
                  >
                    {actionLoading === verification.id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
                  </Button>
                </div>
              )}

              {/* Status Message for Non-Pending */}
              {verification.status !== 'pending' && (
                <div className="pt-4 border-t border-border/30">
                  <p className="text-sm text-muted-foreground">
                    This verification has been{' '}
                    <span className={`font-semibold ${
                      verification.status === 'approved' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {verification.status}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Verifications State */}
      {verifications.length === 0 && !loading && (
        <Card>
          <CardContent className="py-12 text-center">
            <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Verification Requests</h3>
            <p className="text-muted-foreground">
              No verification requests are currently available for review.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};