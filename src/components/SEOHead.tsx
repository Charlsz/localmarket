'use client';

import React from 'react';
import { useSEO } from '@/hooks/useSEO';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
}

export default function SEOHead(props: SEOHeadProps) {
  useSEO(props);
  return null;
}
