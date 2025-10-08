# EcoChallenge

Gamified eco-tasks for students. A Next.js application that empowers students to complete environmental challenges, submit evidence, earn points, and learn about sustainability through interactive lessons and AI-powered coaching.

## Features

- **Student Dashboard**: View and complete available eco-challenges
- **Task Submission**: Upload evidence (images, videos, documents) for completed tasks
- **Points System**: Earn points for successful submissions
- **Leaderboard**: Compete with peers and track progress
- **AI Eco-Coach**: Get personalized advice and feedback using Google AI
- **Teacher Portal**: Review student submissions and manage challenges
- **Lessons**: Access educational content on environmental topics
- **Admin Panel**: Manage schools, users, and system settings
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **ORM**: Prisma
- **Authentication**: Supabase Auth
- **AI**: Google AI (Genkit)
- **Email**: Resend
- **Deployment**: Firebase (App Hosting)

## Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Google AI API key (for eco-coach features)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd ecochallenge
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
   DATABASE_URL=your_database_url
   GOOGLE_GENAI_API_KEY=your_google_ai_api_key
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_APP_URL=http://localhost:9001
   ```

4. Set up the database:
   ```bash
   npm run db:push
   npm run db:seed
   npm run db:seed-schools
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:9001`.

## Database Schema

The application uses the following main tables:
- `users`: User accounts (students, teachers, admins)
- `schools`: Educational institutions
- `challenges`: Eco-tasks and challenges
- `submissions`: Student submissions with evidence
- `lessons`: Educational content

## Available Scripts

- `npm run dev`: Start development server with Turbopack
- `npm run build`: Build for production
- `npm run start`: Start production server
- `npm run lint`: Run ESLint
- `npm run typecheck`: Run TypeScript type checking
- `npm run db:generate`: Generate Prisma client
- `npm run db:push`: Push database schema changes
- `npm run db:seed`: Seed database with initial data
- `npm run db:seed-schools`: Seed with real school data
- `npm run db:studio`: Open Prisma Studio
- `npm run db:test`: Test database connection
- `npm run genkit:dev`: Start Genkit AI development server
- `npm run genkit:watch`: Start Genkit AI with watch mode

## Usage

### For Students
1. Register/Login with your school email
2. Browse available challenges in the Tasks section
3. Complete tasks and submit evidence
4. View your progress on the leaderboard
5. Access lessons and get AI coaching

### For Teachers
1. Login to access the teacher dashboard
2. Review student submissions
3. Approve or reject submissions with feedback
4. Monitor class progress and statistics

### For Admins
1. Access the admin panel
2. Manage schools and users
3. View system-wide statistics

## AI Features

The application includes AI-powered features:
- **Eco-Coach**: Provides personalized environmental advice
- **Submission Analysis**: AI analyzes submitted evidence for validity
- **Smart Feedback**: Generates contextual feedback for submissions

## Deployment

The application is configured for deployment on Firebase App Hosting. Update the `apphosting.yaml` file with your Firebase project settings.

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Make your changes and commit: `git commit -m 'Add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

## License

This project is private and proprietary.

## Support

For support or questions, please contact the development team.