declare global {
  interface Window {
    dataLayer?: any[];
    va?: (action: string, data?: any) => void;
    gtag?: (...args: any[]) => void;
  }
}

export function trackSectionNavigation(sectionSlug: string, source: string = 'nav_click') {
  // Normalize path with leading slash, e.g. "/el-laboratorio"
  const cleanSlug = sectionSlug.startsWith('/') ? sectionSlug : `/${sectionSlug}`;
  
  // 1. Update window hash so URL bar reflects the exact section path
  if (typeof window !== 'undefined') {
    const targetHash = `#${cleanSlug}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }

    // 2. Google Analytics (gtag.js / dataLayer)
    if (window.dataLayer && Array.isArray(window.dataLayer)) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: cleanSlug,
        page_title: `Cokito's Lab · ${sectionSlug}`,
        navigation_source: source,
      });
      window.dataLayer.push({
        event: 'section_navigation',
        section: cleanSlug,
        source: source,
      });
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: cleanSlug,
        page_title: `Cokito's Lab · ${sectionSlug}`,
      });
    }

    // 3. Vercel Analytics (va)
    if (typeof window.va === 'function') {
      window.va('event', {
        name: 'section_visit',
        path: cleanSlug,
        source: source,
      });
    }

    // 4. Custom browser event for internal subscribers
    window.dispatchEvent(
      new CustomEvent('cokitos:section_change', {
        detail: { path: cleanSlug, source },
      })
    );
  }
}
