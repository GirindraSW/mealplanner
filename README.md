# MealMind - AI-Powered Meal Planner

MealMind is an AI-powered meal planning web application that helps users generate a personalized 7-day meal plan based on their goals, food preferences, and allergies. The application also provides a grocery checklist and saves generated meal plans for later access.

## Live Demo

https://mealplanner-five-delta.vercel.app/

## Repository

https://github.com/GirindraSW/mealplanner.git

## Features

- Generate a personalized 7-day meal plan using AI
- Input user goals, allergies, and food preferences
- View generated meal plans in a structured format
- Save generated meal plans to Supabase
- Access meal plan history
- Generate grocery list based on the meal plan
- Export meal plan or grocery checklist to PDF
- Responsive web interface

## Tech Stack

- Next.js
- TypeScript
- Tailwind CSS
- Supabase
- Gemini API
- Vercel

## Branching Strategy

This project uses a feature branch workflow to keep the `main` branch stable.

### Main Branch

- `main`: Stores the latest stable version of the application.

### Feature Branches

- `feat/gemini-api-prompt`: Implements Gemini API integration and prompt handling.
- `feat/pdf-export-grocery-checklist`: Adds PDF export and grocery checklist features.
- `feat/save-to-supabase`: Saves generated meal plans to Supabase.
- `feat/swapmeal-grocerylist-categorized`: Adds meal day swapping, grocery list categorization, and UI components.

## Commit Message Convention

This project uses a simple Conventional Commit style to make the commit history easier to understand.

Examples:

```bash
feat: gemini API + promt
feat: PDF export, grocery checklist, input review
feat: swap meal plan days, grocery list & categorization, add shadcn components
feat: with history page, save each generated plane to supabase
```

Recommended format:

```bash
<type>: <short description>
```

Common types:

- `feat`: Adds a new feature
- `fix`: Fixes a bug
- `docs`: Updates documentation
- `style`: Changes formatting or styling
- `refactor`: Improves code structure without changing functionality
- `test`: Adds or updates tests
- `chore`: Updates configuration, dependencies, or maintenance tasks

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm, yarn, pnpm, or bun
- Git

### Installation

Clone the repository:

```bash
git clone https://github.com/GirindraSW/mealplanner.git
```

Move into the project directory:

```bash
cd mealplanner
```

Install dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root project directory.

Example:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
GEMINI_API_KEY=your_gemini_api_key
```

Do not commit `.env.local` or any secret keys to GitHub.

### Run the Development Server

```bash
npm run dev
```

Open the application in your browser:

```text
http://localhost:3000
```

## Build

To build the application for production:

```bash
npm run build
```

To start the production build locally:

```bash
npm start
```

## Deployment

The application is deployed on Vercel.

Production URL:

https://mealplanner-five-delta.vercel.app/

## Git Workflow

Recommended workflow for future development:

1. Update the local `main` branch.

```bash
git checkout main
git pull origin main
```

2. Create a new feature branch.

```bash
git checkout -b feat/feature-name
```

3. Make changes and commit them using a clear commit message.

```bash
git add .
git commit -m "feat: add feature description"
```

4. Push the branch to GitHub.

```bash
git push -u origin feat/feature-name
```

5. Create a Pull Request to merge the feature branch into `main`.

6. Review the changed files before merging.

7. Delete the feature branch after it is merged.

## Project Structure

```text
mealplanner/
├── app/
├── components/
├── lib/
├── public/
├── README.md
├── package.json
├── next.config.ts
└── tsconfig.json
```

## Notes

This project was created as part of the DumbWays.id learning program. The current repository already uses multiple feature branches and a deployed production version. Pull Request usage is recommended for future improvements to make the workflow more structured and easier to review.

## Author

Girindra Sulistiyo Wardoyo

## Institution

DumbWays.id
