
# Discord Webhook Messenger

A modern web application for easily sending messages to Discord webhooks with support for text messages and rich embeds.

![Discord Webhook Messenger](public/og-image.png)

## Features

- **Simple Interface**: Easy-to-use form for sending webhook messages
- **Rich Embeds**: Create beautiful Discord embeds with titles, descriptions, and custom colors
- **Image Support**: Upload images for both regular messages and embeds
- **Security**: Built-in rate limiting and security measures
- **Validation**: Ensures all webhook content follows Discord's requirements
- **Persistence**: Remembers your webhook URLs and settings for convenience

## Technology Stack

This project is built with:

- Vite
- TypeScript
- React
- React Router
- shadcn-ui
- Tailwind CSS
- React Query
- Zod for validation

## Getting Started

### Prerequisites

- Node.js (v16+) and npm
- Git

### Installation

1. Clone the repository
```sh
git clone https://github.com/yourusername/discord-webhook-messenger.git
cd discord-webhook-messenger
```

2. Install dependencies
```sh
npm install
```

3. Start the development server
```sh
npm run dev
```

The app will be available at http://localhost:8080

## Building for Production

To build the application for production:

```sh
npm run build
```

This will create optimized files in the `dist` directory.

## Serving the Production Build

To serve the production build locally:

```sh
npm run preview
```

## Deployment

You can deploy this application to any static site hosting service:

1. Build the project using `npm run build`
2. Upload the contents of the `dist` directory to your hosting service
3. Configure your hosting service to handle SPA routing if needed

Popular hosting options:
- Netlify
- Vercel
- GitHub Pages
- Firebase Hosting

## Security Measures

The application implements several security features:

- Rate limiting to prevent abuse
- Progressive blocking for violations
- Content validation
- URL sanitization
- Size restrictions according to Discord limits

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [shadcn-ui](https://ui.shadcn.com/) components
- Icons from [Lucide React](https://lucide.dev/)
