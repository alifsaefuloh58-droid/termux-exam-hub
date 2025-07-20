import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { authenticateAdmin, authenticateStudent, saveCurrentUser } from '@/lib/storage';
import { UserCog, GraduationCap } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [adminCredentials, setAdminCredentials] = useState({
    username: '',
    password: '',
  });

  const [studentCredentials, setStudentCredentials] = useState({
    username: '',
    password: '',
  });

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const admin = authenticateAdmin(adminCredentials.username, adminCredentials.password);
      if (admin) {
        saveCurrentUser({ type: 'admin', data: admin });
        toast({
          title: "Welcome back!",
          description: "Admin login successful.",
        });
        navigate('/admin');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStudentLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const student = authenticateStudent(studentCredentials.username, studentCredentials.password);
      if (student) {
        saveCurrentUser({ type: 'student', data: student });
        toast({
          title: "Welcome!",
          description: `Hello ${student.name}, ready for your exam?`,
        });
        navigate('/student');
      } else {
        toast({
          title: "Login failed",
          description: "Invalid username or password.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred during login.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Exam Hub" subtitle="Secure Online Examination Platform">
      <Tabs defaultValue="student" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="student" className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4" />
            Student
          </TabsTrigger>
          <TabsTrigger value="admin" className="flex items-center gap-2">
            <UserCog className="h-4 w-4" />
            Admin
          </TabsTrigger>
        </TabsList>

        <TabsContent value="student">
          <Card>
            <CardHeader>
              <CardTitle>Student Login</CardTitle>
              <CardDescription>
                Enter your credentials to access your exams
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleStudentLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="student-username">Username</Label>
                  <Input
                    id="student-username"
                    type="text"
                    value={studentCredentials.username}
                    onChange={(e) => setStudentCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="student-password">Password</Label>
                  <Input
                    id="student-password"
                    type="password"
                    value={studentCredentials.password}
                    onChange={(e) => setStudentCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admin">
          <Card>
            <CardHeader>
              <CardTitle>Admin Login</CardTitle>
              <CardDescription>
                Access the administration panel
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAdminLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input
                    id="admin-username"
                    type="text"
                    value={adminCredentials.username}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, username: e.target.value }))}
                    placeholder="Enter admin username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={adminCredentials.password}
                    onChange={(e) => setAdminCredentials(prev => ({ ...prev, password: e.target.value }))}
                    placeholder="Enter admin password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? "Signing in..." : "Sign In"}
                </Button>
              </form>
              <div className="mt-4 p-3 bg-muted rounded-md">
                <p className="text-sm text-muted-foreground">
                  <strong>Default Admin:</strong><br />
                  Username: admin<br />
                  Password: admin123
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </AuthLayout>
  );
};

export default Login;