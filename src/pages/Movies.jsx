import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Film, ChevronRight, Play, Info } from "lucide-react";
import { motion } from 'framer-motion';
import image from "../assets/stranger.png";

const MoviesPage = () => {
  const [selectedMovie, setSelectedMovie] = useState(null);

  const featuredMovie = {
    title: "Inception",
    description: "A skilled thief who specializes in extracting information from people's minds during sleep must plant an idea into a CEO's mind in what could be the perfect crime - or his last job ever.",
    imageUrl: image,
    rating: "96% Match",
    year: "2010",
    duration: "2h 28m",
    genre: "Sci-Fi Action"
  };

  const movieCategories = [
    {
      title: "Trending Now",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Popular Movie ${i + 1}`,
        imageUrl: image,
        rating: "95% Match",
        synopsis: "A groundbreaking film that pushes the boundaries of cinema.",
        year: "2024",
        duration: `${Math.floor(Math.random() * 60 + 90)}m`
      }))
    },
    {
      title: "Oscar Winners",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Award Winner ${i + 1}`,
        imageUrl: image,
        rating: "98% Match",
        synopsis: "An acclaimed masterpiece that captured critics' hearts.",
        year: "2023",
        duration: `${Math.floor(Math.random() * 60 + 90)}m`
      }))
    },
    {
      title: "New Releases",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `New Release ${i + 1}`,
        imageUrl: image,
        rating: "94% Match",
        synopsis: "The latest blockbuster hitting screens worldwide.",
        year: "2024",
        duration: `${Math.floor(Math.random() * 60 + 90)}m`
      }))
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section with Parallax Effect */}
      <motion.div 
        className="relative h-[70vh] w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 scale-105">
          <motion.img
            src={featuredMovie.imageUrl}
            alt={featuredMovie.title}
            className="w-full h-full object-cover"
            initial={{ scale: 1.2 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <motion.div 
          className="absolute bottom-0 left-0 right-0 p-8 space-y-4"
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="space-y-2">
            <h1 className="text-5xl md:text-7xl font-bold">{featuredMovie.title}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{featuredMovie.rating}</Badge>
              <Badge>{featuredMovie.year}</Badge>
              <Badge>{featuredMovie.duration}</Badge>
              <Badge>{featuredMovie.genre}</Badge>
            </div>
            <p className="text-lg max-w-2xl">{featuredMovie.description}</p>
          </div>
          <div className="flex space-x-4">
            <Button 
              size="lg" 
              className="group hover:scale-105 transition-all duration-300"
            >
              <Play className="mr-2 h-5 w-5 group-hover:animate-pulse" /> 
              Watch Now
            </Button>
            <Button 
              size="lg" 
              variant="secondary"
              className="group hover:scale-105 transition-all duration-300"
            >
              <Info className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" /> 
              More Info
            </Button>
          </div>
        </motion.div>
      </motion.div>

      {/* Content Sections */}
      <motion.div 
        className="px-4 md:px-8 space-y-12 py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="flex items-center space-x-4">
          <Film className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Movies</h1>
        </div>

        {movieCategories.map((category, index) => (
          <motion.div 
            key={index} 
            className="space-y-4"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">{category.title}</h2>
              <Button 
                variant="ghost" 
                size="sm"
                className="group hover:scale-105 transition-all duration-300"
              >
                See All 
                <ChevronRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Button>
            </div>
            <ScrollArea className="w-full whitespace-nowrap">
              <div className="flex space-x-4 pb-4">
                {category.items.map((item, itemIndex) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: itemIndex * 0.1 }}
                    whileHover={{ scale: 1.05, zIndex: 1 }}
                    className="relative"
                  >
                    <Card 
                      className="w-[250px] shrink-0 cursor-pointer overflow-hidden"
                      onMouseEnter={() => setSelectedMovie(item)}
                      onMouseLeave={() => setSelectedMovie(null)}
                    >
                      <div className="relative aspect-[2/3]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                            <Badge className="mb-2">{item.rating}</Badge>
                            <h3 className="font-semibold text-white">{item.title}</h3>
                            <div className="flex space-x-2">
                              <Badge variant="outline">{item.year}</Badge>
                              <Badge variant="outline">{item.duration}</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
              <ScrollBar 
                orientation="horizontal" 
                className="hover:bg-primary/20 transition-colors duration-300"
              />
            </ScrollArea>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default MoviesPage;