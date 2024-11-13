import React, { useState, useRef, useEffect } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

interface ZoomableImageProps {
  src: string;
  alt: string;
  onClose: () => void;
}

export function ZoomableImage({ src, alt, onClose }: ZoomableImageProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY * -0.01;
    const newScale = Math.min(Math.max(0.5, scale + delta), 4);
    setScale(newScale);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
      return;
    }
    e.preventDefault();
    setIsDragging(true);
    setStartPos({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    
    setPosition({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.5, 4));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === containerRef.current) {
      onClose();
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center cursor-zoom-out"
      onClick={handleBackdropClick}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-50">
        <button
          onClick={handleZoomOut}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
          title="Zoom out"
        >
          <ZoomOut size={24} />
        </button>
        <button
          onClick={handleZoomIn}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
          title="Zoom in"
        >
          <ZoomIn size={24} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition-colors"
          title="Close"
        >
          <X size={24} />
        </button>
      </div>
      
      <div
        className={`relative overflow-hidden w-full h-full ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={src}
          alt={alt}
          className="absolute transform-gpu transition-transform duration-100"
          style={{
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            transformOrigin: 'center',
            maxWidth: '90vw',
            maxHeight: '90vh',
            margin: 'auto',
            top: '50%',
            left: '50%',
            marginLeft: '-45vw',
            marginTop: '-45vh',
          }}
          draggable={false}
        />
      </div>
      
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
        {Math.round(scale * 100)}%
      </div>
    </div>
  );
}