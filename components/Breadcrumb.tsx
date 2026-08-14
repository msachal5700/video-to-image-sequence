import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  const location = useLocation();

  // Deduplicate Home if passed in items array
  const cleanItems = items.filter(item => item.label.toLowerCase() !== 'home' && item.path !== '/');

  // Construct BreadcrumbList JSON-LD schema
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.videotoimagesequence.online"
      },
      ...cleanItems.map((item, index) => {
        const path = item.path || location.pathname;
        return {
          "@type": "ListItem",
          "position": index + 2,
          "name": item.label,
          "item": `https://www.videotoimagesequence.online${path.startsWith('/') ? path : '/' + path}`
        };
      })
    ]
  };

  return (
    <>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
      
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-2">
        <nav className="flex items-center gap-2 text-xs text-gray-500 font-sans" aria-label="Breadcrumb">
          <Link to="/" className="hover:text-cyan-400 transition-colors">Home</Link>
          {cleanItems.map((item, index) => {
            const isLast = index === cleanItems.length - 1;
            return (
              <React.Fragment key={index}>
                <span className="text-gray-700 select-none">/</span>
                {isLast || !item.path ? (
                  <span className="text-gray-400 font-semibold">{item.label}</span>
                ) : (
                  <Link to={item.path} className="hover:text-cyan-400 transition-colors">
                    {item.label}
                  </Link>
                )}
              </React.Fragment>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default Breadcrumb;
