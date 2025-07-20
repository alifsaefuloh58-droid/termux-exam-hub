import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/storage';
import { BookOpen, GraduationCap, UserCog, ArrowRight, Shield, Clock, Headphones } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const user = getCurrentUser();
    if (user) {
      if (user.type === 'admin') {
        navigate('/admin');
      } else {
        navigate('/student');
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <BookOpen className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Exam Hub</h1>
              <p className="text-white/80 text-sm">Offline Examination Platform</p>
            </div>
          </div>
          <Button 
            onClick={() => navigate('/login')}
            variant="secondary"
            className="bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          >
            Login
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Secure Online
            <br />
            <span className="text-white/90">Examination System</span>
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            A comprehensive offline-capable exam platform designed for educational institutions. 
            Features reading and listening sections with advanced audio controls.
          </p>
          <Button 
            size="lg"
            onClick={() => navigate('/login')}
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
          >
            Get Started
            <ArrowRight className="h-5 w-5 ml-2" />
          </Button>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <UserCog className="h-6 w-6" />
                Admin Panel
              </CardTitle>
              <CardDescription className="text-white/70">
                Comprehensive administration interface
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Create and manage exam sets
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Upload images and audio files
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Student account management
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Real-time results monitoring
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/10 border-white/20 backdrop-blur-sm text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-xl">
                <GraduationCap className="h-6 w-6" />
                Student Interface
              </CardTitle>
              <CardDescription className="text-white/70">
                Intuitive exam-taking experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Reading and listening sections
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Audio playback controls (2x limit)
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Auto-submit with timer
              </div>
              <div className="flex items-center gap-2 text-sm">
                <div className="w-2 h-2 bg-white/60 rounded-full" />
                Instant result feedback
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Secure & Offline</h3>
            <p className="text-white/70">
              Complete offline functionality with secure local data storage
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Clock className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Timed Exams</h3>
            <p className="text-white/70">
              Customizable exam duration with automatic submission
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
              <Headphones className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Audio Support</h3>
            <p className="text-white/70">
              Advanced listening sections with controlled playback
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-white/20">
        <div className="text-center text-white/60">
          <p>&copy; 2024 Exam Hub. Built for educational excellence.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
