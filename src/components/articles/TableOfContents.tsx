import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface Heading {
  id: string;
  text: string;
  level: number;
}

interface TableOfContentsProps {
  content: string;
  className?: string;
}

export function TableOfContents({ content, className }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<Heading[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // Extract headings from markdown content
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches = [...content.matchAll(headingRegex)];
    
    const extractedHeadings = matches.map((match) => ({
      id: match[2].toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      text: match[2],
      level: match[1].length,
    }));
    
    setHeadings(extractedHeadings);
  }, [content]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-80px 0px -80% 0px' }
    );

    headings.forEach(({ id }) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 3) return null;

  return (
    <nav className={cn("", className)} aria-label="Table des matières">
      <h4 className="font-semibold text-sm mb-3 text-foreground">Sommaire</h4>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={cn(
              heading.level === 3 && "ml-4"
            )}
          >
            <a
              href={`#${heading.id}`}
              className={cn(
                "block text-sm py-1 transition-colors border-l-2 pl-3 -ml-px",
                activeId === heading.id
                  ? "border-primary text-foreground font-medium"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
              )}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
