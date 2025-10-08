import { PrismaClient } from '@/generated/prisma'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create schools
  const schools = await Promise.all([
    prisma.school.create({
      data: {
        name: 'Greenwood High School',
        address: '123 Green Street',
        city: 'Mumbai',
        state: 'Maharashtra',
        country: 'India',
      },
    }),
    prisma.school.create({
      data: {
        name: 'Oceanview Middle School',
        address: '456 Ocean Avenue',
        city: 'Chennai',
        state: 'Tamil Nadu',
        country: 'India',
      },
    }),
    prisma.school.create({
      data: {
        name: 'Eco Valley School',
        address: '789 Valley Road',
        city: 'Bangalore',
        state: 'Karnataka',
        country: 'India',
      },
    }),
  ])

  console.log('✅ Schools created:', schools.length)

  // Create badges
  const badges = await Promise.all([
    prisma.badge.create({
      data: {
        name: 'Bronze Eco Warrior',
        description: 'Earned 100 eco points',
        icon_url: '/badges/bronze.png',
        points_required: 100,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Silver Eco Champion',
        description: 'Earned 250 eco points',
        icon_url: '/badges/silver.png',
        points_required: 250,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Gold Eco Hero',
        description: 'Earned 500 eco points',
        icon_url: '/badges/gold.png',
        points_required: 500,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Platinum Eco Master',
        description: 'Earned 1000 eco points',
        icon_url: '/badges/platinum.png',
        points_required: 1000,
      },
    }),
    prisma.badge.create({
      data: {
        name: 'Festival Eco Guardian',
        description: 'Completed 5 festival eco challenges',
        icon_url: '/badges/festival.png',
        points_required: 200,
      },
    }),
  ])

  console.log('✅ Badges created:', badges.length)

  // Create challenges (including festival challenges)
  const challenges = await Promise.all([
    // Regular challenges
    prisma.challenge.create({
      data: {
        title: 'Plant a Sapling',
        description: 'Plant a tree in your community and help restore our green cover.',
        category: 'Biodiversity',
        points: 150,
        image_url: 'https://images.unsplash.com/photo-1710361006404-a13d01802ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw0fHx0cmVlJTIwcGxhbnRpbmd8ZW58MHx8fHwxNzU4OTYwMDczfDA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=v33r13s2l-Y',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Waste Segregation',
        description: 'Separate your household waste into dry, wet, and recyclable categories for a week.',
        category: 'Waste Management',
        points: 100,
        image_url: 'https://images.unsplash.com/photo-1540980193882-9fc6e90e29c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHx3YXN0ZSUyMHNlZ3JlZ2F0aW9ufGVufDB8fHx8MTc1ODk0MTY3OHww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=IMQP0hsu2aY',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Energy Saver',
        description: 'Log your efforts to save electricity. Turn off lights when not in use!',
        category: 'Energy Conservation',
        points: 75,
        image_url: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlbmVyZ3klMjBzYXZpbmd8ZW58MHx8fHwxNzU4ODc3NTY3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=hB4s2x-uFmY',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Water Guardian',
        description: 'Fix a dripping tap or report a water leakage in your area.',
        category: 'Water Conservation',
        points: 120,
        image_url: 'https://images.unsplash.com/photo-1620807996135-906005dc2a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHx3YXRlciUyMGNvbnNlcnZhdGlvbnxlbnwwfHx8fDE3NTg4OTQxNjB8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=yqOUzC2-b6I',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Compost Champion',
        description: 'Start a compost pit for organic waste at home or in your community garden.',
        category: 'Waste Management',
        points: 90,
        image_url: 'https://images.unsplash.com/photo-1715066660662-90aa88234e04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxMHx8Y29tcG9zdCUyMGJpbnxlbnwwfHx8fDE3NTg5ODU0Nzd8MA&ixlib.rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=I5tS-A03S-s',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'DIY Eco-Bricks',
        description: 'Pack non-biodegradable plastic waste tightly into a plastic bottle to create a reusable building block.',
        category: 'Waste Management',
        points: 130,
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwbGFzdGljJTIwYm90dGxlJTIwZmlsbGVkfGVufDB8fHx8MTc1ODk4NTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=Y3pP9Cg_m-w',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'No Plastic Challenge',
        description: 'Go a full day without using any single-use plastics and document your experience.',
        category: 'Plastic Reduction',
        points: 100,
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxyZXVzYWJsZSUyMGJhZ3N8ZW58MHx8fHwxNzU4OTg1NDc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=O1-a3T73p9U',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Home Helper',
        description: 'Help clean your room or living area, and assist in the kitchen. A clean home is a healthy environment!',
        category: 'Community',
        points: 50,
        image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxraXRjaGVuJTIwY2xlYW5pbmd8ZW58MHx8fHwxNzU4OTE0NzM1fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=S4-D0s_Kq2k',
      },
    }),
    
    // Festival challenges
    prisma.challenge.create({
      data: {
        title: 'Eco-Friendly Ganesh Murti',
        description: 'Make a Ganesh murti using natural clay or soil instead of plaster of Paris. Perform visarjan at home in a bucket and reuse the water for plants.',
        category: 'Festival Eco-Challenge',
        points: 200,
        image_url: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxjbGF5JTIwaWRvbCUyMG1ha2luZ3xlbnwwfHx8fDE3NTg5ODU0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-ganesh',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Silent Diwali Celebration',
        description: 'Celebrate Diwali without firecrackers to reduce noise and air pollution. Use LED lights and diyas instead of electric decorations.',
        category: 'Festival Eco-Challenge',
        points: 180,
        image_url: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkaXdhbGklMjBsaWdodHMlMjBkaXlhc3xlbnwwfHx8fDE3NTg5ODU0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-diwali',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Clean Diwali Streets',
        description: 'After Diwali celebrations, help clean up firecracker waste from your neighborhood streets and dispose of it properly.',
        category: 'Festival Eco-Challenge',
        points: 150,
        image_url: 'https://images.unsplash.com/photo-1540980193882-9fc6e90e29c8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdHJlZXQlMjBjbGVhbnVwJTIwY29tbXVuaXR5fGVufDB8fHx8MTc1ODk0MTY3OHww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-cleanup',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Natural Holi Colors',
        description: 'Use homemade natural colors made from flowers, turmeric, and beetroot instead of chemical-based colors for Holi.',
        category: 'Festival Eco-Challenge',
        points: 160,
        image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxob2xpJTIwY29sb3JzJTIwZmxvd2Vyc3xlbnwwfHx8fDE3NTg5ODU0Nzd8MA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-holi',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Water-Saving Holi',
        description: 'Celebrate Holi with minimal water usage. Use dry colors and avoid water balloons to conserve water.',
        category: 'Festival Eco-Challenge',
        points: 140,
        image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkcnklMjBob2xpJTIwY2VsZWJyYXRpb258ZW58MHx8fHwxNzU4OTg1NDc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-water-holi',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Eco-Friendly Eid Decorations',
        description: 'Create Eid decorations using recycled materials like paper, cardboard, and natural elements instead of plastic decorations.',
        category: 'Festival Eco-Challenge',
        points: 120,
        image_url: 'https://images.unsplash.com/photo-1563453392212-326f5e854473?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxlY28lMjBkZWNvcmF0aW9ucyUyMHJlY3ljbGVkfGVufDB8fHx8MTc1ODk4NTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-eid',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Sustainable Christmas Tree',
        description: 'Decorate a potted plant or create a Christmas tree using recycled materials instead of buying a plastic tree.',
        category: 'Festival Eco-Challenge',
        points: 130,
        image_url: 'https://images.unsplash.com/photo-1710361006404-a13d01802ce9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxwb3R0ZWQlMjBjaHJpc3RtYXMlMjB0cmVlJTIwZGVjb3JhdGVkfGVufDB8fHx8MTc1ODk4NTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-christmas',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Green Navratri Celebration',
        description: 'During Navratri, use eco-friendly decorations, avoid plastic disposables, and organize community cleaning drives.',
        category: 'Festival Eco-Challenge',
        points: 170,
        image_url: 'https://images.unsplash.com/photo-1611735341450-74d61e660ad2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxuYXZyYXRyaSUyMGRlY29yYXRpb24lMjBjb21tdW5pdHl8ZW58MHx8fHwxNzU4OTg1NDc3fDA&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-navratri',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Eco-Friendly Durga Puja',
        description: 'Use biodegradable materials for Durga Puja decorations and immerse idols in designated areas to protect water bodies.',
        category: 'Festival Eco-Challenge',
        points: 190,
        image_url: 'https://images.unsplash.com/photo-1620807996135-906005dc2a31?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxkdXJnYSUyMHB1amElMjBiaW9kZWdyYWRhYmxlfGVufDB8fHx8MTc1ODk4NTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-durga',
      },
    }),
    prisma.challenge.create({
      data: {
        title: 'Sustainable Karva Chauth',
        description: 'Use reusable containers for food and avoid single-use plastics during Karva Chauth celebrations.',
        category: 'Festival Eco-Challenge',
        points: 110,
        image_url: 'https://images.unsplash.com/photo-1474631245212-32dc3c8310c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxrYXJ2YSUyMGNoYXV0aCUyMHJldXNhYmxlfGVufDB8fHx8MTc1ODk4NTQ3N3ww&ixlib=rb-4.1.0&q=80&w=1080',
        tutorial_url: 'https://www.youtube.com/watch?v=example-karva',
      },
    }),
  ])

  console.log('✅ Challenges created:', challenges.length)

  console.log('🎉 Database seeded successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

