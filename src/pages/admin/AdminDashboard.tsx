import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { getCurrentUser, clearCurrentUser, getExamSets, getStudents, getExamResults } from '@/lib/storage';
import { 
  BookOpen, 
  Users, 
  FileText, 
  BarChart3, 
  Plus, 
  LogOut, 
  Settings,
  Clock
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [stats, setStats] = useState({
    totalExams: 0,
    totalStudents: 0,
    totalResults: 0,
    recentActivity: 0,
  });

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.type !== 'admin') {
      navigate('/');
      return;
    }

    // Calculate stats
    const examSets = getExamSets();
    const students = getStudents();
    const results = getExamResults();

    setStats({
      totalExams: examSets.length,
      totalStudents: students.length,
      totalResults: results.length,
      recentActivity: results.filter(r => 
        new Date(r.completedAt).toDateString() === new Date().toDateString()
      ).length,
    });
  }, [navigate]);

  const handleLogout = () => {
    clearCurrentUser();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Exam Hub</h1>
              <p className="text-sm text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Exams</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExams}</div>
              <p className="text-xs text-muted-foreground">Active exam sets</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalStudents}</div>
              <p className="text-xs text-muted-foreground">Registered students</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Exam Results</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResults}</div>
              <p className="text-xs text-muted-foreground">Total submissions</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Today's Activity</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.recentActivity}</div>
              <p className="text-xs text-muted-foreground">Exams completed today</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Create New Exam
              </CardTitle>
              <CardDescription>
                Design a new exam with reading and listening sections
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/exams/create">
                <Button className="w-full">
                  Create Exam
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Manage Exams
              </CardTitle>
              <CardDescription>
                View, edit, or delete existing exam sets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/exams">
                <Button variant="outline" className="w-full">
                  View Exams
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Student Management
              </CardTitle>
              <CardDescription>
                Add new students and manage accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/students">
                <Button variant="outline" className="w-full">
                  Manage Students
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                View Results
              </CardTitle>
              <CardDescription>
                Review student exam scores and performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/admin/results">
                <Button variant="outline" className="w-full">
                  View Results
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-soft transition-all duration-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure application settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;