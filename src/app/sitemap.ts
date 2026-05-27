import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  // Replace this with your actual deployed Vercel domain
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://youssef-gamal-cv.vercel.app';

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    }
  ];
}