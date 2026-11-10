'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, ZoomIn, Sparkles } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { SectionHeading } from '@/components/ui/SectionHeading';

interface GalleryItem {
  title: string;
  category: 'Pizzas' | 'Starters' | 'Pasta' | 'Sandwiches' | 'Special Items';
  caption: string;
  image: string;
  wide?: boolean;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    title: 'Chicken Tikka Pizza',
    category: 'Pizzas',
    caption: 'Tikka spiced chicken, sliced onions, rich mozzarella blend on golden stone-baked crust',
    image: '/images/gallery/chicken-tikka-pizza.jpg',
    wide: true,
  },
  {
    title: 'Chicken Fajita Pizza',
    category: 'Pizzas',
    caption: 'Savory chicken fajita, crisp green peppers, onions, and melted cheese',
    image: '/images/gallery/chicken-fajita-pizza.jpg',
  },
  {
    title: 'Creamy Shawarma Pizza',
    category: 'Special Items',
    caption: 'Rich white garlic sauce base, tender shawarma fajita slices, spicy jalapenos, cheese',
    image: '/images/gallery/creamy-shawarma-pizza.jpg',
  },
  {
    title: 'Stuffed Crust Pizza',
    category: 'Special Items',
    caption: 'Signature crust edge loaded with molten mozzarella cheese pull',
    image: '/images/gallery/stuffed-crust-pizza.jpg',
  },
  {
    title: 'Loaded Pizza Fries',
    category: 'Special Items',
    caption: 'Crisp seasoned French fries draped in marinara, pepperoni, and bubbling melted cheese',
    image: '/images/gallery/loaded-pizza-fries.jpg',
  },
  {
    title: 'Crispy Chicken Wings',
    category: 'Starters',
    caption: 'Marinated and golden-fried crispy chicken wings served with zesty dip',
    image: '/images/gallery/chicken-wings.jpg',
  },
  {
    title: 'Toasted Garlic Bread',
    category: 'Starters',
    caption: 'Oven-baked artisan bread brushed with rich garlic herb butter',
    image: '/images/gallery/garlic-bread.jpg',
  },
  {
    title: 'Oven-Baked Chicken Lasagne',
    category: 'Pasta',
    caption: 'Layers of tender pasta sheets, savory minced chicken Bolognese, and melted mozzarella',
    image: '/images/gallery/chicken-lasagne.jpg',
    wide: true,
  },
  {
    title: 'Creamy Pasta Alfredo',
    category: 'Pasta',
    caption: 'Al dente pasta tossed in rich velvety parmesan cream sauce with aromatic herbs',
    image: '/images/gallery/creamy-pasta.jpg',
  },
  {
    title: 'Toasted Chicken Sandwich',
    category: 'Sandwiches',
    caption: 'Warm crisp toasted sub packed with seasoned chicken slices and garlic dressing',
    image: '/images/gallery/chicken-sandwich.jpg',
  },
];

const CATEGORIES = ['All', 'Pizzas', 'Starters', 'Pasta', 'Sandwiches', 'Special Items'] as const;
type Category = (typeof CATEGORIES)[number];

const CATEGORY_COLORS: Record<string, string> = {
  Pizzas: 'text-primary border-primary/40 bg-primary/10',
  Starters: 'text-secondary border-secondary/40 bg-secondary/10',
  Pasta: 'text-amber-400 border-amber-400/40 bg-amber-400/10',
  Sandwiches: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
  'Special Items': 'text-purple-400 border-purple-400/40 bg-purple-400/10',
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: 'easeOut' as const },
  },
};

