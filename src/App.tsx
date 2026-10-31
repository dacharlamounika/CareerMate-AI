import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { LandingPage } from '@/pages/LandingPage';
import { AuthPage } from '@/pages/AuthPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { ResumeBuilderPage } from '@/pages/ResumeBuilderPage';
import { ResumeBuilderShell } from '@/features/resume/components/ResumeBuilderShell';
import { ResumePreviewPage } from '@/pages/ResumePreviewPage';
import { CareerRecommendationPage } from '@/pages/CareerRecommendationPage';
import { Loader2 } from 'lucide-react';

import { SkillGapRoadmapPage } from '@/pages/SkillGapRoadmapPage';
import LearningRoadmapPage from '@/pages/LearningRoadmapPage';
import { AptitudeAssessmentPage } from './pages/AptitudeAssessmentPage';
import { CodingAssessmentPage } from './pages/CodingAssessmentPage';
import { JobsPage } from '@/features/jobs/pages/JobsPage';
import MockInterviewPage from '@/features/mockinterview/pages/MockInterviewPage';
import CareerProgressPage from '@/features/career-progress/pages/CareerProgressPage';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function PublicOnlyRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="animate-spin text-teal-600" size={32} />
      </div>
    );
  }
  if (user) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
}

function ResumeBuilderRoute() {
  const { id } = useParams<{ id: string }>();
  if (!id) return <Navigate to="/resume-builder" replace />;
  return <ResumeBuilderShell resumeId={id} />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route
        path="/login"
        element={
          <PublicOnlyRoute>
            <AuthPage mode="login" />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicOnlyRoute>
            <AuthPage mode="signup" />
          </PublicOnlyRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-builder"
        element={
          <ProtectedRoute>
            <ResumeBuilderPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-builder/:id"
        element={
          <ProtectedRoute>
            <ResumeBuilderRoute />
          </ProtectedRoute>
        }
      />
      <Route
        path="/resume-preview/:id"
        element={
          <ProtectedRoute>
            <ResumePreviewPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/career-recommendation"
        element={
          <ProtectedRoute>
            <CareerRecommendationPage />
          </ProtectedRoute>
        }
      />
     
<Route
  path="/jobs"
  element={
    <ProtectedRoute>
      <JobsPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/skill-gap"
  element={
    <ProtectedRoute>
      <SkillGapRoadmapPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/learning-roadmap"
  element={
    <ProtectedRoute>
      <LearningRoadmapPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/aptitude-assessment"
  element={<AptitudeAssessmentPage />}
/>
<Route
  path="/coding-assessment"
  element={<CodingAssessmentPage />}
/>
<Route
  path="/mock-interview"
  element={
    <ProtectedRoute>
      <MockInterviewPage />
    </ProtectedRoute>
  }
/>
<Route
  path="/career-progress"
  element={
    <ProtectedRoute>
      <CareerProgressPage />
    </ProtectedRoute>
  }
/>
<Route path="/skill-gap" element={<SkillGapRoadmapPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
  
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
