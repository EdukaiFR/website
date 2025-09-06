import { Metadata } from 'next';

export const siteConfig = {
  name: 'Edukai',
  title: 'Edukai - Révise mieux, pas plus',
  description: 'Plateforme d\'apprentissage intelligente qui génère automatiquement des quiz et fiches de révision à partir de vos cours. Optimisez votre temps de révision avec l\'IA.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'https://edukai.fr',
  ogImage: '/og-image.png',
  links: {
    twitter: 'https://twitter.com/edukai',
    linkedin: 'https://linkedin.com/company/edukai',
  },
  creator: '@edukai',
  keywords: [
    'révision',
    'apprentissage',
    'IA',
    'quiz',
    'fiches de révision',
    'éducation',
    'études',
    'examens',
    'PDF',
    'génération automatique',
    'étudiant',
    'cours'
  ],
};

export function constructMetadata({
  title = siteConfig.title,
  description = siteConfig.description,
  image = siteConfig.ogImage,
  noIndex = false,
  ...props
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} & Partial<Metadata> = {}): Metadata {
  const url = siteConfig.url;
  
  return {
    title,
    description,
    keywords: siteConfig.keywords.join(', '),
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      images: [
        {
          url: image.startsWith('http') ? image : `${url}${image}`,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: 'fr_FR',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
      creator: siteConfig.creator,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
      googleBot: {
        index: !noIndex,
        follow: !noIndex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    metadataBase: new URL(url),
    alternates: {
      canonical: url,
    },
    ...props,
  };
}

export function generateCourseMetadata({
  title,
  subject,
  level,
  description,
  courseId,
}: {
  title: string;
  subject?: string;
  level?: string;
  description?: string;
  courseId: string;
}): Metadata {
  const courseTitle = `${title} - ${subject || 'Cours'} | Edukai`;
  const courseDescription = description || 
    `Révise ${title} avec des quiz et fiches générés par IA. ${subject ? `Matière: ${subject}.` : ''} ${level ? `Niveau: ${level}.` : ''} Optimise tes révisions avec Edukai.`;
  
  return constructMetadata({
    title: courseTitle,
    description: courseDescription,
    openGraph: {
      title: courseTitle,
      description: courseDescription,
      type: 'article',
      url: `${siteConfig.url}/library/${courseId}`,
    },
  });
}

export function generateStructuredData(
  type: 'Organization' | 'Course' | 'WebSite', 
  data?: {
    title?: string;
    description?: string;
    level?: string;
    subject?: string;
  }
) {
  const baseData = {
    '@context': 'https://schema.org',
  };

  switch (type) {
    case 'Organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: siteConfig.name,
        url: siteConfig.url,
        logo: `${siteConfig.url}/logo.png`,
        description: siteConfig.description,
        sameAs: Object.values(siteConfig.links).filter(Boolean),
      };
    
    case 'WebSite':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: siteConfig.name,
        url: siteConfig.url,
        description: siteConfig.description,
        potentialAction: {
          '@type': 'SearchAction',
          target: `${siteConfig.url}/library?search={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      };
    
    case 'Course':
      return {
        ...baseData,
        '@type': 'Course',
        name: data?.title || 'Cours',
        description: data?.description || siteConfig.description,
        provider: {
          '@type': 'Organization',
          name: siteConfig.name,
          url: siteConfig.url,
        },
        educationalLevel: data?.level,
        about: {
          '@type': 'Thing',
          name: data?.subject,
        },
      };
    
    default:
      return baseData;
  }
}