export function Gallery() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const filteredItems =
    activeCategory === 'All'
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  const openLightbox = (idx: number) => setLightboxIndex(idx);
  const closeLightbox = () => setLightboxIndex(null);

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex, goNext, goPrev]);

  const handleImgError = (idx: number) => {
    setImgErrors((prev) => ({ ...prev, [idx]: true }));
  };

  const currentLightboxItem =
    lightboxIndex !== null ? filteredItems[lightboxIndex] : null;

  return (
    <section className="py-20 bg-surface/30 border-b border-surface-border relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

      <Container size="xl">
        <SectionHeading
          badge="Culinary Showcase"
          title="VISUAL EXPERIENCE"
          subtitle="Explore the flavours and dish concepts featured across our menu categories."
        />

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {CATEGORIES.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className={`px-4 py-1.5 text-xs sm:text-sm font-semibold rounded-full border transition-all duration-200 ${
                activeCategory === cat
                  ? 'bg-primary text-white border-primary shadow-glow-red'
                  : 'bg-surface border-surface-border text-muted-light hover:border-secondary/50 hover:text-white'
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        {/* Gallery Grid */}
        <motion.div
          key={activeCategory}
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-60px' }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {filteredItems.map((item, idx) => (
            <motion.div
              key={`${activeCategory}-${idx}`}
              variants={itemVariants}
              onClick={() => openLightbox(idx)}
              className={`group relative rounded-2xl overflow-hidden bg-surface border border-surface-border cursor-pointer
                hover:border-secondary/50 transition-all duration-300 shadow-md hover:shadow-glow-gold
                ${item.wide ? 'sm:col-span-2' : ''}
              `}
            >
              {/* Image wrapper with aspect ratio */}
              <div
                className="relative w-full overflow-hidden"
                style={{ aspectRatio: item.wide ? '16/7' : '4/3' }}
              >
                {!imgErrors[idx] ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes={
                      item.wide
                        ? '(max-width: 640px) 100vw, 66vw'
                        : '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw'
                    }
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => handleImgError(idx)}
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-surface to-surface-elevated">
                    <span className="text-5xl mb-2">🍕</span>
                    <span className="text-xs text-muted uppercase tracking-wider">
                      {item.category}
                    </span>
                  </div>
                )}

                {/* Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-65 transition-opacity duration-300" />

                {/* Zoom icon */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 opacity-0 group-hover:opacity-100 transition-all duration-300 scale-75 group-hover:scale-100">
                  <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                    <ZoomIn className="w-5 h-5 text-white" />
                  </div>
                </div>

                {/* Category badge */}
                <div className="absolute top-3 left-3 z-20">
                  <span
                    className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full backdrop-blur-md ${CATEGORY_COLORS[item.category] || 'text-secondary border-secondary/40 bg-secondary/10'}`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Bottom text */}
                <div className="absolute bottom-0 left-0 right-0 z-20 p-4 space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-white font-display group-hover:text-secondary transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted leading-relaxed line-clamp-2 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    {item.caption}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Disclaimer */}
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary inline" />
            <span>
              Illustrative concept gallery. Authentic restaurant photographs will replace concept
              visuals upon owner approval.
            </span>
          </p>
        </div>
      </Container>

      {/* ===== LIGHTBOX ===== */}
      <AnimatePresence>
        {lightboxIndex !== null && currentLightboxItem && (
          <motion.div
            key="lightbox-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[999] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative max-w-3xl w-full bg-surface border border-surface-border rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                {!imgErrors[lightboxIndex] ? (
                  <Image
                    src={currentLightboxItem.image}
                    alt={currentLightboxItem.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                    onError={() => handleImgError(lightboxIndex)}
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-surface-elevated">
                    <span className="text-6xl mb-3">🍕</span>
                    <span className="text-sm text-muted">{currentLightboxItem.category}</span>
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-1/4 bg-gradient-to-t from-surface to-transparent" />
              </div>

              {/* Info */}
              <div className="p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span
                      className={`inline-block px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider border rounded-full mb-2 ${CATEGORY_COLORS[currentLightboxItem.category] || 'text-secondary border-secondary/40'}`}
                    >
                      {currentLightboxItem.category}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-white font-display">
                      {currentLightboxItem.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-muted mt-1 leading-relaxed">
                      {currentLightboxItem.caption}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0 mt-1 font-mono">
                    {lightboxIndex + 1} / {filteredItems.length}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <button
                onClick={closeLightbox}
                className="absolute top-3 right-3 w-9 h-9 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-colors z-10"
                aria-label="Close lightbox"
              >
                <X className="w-4 h-4" />
              </button>

              {filteredItems.length > 1 && (
                <>
                  <button
                    onClick={(e) => { e.stopPropagation(); goPrev(); }}
                    className="absolute left-3 top-[38%] -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-colors z-10"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); goNext(); }}
                    className="absolute right-3 top-[38%] -translate-y-1/2 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-primary transition-colors z-10"
                    aria-label="Next image"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
