'use client';

import { motion } from "framer-motion";
import { FaFilter, FaEye, FaShoppingBag, FaTimes, FaArrowRight } from "react-icons/fa";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Artwork } from "@/types/artwork";
import { siteConfig } from "@/lib/site-config";

interface WorkGalleryProps {
  artwork: Artwork[];
}

export default function WorkGallery({ artwork }: WorkGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ceramics' | 'bags' | 'graphic' | 'illustration' | 'pottery' | 'macrame'>('all');
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredArtwork = selectedCategory === 'all' 
    ? artwork 
    : artwork.filter(item => item.category === selectedCategory);

  const displayedArtwork = showAll ? filteredArtwork : filteredArtwork.slice(0, 8);

  return (
    <>
      {/* Filter Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mb-8"
      >
        <div className="flex flex-wrap justify-center gap-3">
          {[
            { key: 'all', label: 'All Work' },
            { key: 'ceramics', label: 'Ceramics' },
            { key: 'bags', label: 'Handbags' },
            { key: 'graphic', label: 'Graphic Design' },
            { key: 'illustration', label: 'Illustration' },
            { key: 'pottery', label: 'Pottery' },
            { key: 'macrame', label: 'Macramé' }
          ].map((category) => (
            <button
              key={category.key}
              onClick={() => setSelectedCategory(category.key as any)}
              className={`px-6 py-3 rounded-full font-brand-bold transition-all duration-300 flex items-center gap-2 ${
                selectedCategory === category.key
                  ? 'bg-brand-vibrant-pink text-white shadow-lg transform scale-105'
                  : 'bg-brand-dark-teal/20 text-brand-light-pink hover:bg-brand-vibrant-pink/20 border border-brand-vibrant-pink/30 hover:border-brand-vibrant-pink/60'
              }`}
            >
              <FaFilter className="text-sm" />
              {category.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Gallery Grid - Responsive masonry layout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mb-8"
      >
        {displayedArtwork.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group cursor-pointer"
            onClick={() => setSelectedArtwork(item)}
          >
            <div className="bg-brand-dark-teal/20 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg border border-brand-vibrant-pink/30 hover:shadow-xl hover:border-brand-vibrant-pink/60 transition-all duration-300 hover:scale-105">
              {/* Image */}
              <div className="aspect-square relative overflow-hidden">
                <Image
                  src={item.imageSrc}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const fallback = target.nextElementSibling as HTMLElement;
                    if (fallback) fallback.style.display = 'flex';
                  }}
                />
                {/* Fallback for failed images */}
                <div 
                  className="absolute inset-0 bg-gradient-to-br from-brand-vibrant-pink/20 to-brand-light-pink/20 flex items-center justify-center"
                  style={{ display: 'none' }}
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-brand-vibrant-pink/30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FaEye className="text-brand-light-pink text-xl" />
                    </div>
                    <p className="text-brand-light-pink text-sm font-brand-elegant">Image Loading...</p>
                  </div>
                </div>
                
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-brand-dark-teal/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="text-center">
                    <FaEye className="text-brand-light-pink text-3xl mb-2" />
                    <p className="text-brand-light-pink font-brand-bold">View Details</p>
                  </div>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-brand-bold text-brand-light-pink group-hover:text-brand-vibrant-pink transition-colors truncate">
                    {item.title}
                  </h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-brand-bold flex-shrink-0 ${
                    item.category === 'ceramics' 
                      ? 'bg-brand-vibrant-pink/20 text-brand-vibrant-pink border border-brand-vibrant-pink/30'
                      : 'bg-brand-light-pink/20 text-brand-light-pink border border-brand-light-pink/30'
                  }`}>
                    {item.category}
                  </span>
                </div>
                <p className="text-brand-light-pink/80 text-sm mb-4 line-clamp-2 font-brand-elegant">
                  {item.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-brand-vibrant-pink font-brand-bold text-lg">
                    {item.price}
                  </span>
                  <button className="bg-brand-vibrant-pink/20 text-brand-vibrant-pink py-2 px-4 rounded-lg hover:bg-brand-vibrant-pink hover:text-white transition-all duration-300 font-brand-bold flex items-center gap-2 text-sm">
                    <FaEye />
                    View
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* See All Button */}
      {filteredArtwork.length > 8 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center mb-8"
        >
          <button
            onClick={() => setShowAll(!showAll)}
            className="bg-brand-vibrant-pink text-white px-8 py-4 rounded-full hover:bg-brand-vibrant-pink/90 transition-all duration-300 font-brand-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center gap-3 mx-auto"
          >
            {showAll ? 'Show Less' : 'See All'}
            <FaArrowRight className={`transition-transform duration-300 ${showAll ? 'rotate-180' : ''}`} />
          </button>
        </motion.div>
      )}

      {/* Empty State */}
      {filteredArtwork.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 bg-brand-vibrant-pink/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaFilter className="text-brand-vibrant-pink text-3xl" />
          </div>
          <h3 className="text-2xl font-brand-bold text-brand-light-pink mb-4">
            No items found
          </h3>
          <p className="text-brand-light-pink/80 mb-6 font-brand-elegant">
            Try selecting a different category to see more work.
          </p>
          <button
            onClick={() => setSelectedCategory('all')}
            className="bg-brand-vibrant-pink text-white px-6 py-3 rounded-full hover:bg-brand-vibrant-pink/90 transition-colors font-brand-bold"
          >
            View All Work
          </button>
        </motion.div>
      )}

      {/* Lightbox Modal */}
      {selectedArtwork && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-brand-dark-teal/90 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedArtwork(null)}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-brand-dark-teal/40 backdrop-blur-sm rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden border border-brand-vibrant-pink/30"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image */}
              <div className="relative aspect-square md:aspect-auto">
                <Image
                  src={selectedArtwork.imageSrc}
                  alt={selectedArtwork.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
              
              {/* Details */}
              <div className="p-8 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-3xl font-brand-bold text-brand-light-pink">
                      {selectedArtwork.title}
                    </h2>
                    <button
                      onClick={() => setSelectedArtwork(null)}
                      className="p-2 hover:bg-brand-vibrant-pink/20 rounded-full transition-colors"
                    >
                      <FaTimes className="text-brand-light-pink" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <span className={`px-3 py-1 rounded-full text-sm font-brand-bold ${
                      selectedArtwork.category === 'ceramics' 
                        ? 'bg-brand-vibrant-pink/20 text-brand-vibrant-pink border border-brand-vibrant-pink/30'
                        : 'bg-brand-light-pink/20 text-brand-light-pink border border-brand-light-pink/30'
                    }`}>
                      {selectedArtwork.category}
                    </span>
                    <span className="text-2xl font-brand-bold text-brand-vibrant-pink">
                      {selectedArtwork.price}
                    </span>
                  </div>
                  
                  <p className="text-brand-light-pink/80 mb-6 leading-relaxed font-brand-elegant">
                    {selectedArtwork.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div>
                      <span className="font-brand-bold text-brand-light-pink">Dimensions:</span>
                      <span className="text-brand-light-pink/80 ml-2 font-brand-elegant">{selectedArtwork.dimensions}</span>
                    </div>
                    <div>
                      <span className="font-brand-bold text-brand-light-pink">Materials:</span>
                      <span className="text-brand-light-pink/80 ml-2 font-brand-elegant">{selectedArtwork.materials}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4 mt-8">
                  <Link
                    href={siteConfig.shopPath}
                    className="flex-1 bg-brand-vibrant-pink text-white py-3 px-6 rounded-lg hover:bg-brand-vibrant-pink/90 transition-colors font-brand-bold flex items-center justify-center gap-2"
                  >
                    <FaShoppingBag />
                    Shop
                  </Link>
                  <button
                    onClick={() => setSelectedArtwork(null)}
                    className="px-6 py-3 border border-brand-vibrant-pink/30 text-brand-light-pink rounded-lg hover:bg-brand-vibrant-pink/20 transition-colors font-brand-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </>
  );
}
