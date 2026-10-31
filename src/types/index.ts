export type CareerType = 'IT' | 'NON-IT';
export type ResumeTemplate =
  | 'professional'
  | 'modern'
  | 'minimal'
  | 'technical'
  | 'executive';
export type ResumeStatus = 'draft' | 'published';

export interface JobRole {
  id: string;
  name: string;
  category: CareerType;
  is_active: boolean;
  sort_order: number;
}

export interface Profile {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  career_type: CareerType;
  target_role: string | null;
  profile_data: Record<string, unknown>;
  completion_pct: number;
  created_at: string;
  updated_at: string;
}

export interface EducationEntry {
  id: string;
  degree: string;
  customDegree: string;
  specialization: string;
  customSpecialization: string;
  institution: string;
  customInstitution: string;
  cgpa: string;
  yearGraduation: string;
}

export interface AchievementEntry {
  id: string;
  title: string;
  description: string;
  organization: string;
}

export interface CertificationEntry {
  id: string;
  name: string;
  organization: string;
  completionDate: string;
  credentialUrl: string;
}

export interface ProjectEntry {
  id: string;
  title: string;
  type: 'Academic' | 'Personal' | 'Internship' | 'Research' | '';
  description: string;
  technologies: string;
  keyFeatures: string;
  contribution: string;
  githubUrl: string;
  demoUrl: string;
}

