import * as dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function testDatabase() {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully')
    
    // Test schools table
    const schools = await prisma.school.findMany()
    console.log(`✅ Schools table accessible - found ${schools.length} schools`)
    
    // Test users table
    const users = await prisma.user.findMany()
    console.log(`✅ Users table accessible - found ${users.length} users`)
    
    // Test teachers table
    const teachers = await prisma.teacher.findMany()
    console.log(`✅ Teachers table accessible - found ${teachers.length} teachers`)
    
    // Test teacher creation
    console.log('🧪 Testing teacher creation...')
    const testUserId = `test_user_${Date.now()}`
    
    // First create a user
    const testUser = await prisma.user.create({
      data: {
        id: testUserId,
        email: `test${Date.now()}@example.com`,
        name: 'Test Teacher',
        role: 'TEACHER',
        school_id: schools[0]?.id,
      },
    })
    console.log('✅ Test user created:', testUser.id)
    
    // Then create a teacher profile
    const testTeacher = await prisma.teacher.create({
      data: {
        user_id: testUserId,
        subject: 'Environmental Science',
        experience: 5,
        school_id: schools[0]?.id,
      },
    })
    console.log('✅ Test teacher created:', testTeacher.id)
    
    // Clean up test data
    await prisma.teacher.delete({ where: { id: testTeacher.id } })
    await prisma.user.delete({ where: { id: testUserId } })
    console.log('✅ Test data cleaned up')
    
    console.log('🎉 All database tests passed!')
    
  } catch (error) {
    console.error('❌ Database test failed:', error)
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
  } finally {
    await prisma.$disconnect()
  }
}

testDatabase()

