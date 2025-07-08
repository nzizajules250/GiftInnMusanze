import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      // Your originals
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
        port: '',
        pathname: '/**',
      },

      // Free image CDNs
      {protocol: 'https', hostname: 'cdn.pixabay.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'images.unsplash.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'res.cloudinary.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'cdn.jsdelivr.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'raw.githubusercontent.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'via.placeholder.com', port: '', pathname: '/**'},

      // Social media
      {protocol: 'https', hostname: 'scontent.cdninstagram.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'scontent.xx.fbcdn.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'pbs.twimg.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'platform-lookaside.fbsbx.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'lh3.googleusercontent.com', port: '', pathname: '/**'},

      // WhatsApp
      {protocol: 'https', hostname: 'mmg.whatsapp.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'pps.whatsapp.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'web.whatsapp.com', port: '', pathname: '/**'},

      // Google services
      {protocol: 'https', hostname: 'storage.googleapis.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'drive.google.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'docs.google.com', port: '', pathname: '/**'},

      // Microsoft & GitHub
      {protocol: 'https', hostname: 'onedrive.live.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'user-images.githubusercontent.com', port: '', pathname: '/**'},

      // Discord & Slack
      {protocol: 'https', hostname: 'cdn.discordapp.com', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'media.discordapp.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: 'files.slack.com', port: '', pathname: '/**'},

      // Shopify & Ecommerce
      {protocol: 'https', hostname: 'cdn.shopify.com', port: '', pathname: '/**'},

      // Additional generic CDN patterns
      {protocol: 'https', hostname: '*.cloudfront.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: '*.akamaized.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: '*.fbcdn.net', port: '', pathname: '/**'},
      {protocol: 'https', hostname: '*.whatsapp.net', port: '', pathname: '/**'},
    ],
  },
};

export default nextConfig;
