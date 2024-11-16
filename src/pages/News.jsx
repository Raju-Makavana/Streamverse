import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, ChevronRight, Play, Info, Flame, Trophy, Clock } from "lucide-react";
import { motion } from 'framer-motion';
import image from "../assets/stranger.png";

const NewsAndPopularPage = () => {
  const [selectedContent, setSelectedContent] = useState(null);

  const featuredContent = {
    title: "Wednesday",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends — and foes — at Nevermore Academy.",
    imageUrl: image,
    rating: "99% Match",
    year: "2024",
    type: "Series",
    genre: "Fantasy Drama",
    trending: "#1 in Movies Today"
  };

  const contentCategories = [
    {
      title: "Trending Now",
      icon: <Flame className="h-5 w-5 text-red-500" />,
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Trending Title ${i + 1}`,
        imageUrl: image,
        rating: "97% Match",
        synopsis: "Everyone's watching this right now!",
        year: "2024",
        type: i % 2 === 0 ? "Movie" : "Series",
        trendingRank: `#${i + 1} in ${i % 2 === 0 ? 'Movies' : 'TV'} Today`
      }))
    },
    {
      title: "Top 10 Movies This Week",
      icon: <Trophy className="h-5 w-5 text-yellow-500" />,
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Top Movie ${i + 1}`,
        imageUrl: image,
        rating: "95% Match",
        synopsis: "One of this week's most-watched films.",
        year: "2024",
        type: "Movie",
        rank: i + 1
      }))
    },
    {
      title: "Coming Soon",
      icon: <Clock className="h-5 w-5 text-blue-500" />,
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Upcoming Title ${i + 1}`,
        imageUrl: image,
        synopsis: "Get ready for this upcoming release!",
        year: "2024",
        type: i % 2 === 0 ? "Movie" : "Series",
        releaseDate: `Coming ${Math.floor(Math.random() * 30 + 1)} days`
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
      {/* Hero Section */}
      <motion.div 
        className="relative h-[70vh] w-full overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute inset-0 scale-105">
          <motion.img
            src={featuredContent.imageUrl}
            alt={featuredContent.title}
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
            <Badge variant="secondary" className="mb-2">{featuredContent.trending}</Badge>
            <h1 className="text-5xl md:text-7xl font-bold">{featuredContent.title}</h1>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary">{featuredContent.rating}</Badge>
              <Badge>{featuredContent.year}</Badge>
              <Badge>{featuredContent.type}</Badge>
              <Badge>{featuredContent.genre}</Badge>
            </div>
            <p className="text-lg max-w-2xl">{featuredContent.description}</p>
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
          <TrendingUp className="h-8 w-8" />
          <h1 className="text-4xl font-bold">News & Popular</h1>
        </div>

        {contentCategories.map((category, index) => (
          <motion.div 
            key={index} 
            className="space-y-4"
            variants={itemVariants}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {category.icon}
                <h2 className="text-2xl font-semibold">{category.title}</h2>
              </div>
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
                      onMouseEnter={() => setSelectedContent(item)}
                      onMouseLeave={() => setSelectedContent(null)}
                    >
                      <div className="relative aspect-[2/3]">
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="object-cover w-full h-full transition-transform duration-300 hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
                            {item.trendingRank && (
                              <Badge variant="secondary" className="mb-2">{item.trendingRank}</Badge>
                            )}
                            {item.rank && (
                              <Badge variant="secondary" className="mb-2">#{item.rank}</Badge>
                            )}
                            {item.releaseDate && (
                              <Badge variant="secondary" className="mb-2">{item.releaseDate}</Badge>
                            )}
                            <h3 className="font-semibold text-white">{item.title}</h3>
                            <div className="flex space-x-2">
                              <Badge variant="outline">{item.year}</Badge>
                              <Badge variant="outline">{item.type}</Badge>
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

export default NewsAndPopularPage;