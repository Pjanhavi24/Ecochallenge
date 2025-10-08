import type { User, Task, LeaderboardUser, Submission, Lesson } from '@/lib/types';

export const users: User[] = [
  { id: 1, name: 'Alex Green', email: 'alex@school.com', school: 'Greenwood High', class: '8A', points: 1250, role: 'student' },
  { id: 2, name: 'Benny Blue', email: 'benny@school.com', school: 'Greenwood High', class: '8A', points: 1100, role: 'student' },
  { id: 3, name: 'Cathy Coral', email: 'cathy@school.com', school: 'Oceanview Middle', class: '7B', points: 1500, role: 'student' },
  { id: 4, name: 'David Terra', email: 'david@school.com', school: 'Greenwood High', class: '8B', points: 950, role: 'student' },
  { id: 5, name: 'Eva Sky', email: 'eva@school.com', school: 'Oceanview Middle', class: '7A', points: 1800, role: 'student' },
  { id: 101, name: 'Mr. Harrison', email: 'teacher@school.com', school: 'Greenwood High', class: 'N/A', points: 0, role: 'teacher' },
];

export const tasks: Task[] = [
  { id: 1, title: 'Plant a Sapling', description: 'Plant a tree in your community and help restore our green cover.', category: 'Biodiversity', points: 150, imageId: 'task-1-tree', tutorialUrl: 'https://www.youtube.com/watch?v=v33r13s2l-Y' },
  { id: 2, title: 'Waste Segregation', description: 'Separate your household waste into dry, wet, and recyclable categories for a week.', category: 'Waste Management', points: 100, imageId: 'task-2-waste', tutorialUrl: 'https://www.youtube.com/watch?v=IMQP0hsu2aY' },
  { id: 3, title: 'Energy Saver', description: 'Log your efforts to save electricity. Turn off lights when not in use!', category: 'Energy Conservation', points: 75, imageId: 'task-3-energy', tutorialUrl: 'https://www.youtube.com/watch?v=hB4s2x-uFmY' },
  { id: 4, title: 'Water Guardian', description: 'Fix a dripping tap or report a water leakage in your area.', category: 'Water Conservation', points: 120, imageId: 'task-4-water', tutorialUrl: 'https://www.youtube.com/watch?v=yqOUzC2-b6I' },
  { id: 5, title: 'Compost Champion', description: 'Start a compost pit for organic waste at home or in your community garden.', category: 'Waste Management', points: 90, imageId: 'task-5-compost', tutorialUrl: 'https://www.youtube.com/watch?v=I5tS-A03S-s' },
  { id: 6, title: 'DIY Eco-Bricks', description: 'Pack non-biodegradable plastic waste tightly into a plastic bottle to create a reusable building block.', category: 'Waste Management', points: 130, imageId: 'task-6-ecobricks', tutorialUrl: 'https://www.youtube.com/watch?v=Y3pP9Cg_m-w' },
  { id: 7, title: 'No Plastic Challenge', description: 'Go a full day without using any single-use plastics and document your experience.', category: 'Plastic Reduction', points: 100, imageId: 'task-7-noplastic', tutorialUrl: 'https://www.youtube.com/watch?v=O1-a3T73p9U' },
  { id: 8, title: 'Home Helper', description: 'Help clean your room or living area, and assist in the kitchen. A clean home is a healthy environment!', category: 'Community', points: 50, imageId: 'task-8-homehelper', tutorialUrl: 'https://www.youtube.com/watch?v=S4-D0s_Kq2k' },
  
  // Festival-themed Eco Challenges
  { id: 9, title: 'Eco-Friendly Ganesh Murti', description: 'Make a Ganesh murti using natural clay or soil instead of plaster of Paris. Perform visarjan at home in a bucket and reuse the water for plants.', category: 'Festival Eco-Challenge', points: 200, imageId: 'task-9-ganesh', tutorialUrl: 'https://www.youtube.com/watch?v=example-ganesh' },
  { id: 10, title: 'Silent Diwali Celebration', description: 'Celebrate Diwali without firecrackers to reduce noise and air pollution. Use LED lights and diyas instead of electric decorations.', category: 'Festival Eco-Challenge', points: 180, imageId: 'task-10-diwali', tutorialUrl: 'https://www.youtube.com/watch?v=example-diwali' },
  { id: 11, title: 'Clean Diwali Streets', description: 'After Diwali celebrations, help clean up firecracker waste from your neighborhood streets and dispose of it properly.', category: 'Festival Eco-Challenge', points: 150, imageId: 'task-11-cleanup', tutorialUrl: 'https://www.youtube.com/watch?v=example-cleanup' },
  { id: 12, title: 'Natural Holi Colors', description: 'Use homemade natural colors made from flowers, turmeric, and beetroot instead of chemical-based colors for Holi.', category: 'Festival Eco-Challenge', points: 160, imageId: 'task-12-holi', tutorialUrl: 'https://www.youtube.com/watch?v=example-holi' },
  { id: 13, title: 'Water-Saving Holi', description: 'Celebrate Holi with minimal water usage. Use dry colors and avoid water balloons to conserve water.', category: 'Festival Eco-Challenge', points: 140, imageId: 'task-13-water-holi', tutorialUrl: 'https://www.youtube.com/watch?v=example-water-holi' },
  { id: 14, title: 'Eco-Friendly Eid Decorations', description: 'Create Eid decorations using recycled materials like paper, cardboard, and natural elements instead of plastic decorations.', category: 'Festival Eco-Challenge', points: 120, imageId: 'task-14-eid', tutorialUrl: 'https://www.youtube.com/watch?v=example-eid' },
  { id: 15, title: 'Sustainable Christmas Tree', description: 'Decorate a potted plant or create a Christmas tree using recycled materials instead of buying a plastic tree.', category: 'Festival Eco-Challenge', points: 130, imageId: 'task-15-christmas', tutorialUrl: 'https://www.youtube.com/watch?v=example-christmas' },
  { id: 16, title: 'Green Navratri Celebration', description: 'During Navratri, use eco-friendly decorations, avoid plastic disposables, and organize community cleaning drives.', category: 'Festival Eco-Challenge', points: 170, imageId: 'task-16-navratri', tutorialUrl: 'https://www.youtube.com/watch?v=example-navratri' },
  { id: 17, title: 'Eco-Friendly Durga Puja', description: 'Use biodegradable materials for Durga Puja decorations and immerse idols in designated areas to protect water bodies.', category: 'Festival Eco-Challenge', points: 190, imageId: 'task-17-durga', tutorialUrl: 'https://www.youtube.com/watch?v=example-durga' },
  { id: 18, title: 'Sustainable Karva Chauth', description: 'Use reusable containers for food and avoid single-use plastics during Karva Chauth celebrations.', category: 'Festival Eco-Challenge', points: 110, imageId: 'task-18-karva', tutorialUrl: 'https://www.youtube.com/watch?v=example-karva' },
];

