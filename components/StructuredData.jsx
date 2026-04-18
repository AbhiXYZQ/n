import React from 'react';

const StructuredData = () => {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Nainix',
    'url': 'https://nainix.me',
    'logo': 'https://nainix.me/logo_light.png',
    'sameAs': [
      'https://www.linkedin.com/company/nainix',
      'https://www.instagram.com/nainix.me'
    ],
    'contactPoint': {
      '@type': 'ContactPoint',
      'telephone': '',
      'contactType': 'customer service',
      'areaServed': 'IN',
      'availableLanguage': 'en'
    },
    'description': 'Nainix is a developer-first freelance marketplace in India where clients and developers connect directly with minimal commissions.'
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Nainix',
    'url': 'https://nainix.me',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': 'https://nainix.me/jobs?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
    </>
  );
};

export default StructuredData;
