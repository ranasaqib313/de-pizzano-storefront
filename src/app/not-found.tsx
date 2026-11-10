import React from 'react';
import Link from 'next/link';
import { Flame, Home, Utensils } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-20 bg-background text-center">
      <Container size="sm" className="space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto">
          <Flame className="w-8 h-8 text-primary" />
        </div>

        <span className="text-secondary font-mono font-bold tracking-widest text-sm uppercase">
          404 — Page Not Found
        </span>

        <h1 className="text-4xl sm:text-5xl font-black text-foreground font-display uppercase tracking-tight">
          THIS SLICE HAS MOVED
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto leading-relaxed">
          The page you requested doesn&apos;t exist or may have been updated. Head back to explore our full 26-item menu.
        </p>

        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Button variant="primary" size="md" href="/" icon={<Home className="w-4 h-4" />}>
            Back to Home
          </Button>
          <Button variant="outline" size="md" href="/menu" icon={<Utensils className="w-4 h-4 text-secondary" />}>
            Explore Full Menu
          </Button>
        </div>
      </Container>
    </div>
  );
}