export const schoolLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Eva Sky', points: 1800, school: 'Oceanview Middle' },
  { rank: 2, name: 'Cathy Coral', points: 1500, school: 'Oceanview Middle' },
  { rank: 3, name: 'Alex Green', points: 1250, school: 'Greenwood High' },
  { rank: 4, name: 'Benny Blue', points: 1100, school: 'Greenwood High' },
  { rank: 5, name: 'David Terra', points: 950, school: 'Greenwood High' },
];

export const classLeaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Alex Green', points: 1250, school: 'Greenwood High' },
    { rank: 2, name: 'Benny Blue', points: 1100, school: 'Greenwood High' },
];

export const submissions: Submission[] = [
    { id: '1', studentName: 'Alex Green', taskTitle: 'Plant a Sapling', status: 'pending', imageUrl: 'https://picsum.photos/seed/sub1/400/300', description: 'Planted this little guy in my backyard. Hope it grows tall!', aiAnalysis: 'The image clearly shows a sapling being planted, which corresponds well with the description. The setting appears to be a residential garden. The action aligns perfectly with the task "Plant a Sapling".' },
    { id: '2', studentName: 'Cathy Coral', taskTitle: 'Waste Segregation', status: 'approved', imageUrl: 'https://picsum.photos/seed/sub2/400/300', description: 'My family and I have been sorting our waste. Here are the bins!', aiAnalysis: 'The image displays several bins, seemingly for different types of waste, which supports the description. The context is consistent with household waste segregation.' },
    { id: '3', studentName: 'Benny Blue', taskTitle: 'Energy Saver', status: 'rejected', imageUrl: 'https://picsum.photos/seed/sub3/400/300', description: 'I turned off the lights!', notes: 'Great start, Benny! But the photo is too dark to see anything. Please try to take a picture with some ambient light, maybe during the day showing the switch is off.', aiAnalysis: 'The image is completely black. While the description claims an action was performed (turning off lights), the photo does not provide any visual evidence to support this claim.' },
];

