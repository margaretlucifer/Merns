import { Router, Request, Response } from 'express';
import { db } from './db';
import { GoogleGenAI } from '@google/genai';
import { User, Ticket, EventItem, NoteItem, StudyTask, MarketplaceProject, Proposal, ExpenseRecord, TodoItem, NotificationItem } from '../types';

export const apiRouter = Router();

// Current session helper
function getCurrentUser(req: Request): User {
  const userId = req.headers['x-user-id'] as string || req.cookies?.user_id;
  const users = db.get().users;
  if (userId) {
    const found = users.find(u => u.id === userId);
    if (found) return found;
  }
  // Default to student Aarav Sharma
  return users[0];
}

/* ==========================================================================
   1. AUTHENTICATION & ROLE MANAGEMENT
   ========================================================================== */
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  res.json({ success: true, user });
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  const { email } = req.body;
  const user = db.get().users.find(u => u.email.toLowerCase() === (email || '').toLowerCase()) || db.get().users[0];
  res.cookie('user_id', user.id, { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true, user, message: `Welcome back, ${user.name}` });
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  const { name, email, role = 'student', department = 'Computer Science & Engineering' } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'Name and email are required' });
  }

  const newUser: User = {
    id: `usr_${Date.now()}`,
    name,
    email,
    role: role || 'student',
    avatarUrl: '/src/assets/images/digital_id_student_1791650581125.jpg',
    department,
    collegeName: 'Indian Institute of Technology & Engineering, Bengaluru',
    enrollmentNumber: `ED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    academicYear: '1st Year',
    semester: 1,
    phone: '+91 98000 00000',
    createdAt: new Date().toISOString(),
  };

  db.update(d => {
    d.users.push(newUser);
    d.auditLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: name,
      action: 'USER_REGISTERED',
      details: `New account registered with role: ${role}`,
      status: 'success',
    });
  });

  res.cookie('user_id', newUser.id, { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true, user: newUser });
});

apiRouter.post('/auth/switch-role', (req: Request, res: Response) => {
  const { role } = req.body;
  const user = db.get().users.find(u => u.role === role);
  if (!user) {
    return res.status(404).json({ success: false, message: `No demo user found for role: ${role}` });
  }
  res.cookie('user_id', user.id, { httpOnly: true, sameSite: 'lax' });
  res.json({ success: true, user, message: `Active persona switched to ${user.name} (${user.role})` });
});

apiRouter.post('/auth/logout', (_req: Request, res: Response) => {
  res.clearCookie('user_id');
  res.json({ success: true, message: 'Logged out successfully' });
});

/* ==========================================================================
   2. EVENTS & TICKET MANAGER
   ========================================================================== */
apiRouter.get('/events', (_req: Request, res: Response) => {
  res.json({ success: true, events: db.get().events });
});

apiRouter.post('/events', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { title, description, category, date, time, venue, capacity, isPaid, priceINR, tags } = req.body;

  if (!title || !date || !venue) {
    return res.status(400).json({ success: false, message: 'Title, date, and venue are mandatory' });
  }

  const newEvent: EventItem = {
    id: `evt_${Date.now()}`,
    title,
    description: description || 'Exciting campus event.',
    category: category || 'workshop',
    organizer: user.name,
    organizerId: user.id,
    date,
    time: time || '10:00 AM IST',
    venue,
    capacity: Number(capacity) || 100,
    registeredCount: 0,
    isPaid: Boolean(isPaid),
    priceINR: Number(priceINR) || 0,
    image: '/src/assets/images/hero_campus_life_1791650542236.jpg',
    status: 'upcoming',
    tags: Array.isArray(tags) ? tags : ['Campus Event'],
  };

  db.update(d => {
    d.events.unshift(newEvent);
    d.auditLogs.unshift({
      id: `log_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: user.name,
      action: 'EVENT_CREATED',
      details: `Created campus event: ${title}`,
      status: 'success',
    });
  });

  res.json({ success: true, event: newEvent });
});

apiRouter.post('/events/:id/register', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const eventId = req.params.id;
  const event = db.get().events.find(e => e.id === eventId);

  if (!event) {
    return res.status(404).json({ success: false, message: 'Event not found' });
  }

  const existingTicket = db.get().tickets.find(t => t.eventId === eventId && t.userId === user.id && t.status === 'valid');
  if (existingTicket) {
    return res.status(400).json({ success: false, message: 'You already hold an active ticket for this event', ticket: existingTicket });
  }

  const ticketNumber = `EDU-TKT-2026-${Math.floor(10000 + Math.random() * 90000)}`;
  const newTicket: Ticket = {
    id: `tkt_${Date.now()}`,
    ticketNumber,
    eventId: event.id,
    eventTitle: event.title,
    eventDate: event.date,
    eventVenue: event.venue,
    userId: user.id,
    userName: user.name,
    userEmail: user.email,
    pricePaidINR: event.priceINR,
    status: 'valid',
    qrCodeData: `EDUSPHERE-VERIFIED:${ticketNumber}:${user.id}:${event.id}:SECURE-AUTH`,
    purchasedAt: new Date().toISOString(),
  };

  db.update(d => {
    const target = d.events.find(e => e.id === eventId);
    if (target) {
      target.registeredCount += 1;
    }
    d.tickets.unshift(newTicket);
    d.notifications.unshift({
      id: `notif_${Date.now()}`,
      userId: user.id,
      title: `Registration Confirmed: ${event.title}`,
      message: `Your ticket #${ticketNumber} has been issued. Show the digital QR pass at the venue entrance.`,
      type: 'ticket',
      read: false,
      link: '/events',
      createdAt: new Date().toISOString(),
    });
  });

  res.json({ success: true, message: 'Registration confirmed! Ticket issued.', ticket: newTicket });
});

apiRouter.get('/tickets', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const tickets = db.get().tickets.filter(t => t.userId === user.id);
  res.json({ success: true, tickets });
});

apiRouter.post('/tickets/verify', (req: Request, res: Response) => {
  const { qrCodeData } = req.body;
  if (!qrCodeData) {
    return res.status(400).json({ success: false, message: 'QR data is required' });
  }

  const ticket = db.get().tickets.find(t => t.qrCodeData === qrCodeData);
  if (!ticket) {
    return res.json({ success: false, verified: false, message: 'Invalid or fraudulent ticket signature.' });
  }

  res.json({
    success: true,
    verified: true,
    ticketNumber: ticket.ticketNumber,
    attendee: ticket.userName,
    event: ticket.eventTitle,
    venue: ticket.eventVenue,
    status: ticket.status,
    issuedAt: ticket.purchasedAt,
  });
});

/* ==========================================================================
   3. STUDENT ACADEMIC RECORDS & ATTENDANCE
   ========================================================================== */
apiRouter.get('/students/record', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const record = db.get().academicRecords.find(r => r.userId === user.id) || db.get().academicRecords[0];
  res.json({ success: true, record });
});

apiRouter.post('/students/attendance', (req: Request, res: Response) => {
  const { subjectCode, action } = req.body; // action: 'present' | 'absent'
  const record = db.get().academicRecords[0];
  const subject = record.subjects.find(s => s.code === subjectCode);

  if (!subject) {
    return res.status(404).json({ success: false, message: 'Subject not found' });
  }

  db.update(d => {
    const sub = d.academicRecords[0].subjects.find(s => s.code === subjectCode);
    if (sub) {
      sub.attendanceTotal += 1;
      if (action === 'present') {
        sub.attendancePresent += 1;
      }
    }
  });

  res.json({ success: true, message: `Attendance updated for ${subject.name}`, subject });
});

/* ==========================================================================
   4. DIGITAL STUDENT ID CARD
   ========================================================================== */
apiRouter.get('/digital-id', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const digitalId = {
    studentName: user.name,
    studentId: user.enrollmentNumber || 'ED-2023-CS-0428',
    department: user.department,
    college: user.collegeName,
    academicYear: user.academicYear || '3rd Year (2023-2027)',
    semester: user.semester || 6,
    validUntil: 'July 2027',
    bloodGroup: 'B+',
    status: 'ACTIVE_VERIFIED',
    photoUrl: user.avatarUrl || '/src/assets/images/digital_id_student_1791650581125.jpg',
    qrPayload: `EDUSPHERE-ID:${user.enrollmentNumber || 'ED-2023-CS-0428'}:ACTIVE:AUTHENTICATED`,
  };
  res.json({ success: true, digitalId });
});

/* ==========================================================================
   5. WHATIF AI (CAREER & ACADEMIC SIMULATOR) & TOOLSCOUT AI
   ========================================================================== */
apiRouter.post('/ai/whatif', async (req: Request, res: Response) => {
  const { currentSemester, careerGoal, skills, favoriteSubjects, hoursPerWeek } = req.body;

  const promptText = `
You are an expert Indian University Engineering and Tech Career Counselor for EduSphere.
Student Profile:
- Semester: ${currentSemester || '6th Semester'}
- Career Goal: ${careerGoal || 'Full-Stack AI & Cloud Systems Engineer'}
- Current Skills: ${skills || 'React, TypeScript, Python, SQL, Docker'}
- Favorite Subjects: ${favoriteSubjects || 'Distributed Systems, Machine Learning'}
- Study Availability: ${hoursPerWeek || 15} hours/week

Provide a structured, deeply practical 4-step career roadmap for this Indian engineering student including:
1. Pathway Summary & Market Demand in India (Bengaluru/Hyderabad/NCR).
2. High-Impact Capstone Projects to build (with exact tech stack).
3. Recommended Certifications & Open Source Contributions.
4. Estimated Preparation Timeline to achieve placement readiness.

Return clear, engaging Markdown formatted advice without generic fluff.
`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const ai = new GoogleGenAI();
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptText,
      });

      if (response && response.text) {
        return res.json({ success: true, roadmap: response.text });
      }
    }
  } catch (err) {
    console.warn('[WhatIf AI] Gemini API fallback triggered:', err);
  }

  // Realistic Fallback Simulation
  const fallbackRoadmap = `### 🎯 Strategic Career Pathway: ${careerGoal || 'Cloud & AI Engineer'}
*Simulated based on Tier-1 Indian Campus Placement & Global Remote Hiring benchmarks.*

#### 1. Industry Landscape & Market Position
- **Demand Index**: Very High across top tier product firms, unicorns, and global capability centres (GCCs) in Bengaluru & Hyderabad.
- **Campus Placement Target**: ₹14 LPA - ₹28 LPA entry-level CTC bracket.

#### 2. Recommended High-Impact Capstone Projects
- **Project Alpha: Distributed Agentic Task Orchestrator**
  - *Tech Stack*: Go / TypeScript, Docker, Redis, Gemini API, Vector DB.
  - *Differentiator*: Show real-time streaming, idempotent execution, and partition recovery.
- **Project Beta: Campus Micro-Service Observability Platform**
  - *Tech Stack*: Prometheus metrics, OpenTelemetry, React dashboard, Grafana.

#### 3. High-Value Certifications & Skill Upgrades
- AWS Certified Solutions Architect Associate (SAA-C03)
- Kubernetes Certified Application Developer (CKAD)
- Contributor badge on popular open-source CNCF / GenAI repositories.

#### 4. Estimated Preparation Timeline (${hoursPerWeek || 15} hrs/week)
- **Months 1-2**: Advanced Data Structures & Algorithm Mastery (Dynamic Programming, Graphs, Trie).
- **Months 3-4**: System Design fundamentals (Caching, Sharding, Message Queues).
- **Months 5-6**: Mock technical interviews, open-source pull requests & portfolio polish.`;

  res.json({ success: true, roadmap: fallbackRoadmap, note: 'Generated with EduSphere Career Engine' });
});

apiRouter.post('/ai/toolscout', async (req: Request, res: Response) => {
  const { query, category } = req.body;

  const defaultTools = [
    {
      name: 'Vite & React 19',
      category: 'Web Development',
      pricing: 'Free & Open Source',
      difficulty: 'Intermediate',
      url: 'https://vite.dev',
      description: 'Ultra-fast Next-generation frontend tooling with instant hot module replacement.',
      pros: ['Sub-second cold start', 'Seamless TypeScript support', 'Lightweight runtime'],
    },
    {
      name: 'Supabase / PostgreSQL',
      category: 'Database & Backend',
      pricing: 'Free Tier Available',
      difficulty: 'Beginner-Friendly',
      url: 'https://supabase.com',
      description: 'Open source Firebase alternative providing real-time Postgres, Auth, and Storage.',
      pros: ['Relational data integrity', 'Row-level security', 'Generous free tier'],
    },
    {
      name: 'Google Gemini 2.5 Flash SDK',
      category: 'Artificial Intelligence',
      pricing: 'Free Tier with API Key',
      difficulty: 'Intermediate',
      url: 'https://ai.google.dev',
      description: 'Cutting-edge multimodal model capable of high-throughput reasoning, code generation, and low latency.',
      pros: ['1M token context window', 'Native multimodal audio/visual processing', 'Fast JSON responses'],
    },
    {
      name: 'Figma',
      category: 'UI/UX Design',
      pricing: 'Free for Students',
      difficulty: 'Beginner',
      url: 'https://figma.com',
      description: 'Collaborative cloud interface design tool standard across the technology industry.',
      pros: ['Live multi-user editing', 'Robust component auto-layout', 'Free student verification license'],
    },
  ];

  res.json({ success: true, tools: defaultTools });
});

/* ==========================================================================
   6. NOTES LIBRARY
   ========================================================================== */
apiRouter.get('/notes', (_req: Request, res: Response) => {
  res.json({ success: true, notes: db.get().notes });
});

apiRouter.post('/notes', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { title, subject, semester, description, tags } = req.body;

  if (!title || !subject) {
    return res.status(400).json({ success: false, message: 'Title and subject are required' });
  }

  const newNote: NoteItem = {
    id: `nt_${Date.now()}`,
    title,
    subject,
    semester: Number(semester) || 6,
    uploadedBy: user.id,
    uploadedByName: user.name,
    fileUrl: '/uploads/sample_lecture_document.pdf',
    fileSize: '2.5 MB',
    fileType: 'pdf',
    downloads: 1,
    bookmarks: 0,
    createdAt: new Date().toISOString(),
    tags: Array.isArray(tags) ? tags : ['Handwritten', 'Exam Prep'],
    description: description || 'Academic notes shared for university batch.',
  };

  db.update(d => {
    d.notes.unshift(newNote);
  });

  res.json({ success: true, note: newNote });
});

apiRouter.post('/notes/:id/bookmark', (req: Request, res: Response) => {
  const note = db.get().notes.find(n => n.id === req.params.id);
  if (!note) return res.status(404).json({ success: false, message: 'Note not found' });

  db.update(d => {
    const target = d.notes.find(n => n.id === req.params.id);
    if (target) target.bookmarks += 1;
  });

  res.json({ success: true, message: 'Note bookmarked!' });
});

/* ==========================================================================
   7. STUDY PLANNER
   ========================================================================== */
apiRouter.get('/study-plans', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const tasks = db.get().studyTasks.filter(t => t.userId === user.id);
  res.json({
    success: true,
    tasks,
    streakDays: 5,
    weeklyTargetHours: 18,
    completedHours: 12.5,
  });
});

apiRouter.post('/study-plans/tasks', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { title, subject, estimatedMinutes, dueDate, priority, notes } = req.body;

  if (!title || !subject) {
    return res.status(400).json({ success: false, message: 'Title and subject are required' });
  }

  const newTask: StudyTask = {
    id: `tsk_${Date.now()}`,
    userId: user.id,
    title,
    subject,
    estimatedMinutes: Number(estimatedMinutes) || 60,
    dueDate: dueDate || new Date().toISOString().split('T')[0],
    priority: priority || 'medium',
    completed: false,
    notes,
  };

  db.update(d => {
    d.studyTasks.push(newTask);
  });

  res.json({ success: true, task: newTask });
});

apiRouter.patch('/study-plans/tasks/:id/toggle', (req: Request, res: Response) => {
  const task = db.get().studyTasks.find(t => t.id === req.params.id);
  if (!task) return res.status(404).json({ success: false, message: 'Task not found' });

  let updatedState = false;
  db.update(d => {
    const target = d.studyTasks.find(t => t.id === req.params.id);
    if (target) {
      target.completed = !target.completed;
      updatedState = target.completed;
    }
  });

  res.json({ success: true, completed: updatedState });
});

/* ==========================================================================
   8. NEXORA FREELANCING MARKETPLACE
   ========================================================================== */
apiRouter.get('/marketplace/projects', (_req: Request, res: Response) => {
  res.json({ success: true, projects: db.get().projects });
});

apiRouter.post('/marketplace/projects', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { title, description, category, budgetINR, deadline, requiredSkills } = req.body;

  if (!title || !budgetINR) {
    return res.status(400).json({ success: false, message: 'Title and budget are mandatory' });
  }

  const newProject: MarketplaceProject = {
    id: `proj_${Date.now()}`,
    title,
    description: description || 'Campus freelancing gig.',
    category: category || 'web_dev',
    clientId: user.id,
    clientName: user.name,
    budgetINR: Number(budgetINR),
    deadline: deadline || '2026-11-15',
    requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : ['React', 'Design'],
    proposalsCount: 0,
    status: 'open',
    createdAt: new Date().toISOString(),
  };

  db.update(d => {
    d.projects.unshift(newProject);
  });

  res.json({ success: true, project: newProject });
});

apiRouter.get('/marketplace/proposals', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const proposals = db.get().proposals.filter(p => p.freelancerId === user.id);
  res.json({ success: true, proposals });
});

apiRouter.post('/marketplace/proposals', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { projectId, coverLetter, proposedBudgetINR, deliveryDays } = req.body;

  const project = db.get().projects.find(p => p.id === projectId);
  if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

  const newProposal: Proposal = {
    id: `prop_${Date.now()}`,
    projectId,
    projectTitle: project.title,
    freelancerId: user.id,
    freelancerName: user.name,
    coverLetter: coverLetter || 'I can deliver this project with high quality.',
    proposedBudgetINR: Number(proposedBudgetINR) || project.budgetINR,
    deliveryDays: Number(deliveryDays) || 7,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };

  db.update(d => {
    d.proposals.push(newProposal);
    const proj = d.projects.find(p => p.id === projectId);
    if (proj) proj.proposalsCount += 1;
  });

  res.json({ success: true, proposal: newProposal, message: 'Proposal submitted successfully!' });
});

apiRouter.post('/marketplace/proposals/:id/accept', (req: Request, res: Response) => {
  const proposalId = req.params.id;
  const proposal = db.get().proposals.find(p => p.id === proposalId);
  if (!proposal) return res.status(404).json({ success: false, message: 'Proposal not found' });

  db.update(d => {
    const prop = d.proposals.find(p => p.id === proposalId);
    if (prop) prop.status = 'accepted';
    const proj = d.projects.find(p => p.id === proposal.projectId);
    if (proj) {
      proj.status = 'in_progress';
      proj.assignedFreelancerId = proposal.freelancerId;
      proj.assignedFreelancerName = proposal.freelancerName;
    }
  });

  res.json({ success: true, message: 'Proposal accepted! Project marked in progress.' });
});

/* ==========================================================================
   9. EXPENSE TRACKER
   ========================================================================== */
apiRouter.get('/expenses', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const list = db.get().expenses.filter(e => e.userId === user.id);
  const totalIncome = list.filter(e => e.type === 'income').reduce((acc, curr) => acc + curr.amountINR, 0);
  const totalExpense = list.filter(e => e.type === 'expense').reduce((acc, curr) => acc + curr.amountINR, 0);

  res.json({
    success: true,
    expenses: list,
    summary: {
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      monthlyBudget: 12000,
      budgetRemaining: 12000 - totalExpense,
    },
  });
});

apiRouter.post('/expenses', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { type, category, amountINR, description, date } = req.body;

  if (!amountINR || !category) {
    return res.status(400).json({ success: false, message: 'Amount and category are required' });
  }

  const newRecord: ExpenseRecord = {
    id: `exp_${Date.now()}`,
    userId: user.id,
    type: type === 'income' ? 'income' : 'expense',
    category,
    amountINR: Number(amountINR),
    date: date || new Date().toISOString().split('T')[0],
    description: description || 'Campus transaction',
  };

  db.update(d => {
    d.expenses.unshift(newRecord);
  });

  res.json({ success: true, expense: newRecord });
});

/* ==========================================================================
   10. SCHOLARSHIP FINDER & MATCHING
   ========================================================================== */
apiRouter.get('/scholarships', (_req: Request, res: Response) => {
  res.json({ success: true, scholarships: db.get().scholarships });
});

apiRouter.post('/scholarships/match', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const studentRecord = db.get().academicRecords.find(r => r.userId === user.id) || db.get().academicRecords[0];
  const all = db.get().scholarships;

  const matched = all.map(s => {
    const cgpaOk = studentRecord.cgpa >= s.minCGPA;
    const isDeptEligible = s.eligibleDepartments.includes('All Departments') || s.eligibleDepartments.includes(studentRecord.department);
    const eligible = cgpaOk && isDeptEligible;

    return {
      ...s,
      isEligible: eligible,
      matchReason: eligible
        ? `Meets CGPA requirement (${studentRecord.cgpa} >= ${s.minCGPA}) and department criteria.`
        : `Requires minimum CGPA of ${s.minCGPA} (Current: ${studentRecord.cgpa}).`,
    };
  });

  res.json({ success: true, scholarships: matched });
});

/* ==========================================================================
   11. ECOROUTE AI (CAMPUS TRANSIT & LOGISTICS)
   ========================================================================== */
apiRouter.get('/ecoroute/locations', (_req: Request, res: Response) => {
  res.json({ success: true, locations: db.get().campusLocations });
});

apiRouter.get('/ecoroute/tasks', (_req: Request, res: Response) => {
  res.json({ success: true, tasks: db.get().deliveryTasks });
});

apiRouter.post('/ecoroute/calculate', (req: Request, res: Response) => {
  const { originId, destinationId } = req.body;
  const locations = db.get().campusLocations;
  const origin = locations.find(l => l.id === originId) || locations[0];
  const dest = locations.find(l => l.id === destinationId) || locations[1];

  // Euclidean distance proxy for campus layout
  const distKm = Math.max(0.6, Number((Math.hypot(origin.lat - dest.lat, origin.lng - dest.lng) * 111).toFixed(1)));
  const travelMinutes = Math.round(distKm * 4.5);
  const co2SavedKg = Number((distKm * 0.28).toFixed(2));

  res.json({
    success: true,
    route: {
      origin: origin.name,
      destination: dest.name,
      distanceKm: distKm,
      estimatedMinutes: travelMinutes,
      co2SavedKg,
      batteryUsedPercent: Math.round(distKm * 2.2),
      recommendedVehicle: 'Electric Campus Shuttle',
    },
  });
});

/* ==========================================================================
   12. BASKETWISE PRICE COMPARISON
   ========================================================================== */
apiRouter.get('/products', (_req: Request, res: Response) => {
  res.json({ success: true, products: db.get().products });
});

/* ==========================================================================
   13. LOST & FOUND
   ========================================================================== */
apiRouter.get('/lost-found', (_req: Request, res: Response) => {
  res.json({ success: true, items: db.get().lostFoundItems });
});

apiRouter.post('/lost-found', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { type, title, category, location, description } = req.body;

  if (!title || !location) {
    return res.status(400).json({ success: false, message: 'Title and location are required' });
  }

  const newItem = {
    id: `lf_${Date.now()}`,
    type: type === 'found' ? ('found' as const) : ('lost' as const),
    title,
    category: category || 'Personal Essentials',
    location,
    date: new Date().toISOString().split('T')[0],
    description: description || 'Reported on EduSphere campus board.',
    reportedBy: user.id,
    reportedByName: user.name,
    status: 'active' as const,
    contactWorkflow: 'Submit verified student identification via campus desk',
  };

  db.update(d => {
    d.lostFoundItems.unshift(newItem);
  });

  res.json({ success: true, item: newItem });
});

/* ==========================================================================
   14. QUIZ LEARNING PORTAL
   ========================================================================== */
apiRouter.get('/quizzes', (_req: Request, res: Response) => {
  // Strip correct answer for student overview
  const quizzes = db.get().quizzes.map(q => ({
    id: q.id,
    title: q.title,
    subject: q.subject,
    timeLimitMinutes: q.timeLimitMinutes,
    totalMarks: q.totalMarks,
    questionsCount: q.questions.length,
    attemptsCount: q.attemptsCount,
    authorName: q.authorName,
  }));
  res.json({ success: true, quizzes });
});

apiRouter.get('/quizzes/:id', (req: Request, res: Response) => {
  const quiz = db.get().quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  // Return questions with options, but don't expose correct answers before submission
  const safeQuestions = quiz.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
  }));

  res.json({
    success: true,
    quiz: {
      ...quiz,
      questions: safeQuestions,
    },
  });
});

apiRouter.post('/quizzes/:id/submit', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const quiz = db.get().quizzes.find(q => q.id === req.params.id);
  if (!quiz) return res.status(404).json({ success: false, message: 'Quiz not found' });

  const answers: Record<string, number> = req.body.answers || {};
  let score = 0;
  const review = quiz.questions.map(q => {
    const studentChoice = answers[q.id];
    const isCorrect = studentChoice === q.correctOptionIndex;
    if (isCorrect) score += quiz.totalMarks / quiz.questions.length;

    return {
      id: q.id,
      question: q.question,
      options: q.options,
      chosenOption: studentChoice,
      correctOption: q.correctOptionIndex,
      isCorrect,
      explanation: q.explanation,
    };
  });

  const finalScore = Math.round(score);
  const percentage = Math.round((finalScore / quiz.totalMarks) * 100);

  const attempt = {
    id: `att_${Date.now()}`,
    quizId: quiz.id,
    quizTitle: quiz.title,
    userId: user.id,
    userName: user.name,
    score: finalScore,
    totalMarks: quiz.totalMarks,
    percentage,
    completedAt: new Date().toISOString(),
  };

  db.update(d => {
    const qTarget = d.quizzes.find(q => q.id === quiz.id);
    if (qTarget) qTarget.attemptsCount += 1;
    d.quizAttempts.unshift(attempt);
  });

  res.json({
    success: true,
    score: finalScore,
    totalMarks: quiz.totalMarks,
    percentage,
    review,
  });
});

apiRouter.get('/quizzes/:id/leaderboard', (_req: Request, res: Response) => {
  const attempts = db.get().quizAttempts;
  res.json({ success: true, attempts });
});

/* ==========================================================================
   15. GLOBAL TO-DO LIST
   ========================================================================== */
apiRouter.get('/todos', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const todos = db.get().todos.filter(t => t.userId === user.id);
  res.json({ success: true, todos });
});

apiRouter.post('/todos', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const { text, priority = 'medium' } = req.body;
  if (!text) return res.status(400).json({ success: false, message: 'Task text is required' });

  const newTodo: TodoItem = {
    id: `td_${Date.now()}`,
    userId: user.id,
    text,
    completed: false,
    priority,
    createdAt: new Date().toISOString(),
  };

  db.update(d => {
    d.todos.unshift(newTodo);
  });

  res.json({ success: true, todo: newTodo });
});

apiRouter.patch('/todos/:id/toggle', (req: Request, res: Response) => {
  let state = false;
  db.update(d => {
    const item = d.todos.find(t => t.id === req.params.id);
    if (item) {
      item.completed = !item.completed;
      state = item.completed;
    }
  });

  res.json({ success: true, completed: state });
});

apiRouter.delete('/todos/:id', (req: Request, res: Response) => {
  db.update(d => {
    d.todos = d.todos.filter(t => t.id !== req.params.id);
  });
  res.json({ success: true });
});

/* ==========================================================================
   16. NOTIFICATIONS
   ========================================================================== */
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  const notifications = db.get().notifications.filter(n => n.userId === user.id);
  res.json({ success: true, notifications });
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  db.update(d => {
    const n = d.notifications.find(item => item.id === req.params.id);
    if (n) n.read = true;
  });
  res.json({ success: true });
});

apiRouter.post('/notifications/read-all', (req: Request, res: Response) => {
  const user = getCurrentUser(req);
  db.update(d => {
    d.notifications.forEach(n => {
      if (n.userId === user.id) n.read = true;
    });
  });
  res.json({ success: true });
});

/* ==========================================================================
   17. ADMINISTRATOR CONSOLE
   ========================================================================== */
apiRouter.get('/admin/stats', (_req: Request, res: Response) => {
  const data = db.get();
  res.json({
    success: true,
    stats: {
      totalUsers: data.users.length,
      activeStudents: data.users.filter(u => u.role === 'student').length,
      facultyAccounts: data.users.filter(u => u.role === 'faculty').length,
      publishedEvents: data.events.length,
      ticketsIssued: data.tickets.length,
      marketplaceVolumeINR: data.projects.reduce((sum, p) => sum + p.budgetINR, 0),
      notesUploaded: data.notes.length,
      quizAttempts: data.quizAttempts.length,
      auditLogsCount: data.auditLogs.length,
    },
  });
});

apiRouter.get('/admin/users', (_req: Request, res: Response) => {
  res.json({ success: true, users: db.get().users });
});

apiRouter.get('/admin/audit-logs', (_req: Request, res: Response) => {
  res.json({ success: true, logs: db.get().auditLogs });
});
