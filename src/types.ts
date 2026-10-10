export type UserRole = 'student' | 'faculty' | 'admin' | 'club_organizer' | 'freelancer' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  department: string;
  collegeName: string;
  enrollmentNumber?: string;
  academicYear?: string;
  semester?: number;
  phone?: string;
  bio?: string;
  createdAt: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  category: 'workshop' | 'hackathon' | 'cultural' | 'seminar' | 'sports' | 'club';
  organizer: string;
  organizerId: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  isPaid: boolean;
  priceINR: number;
  image: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  tags: string[];
}

export interface Ticket {
  id: string;
  ticketNumber: string;
  eventId: string;
  eventTitle: string;
  eventDate: string;
  eventVenue: string;
  userId: string;
  userName: string;
  userEmail: string;
  pricePaidINR: number;
  status: 'valid' | 'used' | 'cancelled';
  qrCodeData: string;
  purchasedAt: string;
}

export interface SubjectRecord {
  code: string;
  name: string;
  credits: number;
  facultyName: string;
  attendancePresent: number;
  attendanceTotal: number;
  grade?: string;
  internalMarks?: number;
}

export interface StudentAcademicRecord {
  userId: string;
  studentId: string;
  department: string;
  course: string;
  currentYear: string;
  currentSemester: number;
  sgpa: number;
  cgpa: number;
  overallAttendancePercentage: number;
  subjects: SubjectRecord[];
  announcements: {
    id: string;
    title: string;
    content: string;
    date: string;
    faculty: string;
  }[];
}

export interface NoteItem {
  id: string;
  title: string;
  subject: string;
  semester: number;
  uploadedBy: string;
  uploadedByName: string;
  fileUrl: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'pptx' | 'zip';
  downloads: number;
  bookmarks: number;
  createdAt: string;
  tags: string[];
  description: string;
}

export interface StudyTask {
  id: string;
  userId: string;
  title: string;
  subject: string;
  estimatedMinutes: number;
  dueDate: string;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  notes?: string;
}

export interface MarketplaceProject {
  id: string;
  title: string;
  description: string;
  category: 'web_dev' | 'ui_ux' | 'content' | 'video' | 'data' | 'tutoring';
  clientId: string;
  clientName: string;
  budgetINR: number;
  deadline: string;
  requiredSkills: string[];
  proposalsCount: number;
  status: 'open' | 'in_progress' | 'completed';
  assignedFreelancerId?: string;
  assignedFreelancerName?: string;
  createdAt: string;
}

export interface Proposal {
  id: string;
  projectId: string;
  projectTitle: string;
  freelancerId: string;
  freelancerName: string;
  coverLetter: string;
  proposedBudgetINR: number;
  deliveryDays: number;
  status: 'pending' | 'accepted' | 'rejected';
  submittedAt: string;
}

export interface ExpenseRecord {
  id: string;
  userId: string;
  type: 'expense' | 'income';
  category: 'Food' | 'Books' | 'Travel' | 'Education' | 'Shopping' | 'Entertainment' | 'Freelancing' | 'Pocket Money' | 'Other';
  amountINR: number;
  date: string;
  description: string;
}

export interface ScholarshipItem {
  id: string;
  title: string;
  provider: string;
  amountINR: number;
  deadline: string;
  category: 'Merit' | 'Need-Based' | 'Women in STEM' | 'Departmental' | 'Government';
  minCGPA: number;
  maxAnnualIncomeINR: number;
  eligibleDepartments: string[];
  description: string;
  applicationUrl: string;
}

export interface CampusLocation {
  id: string;
  name: string;
  code: string;
  lat: number;
  lng: number;
  category: 'Hostel' | 'Academic' | 'Cafeteria' | 'Library' | 'Sports' | 'Gate';
}

export interface DeliveryTask {
  id: string;
  trackingId: string;
  origin: string;
  destination: string;
  itemType: string;
  distanceKm: number;
  status: 'scheduled' | 'in_transit' | 'delivered';
  co2SavedKg: number;
  vehicleType: 'Electric Shuttle' | 'E-Bike Courier' | 'Autonomous Rover';
}

export interface ProductComparison {
  id: string;
  name: string;
  category: 'Textbooks' | 'Stationery' | 'Electronics' | 'Hostel Essentials';
  campusStorePriceINR: number;
  onlinePriceINR: number;
  onlinePlatform: string;
  inStockCampus: boolean;
  savingsINR: number;
  rating: number;
  image: string;
}

export interface LostFoundItem {
  id: string;
  type: 'lost' | 'found';
  title: string;
  category: 'Electronics' | 'IDs & Cards' | 'Books' | 'Personal Essentials' | 'Clothing';
  location: string;
  date: string;
  description: string;
  reportedBy: string;
  reportedByName: string;
  status: 'active' | 'claimed' | 'resolved';
  contactWorkflow: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface QuizItem {
  id: string;
  title: string;
  subject: string;
  timeLimitMinutes: number;
  totalMarks: number;
  createdBy: string;
  authorName: string;
  questions: QuizQuestion[];
  attemptsCount: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  quizTitle: string;
  userId: string;
  userName: string;
  score: number;
  totalMarks: number;
  percentage: number;
  completedAt: string;
}

export interface TodoItem {
  id: string;
  userId: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'event' | 'ticket' | 'proposal' | 'quiz' | 'academic' | 'system';
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  details: string;
  status: 'success' | 'warning' | 'security_alert';
}
