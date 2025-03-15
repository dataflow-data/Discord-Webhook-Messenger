
# Discord Webhook Messenger

A modern web application for easily sending messages to Discord webhooks with support for text messages and rich embeds.

## Features

- **Text Messages**: Send simple text messages to Discord channels
- **Rich Embeds**: Create beautiful Discord embeds with titles, descriptions, and custom colors
- **Image Support**: Send images in both regular messages and embeds
- **Custom Identity**: Set custom usernames and avatar URLs for your webhook messages
- **Security**: Built-in rate limiting and security measures
- **Validation**: Ensures all webhook content follows Discord's requirements

## Getting Started

### Prerequisites

- Node.js (v16+) and npm
- Discord webhook URL from a server where you have permissions to obtain a webhook.

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

1. Enter your Discord webhook URL (found in Channel Settings > Integrations > Webhooks)
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

To build the production application:

```sh
npm run build
```

This will create optimized files in the `dist` directory.

## Serving the Production Build

To serve the production build locally:

```sh
npm run preview
```


## Contributing

Contributions are welcome! Whether it's fixing bugs, adding new features, or improving documentation, we encourage you to submit a Pull Request.

If you have any issues, feedback, or suggestions, feel free to open an issue. Your input is greatly appreciated and will help improve the project!

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [React](https://reactjs.org/)
- UI components from [shadcn-ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
- Toast notifications with [Sonner](https://sonner.emilkowal.ski/)
