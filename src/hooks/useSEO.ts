import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
}

const DEFAULT_TITLE = 'Inmobiliaria';
const DEFAULT_DESC  = 'La inmobiliaria de confianza en Venezuela. Compra, vende o alquila propiedades verificadas con asesores expertos.';

function setMeta(name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setOG(property: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[property="${property}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', property);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

export function useSEO({ title, description }: SEOProps) {
  useEffect(() => {
    document.title = title;
    setMeta('description', description);
    setOG('og:title', title);
    setOG('og:description', description);

    return () => {
      document.title = DEFAULT_TITLE;
      setMeta('description', DEFAULT_DESC);
      setOG('og:title', DEFAULT_TITLE);
      setOG('og:description', DEFAULT_DESC);
    };
  }, [title, description]);
}
