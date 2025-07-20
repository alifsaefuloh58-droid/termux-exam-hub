import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { 
  getCurrentUser, 
  clearCurrentUser, 
  getExamSets, 
  getExamResults 
} from '@/lib/storage';
import { ExamSet, Student } from '@/types/exam';
import { 
  BookOpen, 
  Clock, 
  LogOut, 
  Play,
  CheckCircle,
  FileText,
  Headphones
} from 'lucide-react';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [student, setStudent] = useState<Student | null>(null);
  const [examSets, setExamSets] = useState<ExamSet[]>([]);
  const [completedExams, setCompletedExams] = useState<string[]>([]);

  useEffect(() => {
    const user = getCurrentUser();
    if (!user || user.type !== 'student') {
      navigate('/');
      return;
    }

    setStudent(user.data as Student);

    // Load available exams
    const exams = getExamSets();
    setExamSets(exams);

    // Load completed exams for this student
    const results = getExamResults();
    const completed = results
      .filter(result => result.studentId === user.data.id)
      .map(result => result.examSetId);
    setCompletedExams(completed);
  }, [navigate]);

  const handleLogout = () => {
    clearCurrentUser();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    });
    navigate('/');
  };

  const handleStartExam = (examId: string) => {
    navigate(`/student/exam/${examId}`);
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins}m`;
    }
    return `${minutes}m`;
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
              <p className="text-sm text-muted-foreground">
                Welcome, {student?.name}
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Available Exams
          </h2>
          <p className="text-muted-foreground">
            Select an exam to begin. Make sure you have a stable environment before starting.
          </p>
        </div>

        {/* Exam Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examSets.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No Exams Available
              </h3>
              <p className="text-muted-foreground">
                There are currently no exams available. Please check back later.
              </p>
            </div>
          ) : (
            examSets.map((exam) => {
              const isCompleted = completedExams.includes(exam.id);
              
              return (
                <Card 
                  key={exam.id} 
                  className={`hover:shadow-soft transition-all duration-300 ${
                    isCompleted ? 'opacity-75' : ''
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{exam.title}</CardTitle>
                      {isCompleted && (
                        <Badge variant="secondary" className="bg-success text-success-foreground">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <CardDescription className="line-clamp-2">
                      {exam.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Exam Info */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>Duration: {formatDuration(exam.duration)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.readingQuestions.length} Reading</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Headphones className="h-4 w-4 text-muted-foreground" />
                          <span>{exam.listeningQuestions.length} Listening</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <BookOpen className="h-4 w-4 text-muted-foreground" />
                          <span>
                            {exam.readingQuestions.length + exam.listeningQuestions.length} Total
                          </span>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full" 
                        onClick={() => handleStartExam(exam.id)}
                        disabled={isCompleted}
                        variant={isCompleted ? "outline" : "default"}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Start Exam
                          </>
                        )}
                      </Button>

                      {isCompleted && (
                        <p className="text-xs text-muted-foreground text-center">
                          You have already completed this exam
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Exam Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Before Starting:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ensure you have a stable internet connection</li>
                  <li>• Find a quiet environment</li>
                  <li>• Have headphones ready for listening sections</li>
                  <li>• Close all unnecessary browser tabs</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">During the Exam:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Read all questions carefully</li>
                  <li>• Audio can only be played 2 times per question</li>
                  <li>• The exam will auto-submit when time runs out</li>
                  <li>• You cannot pause or resume the exam</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentDashboard;