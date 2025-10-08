import { PrismaClient } from '@/generated/prisma'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Database utility functions
export class DatabaseService {
  // User management
  static async createUser(data: {
    id: string
    email: string
    name: string
    role: 'STUDENT' | 'TEACHER'
    school_id?: number
    class?: string
  }) {
    return await prisma.user.create({
      data: {
        id: data.id,
        email: data.email,
        name: data.name,
        role: data.role,
        school_id: data.school_id,
        class: data.class,
      },
      include: {
        school: true,
      },
    })
  }

  static async createTeacher(data: {
    user_id: string
    subject?: string
    experience?: number
    school_id?: number
  }) {
    return await prisma.teacher.create({
      data: {
        user_id: data.user_id,
        subject: data.subject,
        experience: data.experience,
        school_id: data.school_id,
      },
      include: {
        user: true,
        school: true,
      },
    })
  }

  static async getUserWithProfile(user_id: string) {
    return await prisma.user.findUnique({
      where: { id: user_id },
      include: {
        school: true,
        teacher_profile: {
          include: {
            school: true,
          },
        },
        submissions: {
          include: {
            challenge: true,
          },
        },
        user_badges: {
          include: {
            badge: true,
          },
        },
      },
    })
  }

  // School management
  static async getSchools(options?: {
    city?: string
    state?: string
    search?: string
    limit?: number
  }) {
    const whereClause: any = {}

    if (options?.city) {
      whereClause.city = {
        contains: options.city,
        mode: 'insensitive',
      }
    }

    if (options?.state) {
      whereClause.state = {
        contains: options.state,
        mode: 'insensitive',
      }
    }

    if (options?.search) {
      whereClause.OR = [
        {
          name: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          city: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
        {
          state: {
            contains: options.search,
            mode: 'insensitive',
          },
        },
      ]
    }

    return await prisma.school.findMany({
      where: whereClause,
      orderBy: [
        { state: 'asc' },
        { city: 'asc' },
        { name: 'asc' },
      ],
      take: options?.limit,
    })
  }

  static async getCities() {
    const cities = await prisma.school.findMany({
      select: {
        city: true,
        state: true,
      },
      distinct: ['city'],
      orderBy: [
        { state: 'asc' },
        { city: 'asc' },
      ],
    })

    return cities.map(c => ({
      city: c.city,
      state: c.state,
    }))
  }

  static async getStates() {
    const states = await prisma.school.findMany({
      select: {
        state: true,
      },
      distinct: ['state'],
      orderBy: { state: 'asc' },
    })

    return states.map(s => s.state)
  }

  static async createSchool(data: {
    name: string
    address?: string
    city?: string
    state?: string
    country?: string
  }) {
    return await prisma.school.create({
      data: {
        name: data.name,
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country || 'India',
      },
    })
  }

  // Challenge management
  static async getChallenges() {
    return await prisma.challenge.findMany({
      orderBy: { created_at: 'desc' },
    })
  }

  static async createChallenge(data: {
    title: string
    description: string
    category: string
    points: number
    image_url?: string
    tutorial_url?: string
  }) {
    return await prisma.challenge.create({
      data,
    })
  }

  static async updateChallenge(id: number, data: {
    title?: string
    description?: string
    category?: string
    points?: number
    image_url?: string
    tutorial_url?: string
  }) {
    return await prisma.challenge.update({
      where: { id },
      data,
    })
  }

  static async deleteChallenge(id: number) {
    return await prisma.challenge.delete({
      where: { id },
    })
  }

  // Assignment management
  static async createAssignment(data: {
    teacher_id: number
    challenge_id: number
    school_id?: number
    class_name?: string
    due_date?: Date
  }) {
    return await prisma.teacherAssignment.create({
      data,
    })
  }

  static async getAssignmentsForSchool(school_id: number, class_name?: string) {
    return await prisma.teacherAssignment.findMany({
      where: {
        school_id,
        OR: [
          { class_name: null }, // All classes
          { class_name: class_name }, // Specific class
        ],
      },
      include: {
        challenge: true,
        teacher: {
          include: {
            user: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    })
  }

  // Submission management
  static async createSubmission(data: {
    student_id: string
    challenge_id: number
    assignment_id?: number
    description?: string
    image_url?: string
    file_url?: string
  }) {
    return await prisma.submission.create({
      data,
    })
  }

  static async getSubmissionsForTeacher(teacher_id: number) {
    return await prisma.submission.findMany({
      where: {
        OR: [
          { assignment: { teacher_id } },
          { challenge: { teacher_assignments: { some: { teacher_id } } } },
        ],
      },
      include: {
        student: true,
        challenge: true,
        assignment: true,
      },
      orderBy: { created_at: 'desc' },
    })
 }

 static async getAllSubmissions() {
   return await prisma.submission.findMany({
     include: {
       student: {
         select: { name: true },
       },
       challenge: {
         select: { title: true },
       },
     },
     orderBy: { created_at: 'desc' },
   })
 }

  static async updateSubmissionStatus(
    submission_id: number,
    status: 'PENDING' | 'APPROVED' | 'REJECTED',
    reviewed_by: number,
    notes?: string
  ) {
    const submission = await prisma.submission.update({
      where: { id: submission_id },
      data: {
        status,
        reviewed_by,
        notes,
        updated_at: new Date(),
      },
      include: {
        student: true,
        challenge: true,
      },
    })

    // If approved, add points to student
    if (status === 'APPROVED') {
      await prisma.user.update({
        where: { id: submission.student_id },
        data: {
          points: {
            increment: submission.challenge.points,
          },
        },
      })

      // Check for badge eligibility
      await this.checkAndAwardBadges(submission.student_id)
    }

    return submission
  }

  // Leaderboard
  static async getLeaderboard(school_id?: number, class_name?: string) {
    const whereClause: any = {
      submissions: {
        some: {
          status: 'APPROVED',
        },
      },
    }

    if (school_id) {
      whereClause.school_id = school_id
    }

    if (class_name) {
      whereClause.class = class_name
    }

    return await prisma.user.findMany({
      where: whereClause,
      include: {
        submissions: {
          where: { status: 'APPROVED' },
          include: { challenge: true },
        },
        school: true,
      },
      orderBy: { points: 'desc' },
    })
  }

  // Badge management
  static async getBadges() {
    return await prisma.badge.findMany({
      orderBy: { points_required: 'asc' },
    })
  }

  static async createBadge(data: {
    name: string
    description: string
    icon_url?: string
    points_required: number
  }) {
    return await prisma.badge.create({
      data,
    })
  }

  static async checkAndAwardBadges(user_id: string) {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: {
        user_badges: {
          include: { badge: true },
        },
      },
    })

    if (!user) return

    const badges = await prisma.badge.findMany({
      where: {
        points_required: { lte: user.points },
      },
    })

    const earnedBadgeIds = user.user_badges.map(ub => ub.badge_id)
    const newBadges = badges.filter(badge => !earnedBadgeIds.includes(badge.id))

    if (newBadges.length > 0) {
      await prisma.userBadge.createMany({
        data: newBadges.map(badge => ({
          user_id,
          badge_id: badge.id,
        })),
      })
    }
  }

  // Progress tracking
  static async getUserProgress(user_id: string) {
    const user = await prisma.user.findUnique({
      where: { id: user_id },
      include: {
        submissions: {
          include: { challenge: true },
        },
        user_badges: {
          include: { badge: true },
        },
        school: true,
      },
    })

    if (!user) return null

    const completedChallenges = user.submissions.filter(s => s.status === 'APPROVED')
    const pendingSubmissions = user.submissions.filter(s => s.status === 'PENDING')

    return {
      user,
      completedChallenges,
      pendingSubmissions,
      totalPoints: user.points,
      badges: user.user_badges.map(ub => ub.badge),
    }
  }

  static async getTeacherDashboard(teacher_id: number) {
    const teacher = await prisma.teacher.findUnique({
      where: { id: teacher_id },
      include: {
        user: true,
        school: true,
      },
    })

    if (!teacher) return null

    const submissions = await this.getSubmissionsForTeacher(teacher_id)
    const schoolLeaderboard = await this.getLeaderboard(teacher.school_id ?? undefined)

    return {
      teacher,
      submissions,
      schoolLeaderboard,
      pendingReviews: submissions.filter(s => s.status === 'PENDING'),
    }
  }
}
