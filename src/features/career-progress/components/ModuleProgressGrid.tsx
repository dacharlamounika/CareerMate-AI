import {
  Briefcase,
  Code2,
  FileText,
  GraduationCap,
  ListChecks,
  Microscope,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import type { CareerProgressData, ProgressCardConfig } from "@/features/career-progress/types/careerProgressTypes";
import ProgressCard from "@/features/career-progress/components/ProgressCard";

interface ModuleProgressGridProps {
  data: CareerProgressData;
}

export default function ModuleProgressGrid({ data }: ModuleProgressGridProps) {
  const cards: ProgressCardConfig[] = [
    {
      id: "resume",
      title: "Resume Builder",
      icon: FileText,
      link: "/resume-builder",
      linkLabel: "Open Resume Builder",
      data: { kind: "resume", payload: data.resumeBuilder },
    },
    {
      id: "ats",
      title: "ATS Analysis",
      icon: TrendingUp,
      link: "/ats-analysis",
      linkLabel: "Open ATS Analysis",
      data: { kind: "ats", payload: data.atsAnalysis },
    },
    {
      id: "job-description",
      title: "Job Description Analyzer",
      icon: ListChecks,
      link: "/job-description-analyzer",
      linkLabel: "Open JD Analyzer",
      data: { kind: "job-description", payload: data.jobDescriptionAnalyzer },
    },
    {
      id: "skill-gap",
      title: "Skill Gap Analysis",
      icon: Target,
      link: "/skill-gap",
      linkLabel: "Open Skill Gap Analysis",
      data: { kind: "skill-gap", payload: data.skillGapAnalysis },
    },
    {
      id: "learning",
      title: "Learning Roadmap",
      icon: GraduationCap,
      link: "/learning-roadmap",
      linkLabel: "Open Learning Roadmap",
      data: { kind: "learning", payload: data.learningRoadmap },
    },
    {
      id: "aptitude",
      title: "Aptitude Practice",
      icon: Microscope,
      link: "/aptitude",
      linkLabel: "Open Aptitude Practice",
      data: { kind: "aptitude", payload: data.aptitudePractice },
    },
    {
      id: "coding",
      title: "Coding Assessment",
      icon: Code2,
      link: "/coding-assessment",
      linkLabel: "Open Coding Assessment",
      data: { kind: "coding", payload: data.codingAssessment },
    },
    {
      id: "mock-interview",
      title: "AI Mock Interview",
      icon: Users,
      link: "/mock-interview",
      linkLabel: "Open Mock Interview",
      data: { kind: "mock-interview", payload: data.mockInterview },
    },
    {
      id: "live-jobs",
      title: "Live Jobs",
      icon: Briefcase,
      link: "/live-jobs",
      linkLabel: "Open Live Jobs",
      data: { kind: "live-jobs", payload: data.liveJobs },
    },
  ];

  return (
    <section>
      <h2 className="mb-4 text-lg font-semibold text-slate-900">Module Progress</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <ProgressCard
            key={c.id}
            title={c.title}
            icon={c.icon}
            link={c.link}
            linkLabel={c.linkLabel}
            data={c.data}
          />
        ))}
      </div>
    </section>
  );
}
