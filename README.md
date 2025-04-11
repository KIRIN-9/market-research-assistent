# Market Research Assistant

A modern web application designed to help users conduct, organize, and analyze market research efficiently.

## Overview

Market Research Assistant is a powerful tool that streamlines the market research process by providing an intuitive interface for exploring data, conducting research, and organizing notes and findings. Built with Next.js and Tailwind CSS, it offers a responsive and user-friendly experience.

## Features

- **Research Interface**: Conduct market research with AI-assisted capabilities
- **Notes Management**: Organize and store your research findings
- **Explorer**: Navigate through your collected data and insights
- **Dashboard**: Get an overview of your research progress and key metrics
- **Dark/Light Mode**: Choose your preferred theme

## Tech Stack

- **Framework**: Next.js 15
- **UI Components**: Radix UI
- **Styling**: Tailwind CSS
- **State Management**: React Hooks
- **AI Integration**: Google Generative AI
- **Data Persistence**: LocalForage
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or newer)
- npm, yarn, or bun package manager

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/yourusername/market-research-assistant.git
   cd market-research-assistant
   ```

2. Install dependencies

   ```bash
   bun install
   ```

3. Set up environment variables
   Create a `.env` file in the root directory and add necessary API keys:

   ```
   GOOGLE_API_KEY=your_google_api_key
   ```

4. Start the development server

   ```bash
   bun dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application

## Project Structure

- `/app` - Next.js app directory with pages and API routes
- `/components` - React components organized by feature
- `/hooks` - Custom React hooks
- `/lib` - Utility functions and shared code
- `/public` - Static assets
- `/styles` - Global styles

## Usage

1. **Dashboard**: Start on the main dashboard to get an overview of your research projects
2. **Research**: Use the research interface to conduct new market research
3. **Explorer**: Navigate through your collected data and insights
4. **Notes**: Organize and manage your research findings

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Radix UI](https://radix-ui.com/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
