import { Link } from 'react-router-dom';
import { Clock, ArrowRight } from 'lucide-react';
import { Article } from '@/data/articles';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export function ArticleCard({ article, variant = 'default', className }: ArticleCardProps) {
  const articleUrl = `/article/${article.datePublished.substring(0, 4)}/${article.datePublished.substring(5, 7)}/${article.slug}`;

  if (variant === 'featured') {
    return (
      <article className={cn("group relative overflow-hidden rounded-2xl bg-card shadow-card card-hover", className)}>
        <Link to={articleUrl} className="block">
          <div className="aspect-[16/9] md:aspect-[21/9] overflow-hidden">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
            <Badge variant="secondary" className="mb-3 bg-primary/90 text-primary-foreground hover:bg-primary">
              {article.categoryLabel}
            </Badge>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-semibold text-card mb-2 line-clamp-2">
              {article.title}
            </h2>
            <p className="text-card/80 text-sm md:text-base line-clamp-2 mb-4 max-w-2xl">
              {article.excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-card/70">
              <span className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {article.readingTime} min
              </span>
              <span>{new Date(article.datePublished).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className={cn("group flex gap-4", className)}>
        <Link to={articleUrl} className="flex-shrink-0">
          <div className="w-20 h-20 rounded-lg overflow-hidden">
            <img
              src={article.image}
              alt={article.imageAlt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={articleUrl}>
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
              {article.title}
            </h3>
          </Link>
          <p className="text-xs text-muted-foreground mt-1">
            {article.readingTime} min · {new Date(article.datePublished).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
          </p>
        </div>
      </article>
    );
  }

  return (
    <article className={cn("group bg-card rounded-xl overflow-hidden shadow-soft card-hover", className)}>
      <Link to={articleUrl} className="block">
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={article.image}
            alt={article.imageAlt}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
        <div className="p-5">
          <Badge variant="outline" className="mb-3 text-xs">
            {article.categoryLabel}
          </Badge>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              {article.readingTime} min
            </span>
            <span className="flex items-center gap-1 text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              Lire <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
