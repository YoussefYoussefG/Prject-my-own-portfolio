import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  // Replace this with your actual deployed Vercel domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://youssef-portfolio.vercel.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}