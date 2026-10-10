import {
  User,
  UserRole,
  EventItem,
  Ticket,
  StudentAcademicRecord,
  NoteItem,
  StudyTask,
  MarketplaceProject,
  Proposal,
  ExpenseRecord,
  ScholarshipItem,
  CampusLocation,
  DeliveryTask,
  ProductComparison,
  LostFoundItem,
  QuizItem,
  TodoItem,
  NotificationItem,
  AuditLogItem,
} from '../types';

const BASE_URL = '/api/v1';

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const currentUserId = localStorage.getItem('edusphere_active_user_id');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options?.headers as Record<string, string> || {}),
  };

  if (currentUserId) {
    headers['x-user-id'] = currentUserId;
  }

  const res = await fetch(`${BASE_URL}${url}`, {
    ...options,
    headers,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
}

export const api = {
  // Auth
  getMe: () => fetchJSON<{ success: boolean; user: User }>('/auth/me'),
  login: (email: string) => fetchJSON<{ success: boolean; user: User; message: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),
  register: (payload: { name: string; email: string; role?: UserRole; department?: string }) =>
    fetchJSON<{ success: boolean; user: User }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  switchRole: (role: UserRole) => fetchJSON<{ success: boolean; user: User; message: string }>('/auth/switch-role', {
    method: 'POST',
    body: JSON.stringify({ role }),
  }),
  logout: () => fetchJSON<{ success: boolean; message: string }>('/auth/logout', { method: 'POST' }),

  // Events & Tickets
  getEvents: () => fetchJSON<{ success: boolean; events: EventItem[] }>('/events'),
  createEvent: (eventData: Partial<EventItem>) =>
    fetchJSON<{ success: boolean; event: EventItem }>('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),
  registerForEvent: (eventId: string) =>
    fetchJSON<{ success: boolean; message: string; ticket: Ticket }>(`/events/${eventId}/register`, {
      method: 'POST',
    }),
  getTickets: () => fetchJSON<{ success: boolean; tickets: Ticket[] }>('/tickets'),
  verifyTicket: (qrCodeData: string) =>
    fetchJSON<{ success: boolean; verified: boolean; ticketNumber?: string; attendee?: string; event?: string; venue?: string; status?: string }>(
      '/tickets/verify',
      {
        method: 'POST',
        body: JSON.stringify({ qrCodeData }),
      }
    ),

  // Student Records & Attendance
  getStudentRecord: () => fetchJSON<{ success: boolean; record: StudentAcademicRecord }>('/students/record'),
  updateAttendance: (subjectCode: string, action: 'present' | 'absent') =>
    fetchJSON<{ success: boolean; message: string; subject: any }>('/students/attendance', {
      method: 'POST',
      body: JSON.stringify({ subjectCode, action }),
    }),

  // Digital ID
  getDigitalId: () => fetchJSON<{ success: boolean; digitalId: any }>('/digital-id'),

  // AI
  getWhatIfRoadmap: (payload: {
    currentSemester: string;
    careerGoal: string;
    skills: string;
    favoriteSubjects: string;
    hoursPerWeek: number;
  }) => fetchJSON<{ success: boolean; roadmap: string; note?: string }>('/ai/whatif', {
    method: 'POST',
    body: JSON.stringify(payload),
  }),
  getToolScoutRecommendations: (query?: string, category?: string) =>
    fetchJSON<{ success: boolean; tools: any[] }>('/ai/toolscout', {
      method: 'POST',
      body: JSON.stringify({ query, category }),
    }),

  // Notes Library
  getNotes: () => fetchJSON<{ success: boolean; notes: NoteItem[] }>('/notes'),
  uploadNote: (payload: Partial<NoteItem>) =>
    fetchJSON<{ success: boolean; note: NoteItem }>('/notes', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  bookmarkNote: (id: string) => fetchJSON<{ success: boolean; message: string }>(`/notes/${id}/bookmark`, { method: 'POST' }),

  // Study Planner
  getStudyPlans: () =>
    fetchJSON<{ success: boolean; tasks: StudyTask[]; streakDays: number; weeklyTargetHours: number; completedHours: number }>(
      '/study-plans'
    ),
  createStudyTask: (task: Partial<StudyTask>) =>
    fetchJSON<{ success: boolean; task: StudyTask }>('/study-plans/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),
  toggleStudyTask: (id: string) => fetchJSON<{ success: boolean; completed: boolean }>(`/study-plans/tasks/${id}/toggle`, {
    method: 'PATCH',
  }),

  // Nexora Marketplace
  getProjects: () => fetchJSON<{ success: boolean; projects: MarketplaceProject[] }>('/marketplace/projects'),
  createProject: (payload: Partial<MarketplaceProject>) =>
    fetchJSON<{ success: boolean; project: MarketplaceProject }>('/marketplace/projects', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  getProposals: () => fetchJSON<{ success: boolean; proposals: Proposal[] }>('/marketplace/proposals'),
  submitProposal: (payload: { projectId: string; coverLetter: string; proposedBudgetINR: number; deliveryDays: number }) =>
    fetchJSON<{ success: boolean; proposal: Proposal; message: string }>('/marketplace/proposals', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
  acceptProposal: (id: string) => fetchJSON<{ success: boolean; message: string }>(`/marketplace/proposals/${id}/accept`, {
    method: 'POST',
  }),

  // Expenses
  getExpenses: () =>
    fetchJSON<{
      success: boolean;
      expenses: ExpenseRecord[];
      summary: { totalIncome: number; totalExpense: number; balance: number; monthlyBudget: number; budgetRemaining: number };
    }>('/expenses'),
  createExpense: (payload: Partial<ExpenseRecord>) =>
    fetchJSON<{ success: boolean; expense: ExpenseRecord }>('/expenses', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Scholarships
  getScholarships: () => fetchJSON<{ success: boolean; scholarships: (ScholarshipItem & { isEligible?: boolean; matchReason?: string })[] }>('/scholarships'),
  matchScholarships: () => fetchJSON<{ success: boolean; scholarships: (ScholarshipItem & { isEligible?: boolean; matchReason?: string })[] }>('/scholarships/match', {
    method: 'POST',
  }),

  // EcoRoute AI
  getEcoLocations: () => fetchJSON<{ success: boolean; locations: CampusLocation[] }>('/ecoroute/locations'),
  getEcoTasks: () => fetchJSON<{ success: boolean; tasks: DeliveryTask[] }>('/ecoroute/tasks'),
  calculateEcoRoute: (originId: string, destinationId: string) =>
    fetchJSON<{ success: boolean; route: any }>('/ecoroute/calculate', {
      method: 'POST',
      body: JSON.stringify({ originId, destinationId }),
    }),

  // BasketWise
  getProducts: () => fetchJSON<{ success: boolean; products: ProductComparison[] }>('/products'),

  // Lost & Found
  getLostFound: () => fetchJSON<{ success: boolean; items: LostFoundItem[] }>('/lost-found'),
  reportLostFound: (payload: Partial<LostFoundItem>) =>
    fetchJSON<{ success: boolean; item: LostFoundItem }>('/lost-found', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Quizzes
  getQuizzes: () => fetchJSON<{ success: boolean; quizzes: any[] }>('/quizzes'),
  getQuizById: (id: string) => fetchJSON<{ success: boolean; quiz: any }>(`/quizzes/${id}`),
  submitQuiz: (id: string, answers: Record<string, number>) =>
    fetchJSON<{ success: boolean; score: number; totalMarks: number; percentage: number; review: any[] }>(`/quizzes/${id}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    }),
  getQuizLeaderboard: (id: string) => fetchJSON<{ success: boolean; attempts: any[] }>(`/quizzes/${id}/leaderboard`),

  // Global To-Do
  getTodos: () => fetchJSON<{ success: boolean; todos: TodoItem[] }>('/todos'),
  createTodo: (text: string, priority?: 'low' | 'medium' | 'high') =>
    fetchJSON<{ success: boolean; todo: TodoItem }>('/todos', {
      method: 'POST',
      body: JSON.stringify({ text, priority }),
    }),
  toggleTodo: (id: string) => fetchJSON<{ success: boolean; completed: boolean }>(`/todos/${id}/toggle`, { method: 'PATCH' }),
  deleteTodo: (id: string) => fetchJSON<{ success: boolean }>(`/todos/${id}`, { method: 'DELETE' }),

  // Notifications
  getNotifications: () => fetchJSON<{ success: boolean; notifications: NotificationItem[] }>('/notifications'),
  markNotificationRead: (id: string) => fetchJSON<{ success: boolean }>(`/notifications/${id}/read`, { method: 'PATCH' }),
  markAllNotificationsRead: () => fetchJSON<{ success: boolean }>('/notifications/read-all', { method: 'POST' }),

  // Admin
  getAdminStats: () => fetchJSON<{ success: boolean; stats: any }>('/admin/stats'),
  getAdminUsers: () => fetchJSON<{ success: boolean; users: User[] }>('/admin/users'),
  getAdminAuditLogs: () => fetchJSON<{ success: boolean; logs: AuditLogItem[] }>('/admin/audit-logs'),
};
