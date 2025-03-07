# Pixel Wars

A collaborative pixel art canvas inspired by r/place, where users can place pixels on a shared canvas.

## Features

- Real-time canvas updates using Socket.io
- Authentication with both anonymous and Google sign-in options
- Different cooldown times based on authentication status
- Responsive design that works on mobile and desktop
- Rate limiting to prevent abuse
- Analytics tracking

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/pixel-wars.git
   cd pixel-wars
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Copy `.env.local.example` to `.env.local` and fill in your values:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Deployment on Vercel

### 1. Create a Vercel Account

If you don't have one already, sign up at [vercel.com](https://vercel.com).

### 2. Install Vercel CLI (optional)

```bash
npm install -g vercel
```

### 3. Configure Environment Variables

Add the following environment variables in the Vercel dashboard:

- `NEXT_PUBLIC_APP_URL`: Your production URL
- `NEXTAUTH_URL`: Your production URL
- `NEXTAUTH_SECRET`: A secure random string
- `GOOGLE_CLIENT_ID`: Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Your Google OAuth client secret
- `RATE_LIMIT_ANON`: Number of pixels an anonymous user can place per minute
- `RATE_LIMIT_AUTH`: Number of pixels an authenticated user can place per minute
- `RATE_LIMIT_INTERVAL`: Time window in milliseconds
- `CANVAS_SIZE`: Size of the canvas grid
- `COOLDOWN_ANON`: Cooldown time for anonymous users in milliseconds
- `COOLDOWN_AUTH`: Cooldown time for authenticated users in milliseconds

### 4. Deploy

Using Vercel CLI:
```bash
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## Usage

1. Visit the app and choose to play anonymously or sign in
2. Select a color from the palette
3. Click on the canvas to place a pixel
4. Wait for the cooldown timer to end before placing another pixel
5. Collaborate with others to create pixel art masterpieces!

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, TailwindCSS
- **Real-time**: Socket.io for live updates
- **Authentication**: NextAuth.js
- **Analytics**: Vercel Analytics
- **Deployment**: Vercel

## Project Structure

```
pixel-wars/
├── src/
│   ├── app/             # Next.js app router files
│   ├── components/      # React components
│   ├── context/         # Context providers
│   ├── lib/             # Utility functions
│   └── styles/          # CSS styles
├── public/              # Static assets
├── vercel.json          # Vercel configuration
└── .env.local           # Environment variables
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