export interface ExperienceEntry {
  id: string;
  technology: string;
  context: 'Personal Practice' | 'Academic' | 'Internship' | 'Professional' | '';
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface InterestEntry {
  id: string;
  name: string;
}

export interface LanguageEntry {
  id: string;
  language: string;
  proficiency: 'Basic' | 'Intermediate' | 'Advanced' | 'Native' | '';
}

export interface ReferenceEntry {
  id: string;
  name: string;
  designation: string;
  organization: string;
  email: string;
  phone: string;
}

export interface ResumeProfile {
  fullName: string;
  photoUrl: string;
  district: string;
  state: string;
}

export interface ResumeContact {
  mobile: string;
  email: string;
  fullAddress: string;
}

export interface JobDescriptionAnalysis {
  jobTitle: string;
  requiredSkills: string[];
  preferredSkills: string[];
  tools: string[];
  qualifications: string[];
  experienceRequirements: string[];
  responsibilities: string[];
  keywords: string[];
  softSkills: string[];
}

export interface JdMatchResult {
  matched: { skill: string; resumeSource: string }[];
  missing: { skill: string; jdCategory: string }[];
  partial: { jdItem: string; resumeItem: string; reason: string }[];
  responsibilityMatches: { jdResponsibility: string; resumeItem: string; matchType: 'match' | 'partial' }[];
  matchPercentage: number;
  suggestedKeywords: string[];
}

export interface ResumeContent {
  truthAcknowledged: boolean;
  careerType: CareerType;
  targetRole: string;
  template: ResumeTemplate;
  customRole: string;
  profile: ResumeProfile;
  introduction: string;
  technicalSkills: string[];
  education: EducationEntry[];
  achievements: AchievementEntry[];
  certifications: CertificationEntry[];
  projects: ProjectEntry[];
  experience: ExperienceEntry[];
  interests: InterestEntry[];
  languages: LanguageEntry[];
  contact: ResumeContact;
  references: ReferenceEntry[];
  skipReferences: boolean;
  jobDescription: string;
  jobDescriptionAnalysis: JobDescriptionAnalysis | null;
  jdMatchResult: JdMatchResult | null;
}

export interface Resume {
  id: string;
  user_id: string;
  title: string;
  career_type: CareerType;
  target_role: string | null;
  status: ResumeStatus;
  content: Partial<ResumeContent>;
  current_step: number;
  created_at: string;
  updated_at: string;
}

export interface AtsAnalysis {
  id: string;
  resume_id: string;
  score: number;
  result: AtsResult;
  created_at: string;
}

export interface AtsResult {
  matchingKeywords: string[];
  missingKeywords: string[];
  relevantSkills: string[];
  skillGaps: string[];
  sectionCompleteness: { section: string; complete: boolean }[];
  formattingWarnings: string[];
  suggestions: string[];
  buzzwords: { phrase: string; reason: string; suggestion: string }[];
  repetitiveVerbs: { verb: string; count: number; alternatives: string[] }[];
  validationIssues: { message: string }[];
}

export const emptyResumeContent: ResumeContent = {
  truthAcknowledged: false,
  careerType: 'IT',
  targetRole: '',
  customRole: '',
  template: 'professional',
  profile: {
    fullName: '',
    photoUrl: '',
    district: '',
    state: '',
  },
  introduction: '',
  technicalSkills: [],
education: [],
  achievements: [],
  certifications: [],
  projects: [],
  experience: [],
  interests: [],
  languages: [],
  contact: {
    mobile: '',
    email: '',
    fullAddress: '',
  },
  references: [],
  skipReferences: false,
  jobDescription: '',
  jobDescriptionAnalysis: null,
  jdMatchResult: null,
};

export function normalizeResumeContent(content: Partial<ResumeContent> = {}): ResumeContent {
  return {
    ...emptyResumeContent,
    ...content,
    profile: {
      ...emptyResumeContent.profile,
      ...content.profile,
    },
    contact: {
      ...emptyResumeContent.contact,
      ...content.contact,
    },
  };
}

// Dropdown option lists

export const DEGREE_OPTIONS: string[] = [
  'B.Tech', 'B.E.', 'B.Sc', 'BCA', 'MCA', 'M.Tech', 'M.E.', 'M.Sc',
  'MBA', 'BBA', 'BA', 'MA', 'Diploma', 'Other',
];

export const SPECIALIZATION_OPTIONS: string[] = [
  'Computer Science and Engineering',
  'Information Technology',
  'Artificial Intelligence',
  'Artificial Intelligence and Machine Learning',
  'Data Science',
  'Electronics and Communication Engineering',
  'Electrical and Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Other',
];

export const INSTITUTION_OPTIONS: string[] = [
  'IIT Bombay',
  'IIT Delhi',
  'IIT Madras',
  'IIT Kanpur',
  'IIT Kharagpur',
  'IIT Roorkee',
  'IIT Guwahati',
  'IIT Hyderabad',
  'IIT Indore',
  'IIT Patna',
  'IIT Bhubaneswar',
  'NIT Trichy',
  'NIT Warangal',
  'NIT Surathkal',
  'NIT Calicut',
  'NIT Rourkela',
  'NIT Durgapur',
  'NIT Silchar',
  'BITS Pilani',
  'BITS Goa',
  'BITS Hyderabad',
  'VIT Vellore',
  'VIT Chennai',
  'VIT Bhopal',
  'VIT AP',
  'SRM University Chennai',
  'SRM University AP',
  'Amrita Vishwa Vidyapeetham',
  'Manipal Institute of Technology',
  'SASTRA University',
  'Thapar University',
  'PEC University of Technology',
  'IIIT Hyderabad',
  'IIIT Delhi',
  'IIIT Bangalore',
  'IIIT Allahabad',
  'IIIT Gwalior',
  'IIITDM Kancheepuram',
  'IIITDM Jabalpur',
  'IIIT Lucknow',
  'IIIT Vadodara',
  'IIIT Una',
  'IIIT Sri City',
  'IIIT Bhopal',
  'IIIT Kottayam',
  'IIIT Agartala',
  'COEP Pune',
  'College of Engineering Guindy (CEG)',
  'PSG College of Technology',
  'Mepco Schlenk Engineering College',
  'Thiagarajar College of Engineering',
  'BMS College of Engineering',
  'RV College of Engineering',
  'MS Ramaiah Institute of Technology',
  'PES University',
  'Bangalore Institute of Technology',
  'Dayananda Sagar College of Engineering',
  'Sir M Visvesvaraya Institute of Technology',
  'Nitte Meenakshi Institute of Technology',
  'JSS Science and Technology University (SJCE)',
  'National Institute of Engineering Mysore',
  'MS Ramaiah University of Applied Sciences',
  'Acharya Institute of Technology',
  'New Horizon College of Engineering',
  'CMR Institute of Technology',
  'Reva University',
  'Christ University',
  'Jain University',
  'Alliance University',
  'Presidency University',
  'GITAM University',
  'KL University',
  'Vignan University',
  'VR Siddhartha Engineering College',
  'VRSEC Vijayawada',
  'University College of Engineering JNTU Kakinada',
  'JNTUH College of Engineering Hyderabad',
  'CBIT Hyderabad',
  'MGIT Hyderabad',
  'VNR Vignana Jyothi Institute of Engineering',
  'Muffakham Jah College of Engineering',
  'Chaitanya Bharathi Institute of Technology',
  'Maharashtra Institute of Technology (MIT) Pune',
  'MIT WPU Pune',
  'Sinhgad College of Engineering Pune',
  'PICT Pune',
  'Cummins College of Engineering Pune',
  'AISSMS College of Engineering Pune',
  'Vishwakarma Institute of Technology',
  'Walchand College of Engineering Sangli',
  'D.Y. Patil College of Engineering',
  'SGGS Institute of Engineering and Technology Nanded',
  'Government College of Engineering Amravati',
  'Government College of Engineering Karad',
  'Bharati Vidyapeeth College of Engineering',
  'KJ Somaiya College of Engineering',
  'Fr Conceicao Rodrigues College of Engineering',
  'St Francis Institute of Technology',
  'Dwarkadas J Sanghvi College of Engineering',
  'Thakur College of Engineering',
  'Terna Engineering College',
  'Rajarshi Shahu College of Engineering',
  'Sardar Patel Institute of Technology',
  'Mukesh Patel School of Technology Management',
  'LD College of Engineering Ahmedabad',
  'Nirma University',
  'Dhirubhai Ambani Institute of Information and Communication Technology (DA-IICT)',
  'Pandit Deendayal Energy University (PDEU)',
  'GEC Gandhinagar',
  'UVPCE Ganpat University',
  'Government Engineering College Modasa',
  'CHARUSAT University',
  'Marwadi University',
  'GH Patel College of Engineering',
  'BVM Engineering College',
  'Chameli Devi Institute of Technology',
  'IES IPS Academy Indore',
  ' Oriental Institute of Science and Technology',
  'Acropolis Institute of Technology',
  'LNCT Bhopal',
  'OIST Bhopal',
  'TIT Bhopal',
  'RGPV Bhopal',
  'MITS Gwalior',
  'ABV-IIITM Gwalior',
  'Jabalpur Engineering College',
  'Shri G S Institute of Technology and Management Indore',
  'University Institute of Technology RGPV',
  'MNNIT Allahabad',
  'HBTI Kanpur',
  'IET Lucknow',
  'KIET Group of Institutions',
  'AKGEC Ghaziabad',
  'ABES Engineering College',
  'KCC Institute of Technology and Management',
  'JSS Academy of Technical Education Noida',
  'Galgotias College of Engineering',
  'Noida Institute of Engineering and Technology',
  'Babu Banarasi Das University',
  'Shri Ramswaroop Memorial University',
  'United College of Engineering and Research',
  'KNIT Sultanpur',
  'BIET Jhansi',
  'MPAE Banda',
  'Rajasthan Technical University Kota',
  'MBM University Jodhpur',
  'CTAE Udaipur',
  'SKIT Jaipur',
  'JECRC Jaipur',
  'Govind Ballabh Pant Institute of Engineering',
  'Maharana Pratap University of Agriculture and Technology',
  'Guru Ghasidas University',
  'SSGI Bhilai',
  'Rungta College of Engineering and Technology',
  'Shri Shankaracharya Technical Campus',
  'Bhilai Institute of Technology Durg',
  'Chhatrapati Shivaji Maharaj University',
  'Amity University Noida',
  'Amity University Mumbai',
  'Amity University Kolkata',
  'Amity University Jaipur',
  'Amity University Gurgaon',
  'Amity University Lucknow',
  'Amity University Patna',
  'Lovely Professional University (LPU)',
  'Chandigarh University',
  'Chitkara University',
  'Rayat Bahra University',
  'CT University',
  'GNA University',
  'Des Bhagat University',
  'IK Gujral Punjab Technical University (IKGPTU)',
  'Guru Nanak Dev University',
  'Punjab Engineering College (PEC)',
  'GZSCCET Bathinda',
  'DAVIET Jalandhar',
  'GNE Ludhiana',
  'SBSSTC Ferozepur',
  'BBSBEC Fatehgarh Sahib',
  'Sus College of Engineering',
  'Chandigarh College of Engineering',
  'Swami Vivekanand Institute of Engineering',
  'Guru Jambheshwar University of Science and Technology',
  'DCRUST Murthal',
  'YMCA University of Science and Technology Faridabad',
  'UIET Kurukshetra',
  'UIET Hoshiarpur',
  'NIT Kurukshetra',
  'JIIT Noida',
  'Manav Rachna University',
  'MRIIRS Faridabad',
  'NorthCap University',
  'GD Goenka University',
  'St Andrews Institute of Technology and Management',
  'BML Munjal University',
  'Apex University Jaipur',
  'Jagannath University',
  'Jaipur National University',
  'Suresh Gyan Vihar University',
  'Mody University',
  'Sri Balaji Technical Campus',
  'Sangam University',
  'Jagdish Chandra Mahato Memorial College',
  'Jadavpur University',
  'IIEST Shibpur',
  'Kalyani University',
  'MAKAUT',
  'Heritage Institute of Technology',
  'Techno India University',
  'IEM Kolkata',
  'BP Poddar Institute of Management and Technology',
  'Meghnad Saha Institute of Technology',
  'Narula Institute of Technology',
  'GCETTB',
  'Dr B C Roy Engineering College',
  'Asansol Engineering College',
  'Kalyani Government Engineering College',
  'Govt College of Engineering and Ceramic Technology',
  'MSIT Kolkata',
  'Techno International New Town',
  'Netaji Subhash Engineering College',
  'Aryabhatta Knowledge University',
  'Birla Institute of Technology Mesra',
  'National Institute of Foundry and Forge Technology (NIFFT)',
  'Cambridge Institute of Technology Ranchi',
  'SSITTM Dhanbad',
  'Government College of Engineering Keonjhar',
  'IGIT Sarang',
  'VSSUT Burla',
  'GCE Keonjhar',
  'Centurion University of Technology and Management',
  'CV Raman Global University',
  'Gandhi Institute for Technological Advancement (GITA)',
  'KISD College',
  'Sri Vasavi Engineering College',
  'VR Siddhartha Engineering College',
  'SRKR Engineering College',
  'GMR Institute of Technology',
  'Lendi Institute of Engineering and Technology',
  'Raghu Engineering College',
  'Anil Neerukonda Institute of Technology',
  'Vignan Institute of Information Technology',
  'Vishnu SRS Institute',
  'Andhra University College of Engineering',
  'GVP College of Engineering',
  'JNTUA College of Engineering Anantapur',
  'JNTUK University College of Engineering Vizianagaram',
  'RGUKT (IIIT) Nuzvid',
  'RGUKT (IIIT) RK Valley',
  'RGUKT (IIIT) Srikakulam',
  'RGUKT (IIIT) Ongole',
  'Sri Krishnadevaraya University College of Engineering',
  'Sri City IIIT',
  'Saveetha Engineering College',
  'Vel Tech Rangarajan Dr Sagunthala R&D Institute',
  'St Josephs College of Engineering',
  'RMK Engineering College',
  'RMKV College of Engineering',
  'Vels University',
  'MIT Academy of Engineering',
  'Velammal Engineering College',
  'Sri Sairam Engineering College',
  'Rajalakshmi Engineering College',
  'Jerusalem College of Engineering',
  'TJS Engineering College',
  'Apollo Engineering College',
  'Kingston Engineering College',
  'Bharath University',
  'Satyabhama University',
  'MNM Jain Engineering College',
  'Sri Venkateswara College of Engineering',
  'Panimalar Engineering College',
  'Panimalar Institute of Technology',
  'St Peters Engineering College',
  'Aarupadai Veedu Institute of Technology',
  'Bannari Amman Institute of Technology',
  'Mahendra Engineering College',
  'Narasu Sarathy Institute of Technology',
  'Government Engineering College Barton Hill',
  'TKM College of Engineering',
  'GEC Barton Hill',
  'GEC Thrissur',
  'GEC Kannur',
  'GEC Kozhikode',
  'GEC Wayanad',
  'Rajiv Gandhi Institute of Technology Kottayam',
  'Toc H Institute of Science and Technology',
  'Viswajyothi College of Engineering',
  'Sree Buddha College of Engineering',
  'Mangalam College of Engineering',
  'Mar Athanasius College of Engineering',
  'SCMS School of Engineering and Technology',
  'Adi Shankara Institute of Engineering and Technology',
  'Vimal Jyothi Engineering College',
  'Government Engineering College for Women',
  'KPR Institute of Engineering and Technology',
  'Narasaraopeta Engineering College',
  'Sasi Institute of Technology',
  'Srinivasa Institute of Engineering',
  'Gudlavalleru Engineering College',
  'Sri Vasavi Engineering College Tadepalligudem',
  'Godavari Institute of Engineering and Technology',
  'Bapatla Engineering College',
  'Andhra Loyola Institute of Engineering',
  'Sir C R Reddy College of Engineering',
  'GVPW College of Engineering',
  'Andhra Engineering College',
  'University of Hyderabad',
  'Tata Institute of Fundamental Research (TIFR)',
  'Indian Institute of Science (IISc) Bangalore',
  'Indian Statistical Institute (ISI) Kolkata',
  'Indian Institute of Information Technology and Management Kerala',
  'IGNOU',
  'Annamalai University',
  'Madurai Kamaraj University',
  'Bharathidasan University',
  'Alagappa University',
  'Manonmaniam Sundaranar University',
  'Mother Teresa Womens University',
  'University of Madras',
  'University of Mumbai',
  'University of Pune (SPPU)',
  'University of Calcutta',
  'University of Delhi',
  'Jamia Millia Islamia',
  'Jawaharlal Nehru University (JNU)',
  'Banaras Hindu University (BHU)',
  'Aligarh Muslim University (AMU)',
  'Osmania University',
  'Kakatiya University',
  'Nagarjuna University',
  'Acharya Nagarjuna University',
  'Sri Venkateswara University',
  'Andhra University',
  'Telugu University',
  'Gitam University',
  'Sri Padmavati Mahila Visvavidyalayam',
  'Vikrama Simhapuri University',
  'Dravidian University',
  'Krishna University',
  'Rayalaseema University',
  'Yogi Vemana University',
  'Vignan University',
  'Damodaram Sanjivayya National Law University',
  'Dibrugarh University',
  'Tezpur University',
  'Assam University Silchar',
  'Gauhati University',
  'Assam Science and Technology University',
  'Don Bosco University',
  'Royal School of Engineering and Technology',
  'NIT Arunachal Pradesh',
  'NIT Manipur',
  'NIT Meghalaya',
  'NIT Mizoram',
  'NIT Nagaland',
  'NIT Sikkim',
  'NIT Agartala',
  'Other',
];

export const IT_ROLES: string[] = [
  'Software Developer',
  'Java Developer',
  'Python Developer',
  'Full Stack Developer',
  'Frontend Developer',
  'Backend Developer',
  'Data Analyst',
  'Data Scientist',
  'AI/ML Engineer',
  'Cloud Engineer',
  'DevOps Engineer',
  'Cybersecurity Analyst',
  'Database Developer',
  'Application Support Engineer',
  'Other',
];
