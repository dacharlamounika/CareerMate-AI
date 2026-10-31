import { supabase } from '@/lib/supabaseClient';
import type { Resume, ResumeContent, JobRole, AtsAnalysis } from '@/types';

export async function fetchJobRoles(category?: string): Promise<JobRole[]> {
  let query = supabase.from('job_roles').select('*').eq('is_active', true).order('sort_order');
  if (category) query = query.eq('category', category);
  const { data, error } = await query;
  if (error) throw error;
  return (data ?? []) as JobRole[];
}

export async function fetchUserResumes(userId: string): Promise<Resume[]> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Resume[];
}

export async function createResume(careerType: string, targetRole: string): Promise<Resume> {
  const { data, error } = await supabase
    .from('resumes')
    .insert({
      title: targetRole ? `${targetRole} Resume` : 'New Resume',
      career_type: careerType,
      target_role: targetRole,
      content: {},
      current_step: 0,
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as Resume;
}

export async function fetchResume(id: string): Promise<Resume | null> {
  const { data, error } = await supabase
    .from('resumes')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data as Resume | null;
}

export async function saveResumeContent(
  id: string,
  content: Partial<ResumeContent>,
  currentStep: number,
  status?: string
): Promise<void> {
  const update: Record<string, unknown> = {
    content,
    current_step: currentStep,
  };
  if (status) update.status = status;
  const { error } = await supabase.from('resumes').update(update).eq('id', id);
  if (error) throw error;
}

export async function deleteResume(id: string): Promise<void> {
  const { error } = await supabase.from('resumes').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchAtsAnalysis(resumeId: string): Promise<AtsAnalysis | null> {
  const { data, error } = await supabase
    .from('ats_analyses')
    .select('*')
    .eq('resume_id', resumeId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return data as AtsAnalysis | null;
}

export async function saveAtsAnalysis(
  resumeId: string,
  score: number,
  result: Record<string, unknown>
): Promise<void> {
  const { error } = await supabase.from('ats_analyses').insert({
    resume_id: resumeId,
    score,
    result,
  });
  if (error) throw error;
}
