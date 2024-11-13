import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Loader, ZoomIn } from 'lucide-react';
import { ZoomableImage } from './ui/ZoomableImage';

interface ImageGalleryProps {
  images: string[];
  autoSlideInterval?: number;
}

export function ImageGallery({ images, autoSlideInterval = 6000 }: ImageGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  // Preload adjacent images
  const preloadImages = useCallback((index: number) => {
    const imagesToLoad = [
      index - 1, // Previous
      index,     // Current
      index + 1  // Next
    ].filter(i => i >= 0 && i < images.length);

    imagesToLoad.forEach(i => {
      if (!loadedImages.has(i)) {
        const img = new Image();
        img.src = images[i];
        img.onload = () => {
          setLoadedImages(prev => new Set([...prev, i]));
        };
      }
    });
  }, [images, loadedImages]);

  const navigate = useCallback((direction: 'prev' | 'next') => {
    if (isTransitioning) return;

    setIsTransitioning(true);
    setCurrentImage(prev => {
      const next = direction === 'next' 
        ? (prev + 1) % images.length
        : (prev - 1 + images.length) % images.length;
      return next;
    });

    setTimeout(() => {
      setIsTransitioning(false);
    }, 300);
  }, [images.length, isTransitioning]);

  // Auto-slide functionality
  useEffect(() => {
    if (!isPaused && autoSlideInterval && !zoomImage) {
      const interval = setInterval(() => {
        navigate('next');
      }, autoSlideInterval);

      return () => clearInterval(interval);
    }
  }, [navigate, isPaused, autoSlideInterval, zoomImage]);

  useEffect(() => {
    preloadImages(currentImage);
  }, [currentImage, preloadImages]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
    setIsPaused(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;

    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;

    if (Math.abs(diff) > 50) { // Minimum swipe distance
      navigate(diff > 0 ? 'next' : 'prev');
      setTouchStart(null);
    }
  };

  const handleTouchEnd = () => {
    setTouchStart(null);
    setIsPaused(false);
  };

  // Mouse handlers for hover pause
  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  return (
    <>
      <div 
        className="relative w-full h-[500px] group"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div 
          className="relative w-full h-full overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {images.map((src, index) => (
            <div
              key={src}
              className={`absolute inset-0 w-full h-full transition-transform duration-300 ease-in-out ${
                index === currentImage 
                  ? 'translate-x-0 opacity-100'
                  : index < currentImage 
                    ? '-translate-x-full opacity-0'
                    : 'translate-x-full opacity-0'
              }`}
              style={{ zIndex: index === currentImage ? 1 : 0 }}
            >
              {loadedImages.has(index) ? (
                <div className="relative w-full h-full">
                  <img
                    src={src}
                    alt={`Vehicle image ${index + 1}`}
                    className="w-full h-full object-cover cursor-zoom-in"
                    loading={index === 0 ? 'eager' : 'lazy'}
                    onClick={() => setZoomImage(src)}
                  />
                  <button
                    onClick={() => setZoomImage(src)}
                    className="absolute bottom-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors opacity-0 group-hover:opacity-100 z-10"
                    title="Zoom image"
                  >
                    <ZoomIn size={20} />
                  </button>
                </div>
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <Loader className="w-8 h-8 animate-spin text-primary" />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        <button
          onClick={() => navigate('prev')}
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
          disabled={isTransitioning}
          aria-label="Previous image"
        >
          <ChevronLeft size={24} />
        </button>
        
        <button
          onClick={() => navigate('next')}
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/75 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50 z-10"
          disabled={isTransitioning}
          aria-label="Next image"
        >
          <ChevronRight size={24} />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm z-10">
          {currentImage + 1} / {images.length}
        </div>

        {/* Thumbnail navigation */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (!isTransitioning && index !== currentImage) {
                  setCurrentImage(index);
                }
              }}
              disabled={isTransitioning}
              className={`w-2 h-2 rounded-full transition-all ${
                currentImage === index 
                  ? 'bg-white scale-125' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/10">
          <div 
            className="h-full bg-white/50 transition-all duration-300"
            style={{ 
              width: `${((currentImage + 1) / images.length) * 100}%`,
            }}
          />
        </div>
      </div>

      {/* Zoomable image modal */}
      {zoomImage && (
        <ZoomableImage
          src={zoomImage}
          alt="Vehicle detail"
          onClose={() => setZoomImage(null)}
        />
      )}
    </>
  );
}