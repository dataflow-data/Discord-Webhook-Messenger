
# Discord Webhook Messenger

A modern web application for easily sending messages to Discord webhooks with support for text messages and rich embeds.

![Discord Webhook Messenger](https://i.imgur.com/your-screenshot-here.png)

## Features

- **Text Messages**: Send simple text messages to Discord channels
- **Rich Embeds**: Create beautiful Discord embeds with titles, descriptions, and custom colors
- **Image Support**: Send images in both regular messages and embeds
- **Custom Identity**: Set custom usernames and avatar URLs for your webhook messages
- **Security**: Built-in rate limiting and security measures
- **Validation**: Ensures all webhook content follows Discord's requirements
- **Persistence**: Remembers your webhook URLs and settings for convenience

## Getting Started

### Prerequisites

- Node.js (v16+) and npm
- Discord webhook URL from a server where you have permissions

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

The app will be available at http://localhost:5173 (or the port displayed in your terminal)

## Usage

1. Enter your Discord webhook URL (found in Server Settings > Integrations > Webhooks)
2. Choose between text message or rich embed
3. Fill in the message content or embed details
4. Optionally add images (either URL or uploaded)
5. Accept the terms of use
6. Click "Send Message"

### Text Messages

- Enter your message in the content field
- Optionally add an image

### Rich Embeds

- Add a title, description, and/or image
- Choose a color for the embed border
- Optional: Add additional text above the embed

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

## Deploying

This application can be deployed to any static hosting service:

- **Netlify**: Connect your repository or drag and drop the `dist` folder
- **Vercel**: Connect your repository and set the output directory to `dist`
- **GitHub Pages**: Push the `dist` folder to the `gh-pages` branch

## Security Considerations

The application includes several security measures:

- Content validation to prevent abuse
- Rate limiting to prevent spam
- Blocked patterns for potentially malicious content
- Terms acceptance to ensure responsible use

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn-ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Toast notifications with [Sonner](https://sonner.emilkowal.ski/)