export const lessons: Lesson[] = [
  {
    id: 1,
    title: 'The Magic of Recycling',
    category: 'Waste Management',
    duration: 5,
    summary: 'Learn what happens to your trash after you throw it away and how recycling makes a difference.',
    imageId: 'lesson-1-cover',
    videoUrl: 'https://youtu.be/SuFrT2kxtlc',
    content: "Recycling is the process of converting waste materials into new materials and objects. It can prevent the waste of potentially useful materials and reduce the consumption of fresh raw materials, thereby reducing: energy usage, air pollution (from incineration), and water pollution (from landfilling).",
    quiz: [
      { id: 'q1', question: 'What is the primary benefit of recycling?', options: ['Saves energy', 'Creates more waste', 'Is expensive'], answer: 'Saves energy' }
    ]
  },
  {
    id: 2,
    title: 'Why Trees Are Awesome',
    category: 'Biodiversity',
    duration: 7,
    summary: 'Discover the vital role trees play in our ecosystem, from producing oxygen to supporting wildlife.',
    imageId: 'lesson-2-cover',
    videoUrl: 'https://youtu.be/B13TXhXhf9w',
    content: "Trees are vital. As the biggest plants on the planet, they give us oxygen, store carbon, stabilize the soil and give life to the world's wildlife. They also provide us with the materials for tools and shelter.",
    quiz: [
      { id: 'q1', question: 'Which gas do trees primarily produce?', options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide'], answer: 'Oxygen' }
    ]
  },
  {
    id: 3,
    title: 'Conserving Our Water',
    category: 'Water Conservation',
    duration: 4,
    summary: 'Simple tips and tricks to save water in your daily life.',
    imageId: 'lesson-3-cover',
    videoUrl: 'https://youtu.be/nTcFXJT0Fsc',
    content: "Water conservation includes all the policies, strategies and activities to sustainably manage the natural resource of fresh water, to protect the hydrosphere, and to meet the current and future human demand.",
    quiz: [
      { id: 'q1', question: 'What is a good way to save water?', options: ['Taking longer showers', 'Fixing leaky faucets', 'Watering plants mid-day'], answer: 'Fixing leaky faucets' }
    ]
  },
  {
    id: 4,
    title: 'Understanding Your Carbon Footprint',
    category: 'Climate Change',
    duration: 8,
    summary: 'Learn what a carbon footprint is and simple ways you can reduce yours.',
    imageId: 'lesson-4-cover',
    videoUrl: 'https://youtu.be/8q7_aV8eLUE',
    content: "A carbon footprint is the total amount of greenhouse gases (including carbon dioxide and methane) that are generated by our actions. The average carbon footprint for a person in the United States is 16 tons, one of the highest rates in the world. Globally, the average is closer to 4 tons. To have the best chance of avoiding a 2℃ rise in global temperatures, the average global carbon footprint per year needs to drop to under 2 tons by 2050.",
    quiz: [
      { id: 'q1', question: 'What is a carbon footprint?', options: ['A type of shoe', 'The amount of carbon an object is made of', 'The total greenhouse gases generated by our actions'], answer: 'The total greenhouse gases generated by our actions' }
    ]
  },
  {
    id: 5,
    title: 'The Problem with Plastic',
    category: 'Plastic Reduction',
    duration: 6,
    summary: 'Explore the journey of plastic and its impact on our oceans and wildlife.',
    imageId: 'lesson-5-cover',
    videoUrl: 'https://youtu.be/526gMLHDVLg',
    content: "Plastic pollution has become one of the most pressing environmental issues. Single-use plastics, which are used just once before being thrown away, are a major contributor. These plastics break down into smaller pieces called microplastics, which can be ingested by wildlife and enter our food chain. Reducing our reliance on single-use plastics by choosing reusable alternatives is a critical step in protecting our planet.",
    quiz: [
      { id: 'q1', question: 'What are small pieces of broken-down plastic called?', options: ['Micro-plastics', 'Nano-plastics', 'Plastic-bits'], answer: 'Micro-plastics' }
    ]
  },
  {
    id: 6,
    title: 'Family & Environment',
    category: 'Community',
    duration: 5,
    summary: 'Learn how to share your eco-knowledge with your family and grandparents.',
    imageId: 'lesson-6-cover',
    videoUrl: 'https://youtu.be/gEk6JLJNg0U',
    content: "Sharing what you learn about the environment with your family is a powerful way to make a bigger impact. You can teach your grandparents how to sort recyclables, explain why saving water is important, or even start a small herb garden together. Every conversation helps build a more sustainable future for everyone.",
    quiz: [
      { id: 'q1', question: 'What is a good way to share eco-knowledge with family?', options: ['Keeping it to yourself', 'Talking about what you\'ve learned', 'Ignoring the topic'], answer: 'Talking about what you\'ve learned' }
    ]
  },
  {
    id: 7,
    title: 'Air Pollution and Its Effects',
    category: 'Air Quality',
    duration: 6,
    summary: 'Understand the causes and impacts of air pollution on our health and environment.',
    imageId: 'lesson-7-cover',
    videoUrl: 'https://youtu.be/6IKaUTYWtvg',
    content: "Air pollution is the presence of substances in the atmosphere that are harmful to the health of humans and other living beings, or cause damage to the climate or to materials. Common pollutants include particulate matter, carbon monoxide, sulfur dioxide, and nitrogen oxides.",
    quiz: [
      { id: 'q1', question: 'What is a major cause of air pollution?', options: ['Vehicle emissions', 'Planting trees', 'Recycling'], answer: 'Vehicle emissions' }
    ]
  },
  {
    id: 8,
    title: 'Renewable Energy Sources',
    category: 'Energy Conservation',
    duration: 7,
    summary: 'Explore clean energy alternatives like solar, wind, and hydro power.',
    imageId: 'lesson-8-cover',
    videoUrl: 'https://youtu.be/Giek094C_l4',
    content: "Renewable energy comes from natural sources that are continually replenished. These include solar energy, wind energy, hydro energy, geothermal energy, and biomass. Unlike fossil fuels, renewable energy sources produce little to no greenhouse gas emissions.",
    quiz: [
      { id: 'q1', question: 'Which of these is a renewable energy source?', options: ['Coal', 'Solar power', 'Natural gas'], answer: 'Solar power' }
    ]
  },
  {
    id: 9,
    title: 'Wildlife Conservation',
    category: 'Biodiversity',
    duration: 8,
    summary: 'Learn about protecting endangered species and their habitats.',
    imageId: 'lesson-9-cover',
    videoUrl: 'https://youtu.be/10TsKKs3I2Y',
    content: "Wildlife conservation refers to the practice of protecting wild species and their habitats in order to maintain biodiversity. This includes protecting endangered species, preserving habitats, and preventing poaching and illegal trade.",
    quiz: [
      { id: 'q1', question: 'What does wildlife conservation aim to protect?', options: ['Only animals', 'Biodiversity and habitats', 'Only plants'], answer: 'Biodiversity and habitats' }
    ]
  },
  {
    id: 10,
    title: 'Soil Erosion and Conservation',
    category: 'Soil Management',
    duration: 5,
    summary: 'Discover how soil erosion affects agriculture and learn conservation methods.',
    imageId: 'lesson-10-cover',
    videoUrl: 'https://youtu.be/uo_ntewAemw',
    content: "Soil erosion is the displacement of the upper layer of soil, one form of soil degradation. This natural process is caused by the dynamic activity of erosive agents, that is, water, ice, snow, air, plants, animals, and humans.",
    quiz: [
      { id: 'q1', question: 'What is soil erosion?', options: ['Soil becoming harder', 'Loss of topsoil', 'Soil becoming wetter'], answer: 'Loss of topsoil' }
    ]
  },
  {
    id: 11,
    title: 'Deforestation and Reforestation',
    category: 'Forestry',
    duration: 6,
    summary: 'Understand the impact of cutting down forests and the importance of planting trees.',
    imageId: 'lesson-11-cover',
    videoUrl: 'https://youtu.be/Nknmv3KXHa0',
    content: "Deforestation is the purposeful clearing of forested land. Throughout history and into modern times, forests have been cleared for agriculture, timber, and infrastructure. Reforestation is the natural or intentional restocking of existing forests and woodlands.",
    quiz: [
      { id: 'q1', question: 'What is reforestation?', options: ['Cutting down trees', 'Planting new trees', 'Burning forests'], answer: 'Planting new trees' }
    ]
  },
  {
    id: 12,
    title: 'Ocean Pollution',
    category: 'Marine Conservation',
    duration: 7,
    summary: 'Learn about plastic pollution and other threats to our oceans.',
    imageId: 'lesson-12-cover',
    videoUrl: 'https://youtu.be/8MXJC_518Yc',
    content: "Ocean pollution is a complex mixture of toxic substances entering the ocean, including oil spills, sewage, industrial waste, and agricultural runoff. Marine pollution occurs when harmful effects result from the entry into the ocean of chemicals, particles, industrial, agricultural and residential waste.",
    quiz: [
      { id: 'q1', question: 'What is a major pollutant in oceans?', options: ['Plastic waste', 'Fresh water', 'Sand'], answer: 'Plastic waste' }
    ]
  },
  {
    id: 13,
    title: 'Sustainable Living',
    category: 'Lifestyle',
    duration: 5,
    summary: 'Tips for living an eco-friendly lifestyle in your daily life.',
    imageId: 'lesson-13-cover',
    videoUrl: 'https://youtu.be/5bVDpmzMICE',
    content: "Sustainable living is a lifestyle that attempts to reduce an individual's or society's use of the Earth's natural resources and personal resources. It includes sustainable development, which meets the needs of the present without compromising the ability of future generations to meet their own needs.",
    quiz: [
      { id: 'q1', question: 'What does sustainable living aim to do?', options: ['Use more resources', 'Reduce resource use', 'Ignore the environment'], answer: 'Reduce resource use' }
    ]
  },
  {
    id: 14,
    title: 'Environmental Impact Assessment',
    category: 'Policy',
    duration: 8,
    summary: 'Understand how projects are evaluated for their environmental impact.',
    imageId: 'lesson-14-cover',
    videoUrl: 'https://youtu.be/Uxh3MxOvDIs',
    content: "Environmental Impact Assessment (EIA) is a process of evaluating the likely environmental impacts of a proposed project or development, taking into account inter-related socio-economic, cultural and human-health impacts, both beneficial and adverse.",
    quiz: [
      { id: 'q1', question: 'What does EIA evaluate?', options: ['Financial costs', 'Environmental impacts', 'Building designs'], answer: 'Environmental impacts' }
    ]
  },
  {
    id: 15,
    title: 'Eco-Friendly Festival Celebrations',
    category: 'Festival Eco-Challenge',
    duration: 6,
    summary: 'Learn how to celebrate festivals in an environmentally friendly way.',
    imageId: 'lesson-15-cover',
    videoUrl: 'https://youtu.be/l4NBi1QfgTA',
    content: "Festivals are times of joy and celebration, but they can also have environmental impacts. By choosing eco-friendly alternatives like natural colors, reusable decorations, and mindful consumption, we can celebrate responsibly while protecting our planet.",
    quiz: [
      { id: 'q1', question: 'What is an eco-friendly alternative to chemical colors for Holi?', options: ['Natural dyes from flowers', 'More chemical colors', 'No colors at all'], answer: 'Natural dyes from flowers' }
    ]
  },
  {
    id: 16,
    title: 'Developing Good Manners and Behavior',
    category: 'Personal Development',
    duration: 5,
    summary: 'Learn the importance of good manners and respectful behavior.',
    imageId: 'lesson-16-cover',
    videoUrl: 'https://youtu.be/7IhpL9Plk48',
    content: "Good manners and behavior are essential for building positive relationships and creating a harmonious society. Simple acts like saying 'please' and 'thank you', respecting others' space, and being polite go a long way in making the world a better place.",
    quiz: [
      { id: 'q1', question: 'What is a basic good manner?', options: ['Saying please and thank you', 'Being rude', 'Ignoring others'], answer: 'Saying please and thank you' }
    ]
  },
  {
    id: 17,
    title: 'Personal Responsibility and Self-Care',
    category: 'Personal Development',
    duration: 4,
    summary: 'Understand the importance of taking care of yourself and your responsibilities.',
    imageId: 'lesson-17-cover',
    videoUrl: 'https://youtu.be/6t_Elb_OcQY',
    content: "Personal responsibility means being accountable for your actions and their consequences. It includes doing your chores, keeping your promises, and taking care of your health and belongings. Self-care involves maintaining good hygiene and looking after your physical and mental well-being.",
    quiz: [
      { id: 'q1', question: 'What does personal responsibility include?', options: ['Doing your own work', 'Blaming others', 'Being lazy'], answer: 'Doing your own work' }
    ]
  },
  {
    id: 18,
    title: 'Keeping Public Spaces Clean',
    category: 'Community',
    duration: 5,
    summary: 'Learn why cleanliness matters and how to keep our surroundings tidy.',
    imageId: 'lesson-18-cover',
    videoUrl: 'https://youtu.be/-oWT9m7iNv0',
    content: "A clean environment is essential for our health and well-being. Not littering, using trash bins, and participating in community clean-up drives help maintain clean public spaces. Remember, a clean community reflects responsible citizens.",
    quiz: [
      { id: 'q1', question: 'What should you do with trash?', options: ['Throw it on the ground', 'Put it in a bin', 'Leave it anywhere'], answer: 'Put it in a bin' }
    ]
  },
  {
    id: 19,
    title: 'Learning from Asian Cultures: China and Japan',
    category: 'Cultural Learning',
    duration: 7,
    summary: 'Discover how Chinese and Japanese cultures teach discipline and good habits.',
    imageId: 'lesson-19-cover',
    videoUrl: 'https://youtube.com/shorts/2dzg8uGzrp8?si=MWITfOgkLfaOvtIf',
    content: "Chinese and Japanese cultures emphasize discipline, respect, and personal responsibility from a young age. Children are taught to be polite, hardworking, and considerate of others. These cultural values help create well-mannered and responsible individuals who contribute positively to society.",
    quiz: [
      { id: 'q1', question: 'What do Asian cultures emphasize?', options: ['Discipline and respect', 'Being lazy', 'Ignoring rules'], answer: 'Discipline and respect' }
    ]
  },
  {
    id: 20,
    title: 'Eco-Friendly Diwali Celebrations',
    category: 'Festival Eco-Challenge',
    duration: 6,
    summary: 'Learn how to celebrate Diwali in an environmentally friendly way.',
    imageId: 'lesson-20-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-diwali-eco',
    content: "Diwali is the festival of lights, but we can celebrate it sustainably by using LED lights instead of traditional lamps, avoiding firecrackers, and choosing eco-friendly decorations. This helps reduce air pollution and energy consumption while maintaining the festive spirit.",
    quiz: [
      { id: 'q1', question: 'What is an eco-friendly alternative to firecrackers?', options: ['LED lights and diyas', 'More firecrackers', 'Electric lights only'], answer: 'LED lights and diyas' }
    ]
  },
  {
    id: 21,
    title: 'Eco-Friendly Holi Celebrations',
    category: 'Festival Eco-Challenge',
    duration: 5,
    summary: 'Discover natural and safe ways to celebrate the festival of colors.',
    imageId: 'lesson-21-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-holi-eco',
    content: "Holi celebrates the victory of good over evil with colors, but chemical colors can harm the environment and health. Natural colors made from flowers, turmeric, and vegetables are safe, biodegradable, and add to the fun without pollution.",
    quiz: [
      { id: 'q1', question: 'What makes natural Holi colors better?', options: ['They are biodegradable', 'They are brighter', 'They cost more'], answer: 'They are biodegradable' }
    ]
  },
  {
    id: 22,
    title: 'Eco-Friendly Ganesh Chaturthi',
    category: 'Festival Eco-Challenge',
    duration: 6,
    summary: 'Learn sustainable ways to celebrate Ganesh Chaturthi with clay idols.',
    imageId: 'lesson-22-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-ganesh-eco',
    content: "Ganesh Chaturthi celebrates Lord Ganesha with beautiful idols, but plaster of Paris idols harm the environment. Traditional clay idols made by local artisans are eco-friendly, biodegradable, and support local craftsmen.",
    quiz: [
      { id: 'q1', question: 'What material is best for eco-friendly Ganesh idols?', options: ['Clay', 'Plaster of Paris', 'Plastic'], answer: 'Clay' }
    ]
  },
  {
    id: 23,
    title: 'Eco-Friendly Navratri Celebrations',
    category: 'Festival Eco-Challenge',
    duration: 7,
    summary: 'Celebrate Navratri with sustainable decorations and practices.',
    imageId: 'lesson-23-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-navratri-eco',
    content: "Navratri is nine nights of celebration with beautiful decorations and Garba dancing. Using natural flowers, reusable materials for decorations, and LED lights instead of electric ones helps keep the festival green and sustainable.",
    quiz: [
      { id: 'q1', question: 'What can be reused for Navratri decorations?', options: ['Natural flowers and fabrics', 'Plastic decorations', 'Paper only'], answer: 'Natural flowers and fabrics' }
    ]
  },
  {
    id: 24,
    title: 'Eco-Friendly Eid Celebrations',
    category: 'Festival Eco-Challenge',
    duration: 5,
    summary: 'Learn how to celebrate Eid in an environmentally conscious way.',
    imageId: 'lesson-24-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-eid-eco',
    content: "Eid is a time of joy, new clothes, and community gatherings. Choosing sustainable fabrics for clothes, using reusable decorations, and mindful consumption of food helps celebrate responsibly while protecting the environment.",
    quiz: [
      { id: 'q1', question: 'What fabrics are eco-friendly for Eid clothes?', options: ['Organic cotton or recycled materials', 'Synthetic fabrics', 'Cheap materials'], answer: 'Organic cotton or recycled materials' }
    ]
  },
  {
    id: 25,
    title: 'Eco-Friendly Durga Puja',
    category: 'Festival Eco-Challenge',
    duration: 7,
    summary: 'Discover sustainable ways to celebrate Durga Puja.',
    imageId: 'lesson-25-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-durga-eco',
    content: "Durga Puja is a grand celebration with elaborate pandals and idols. Using biodegradable materials for decorations, immersing idols in designated water bodies, and using solar-powered lights makes the festival more environmentally friendly.",
    quiz: [
      { id: 'q1', question: 'Where should Durga idols be immersed?', options: ['Designated water bodies', 'Any river or pond', 'Left on land'], answer: 'Designated water bodies' }
    ]
  },
  {
    id: 26,
    title: 'Eco-Friendly Christmas Celebrations',
    category: 'Festival Eco-Challenge',
    duration: 6,
    summary: 'Learn how to celebrate Christmas sustainably.',
    imageId: 'lesson-26-cover',
    videoUrl: 'https://www.youtube.com/watch?v=example-christmas-eco',
    content: "Christmas brings joy with trees and decorations, but we can choose live potted plants instead of cut trees, use LED lights, and give eco-friendly gifts. This reduces waste and energy consumption while spreading cheer.",
    quiz: [
      { id: 'q1', question: 'What is better than a cut Christmas tree?', options: ['A potted plant', 'A plastic tree', 'No tree'], answer: 'A potted plant' }
    ]
  },
];
