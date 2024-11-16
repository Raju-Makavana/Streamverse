import React from 'react';
import { Button } from "@/components/ui/button";
import { Play, Info, ChevronRight } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import image from "../assets/stranger.png";

const Home = () => {
  // Mock featured content
  const featured = {
    title: "Stranger Things",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    imageUrl: image,
    type: "TV Series",
    genre: "Sci-Fi & Fantasy",
    rating: "16+"
  };

  // Mock categories with content
  const categories = [
    {
      title: "Trending Now",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Trending Title ${i + 1}`,
        imageUrl: image,
      }))
    },
    {
      title: "Continue Watching",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Continue Watching ${i + 1}`,
        imageUrl: image,
        progress: Math.random() * 100
      }))
    },
    {
      title: "New Releases",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `New Release ${i + 1}`,
        imageUrl: image,
      }))
    }
  ];

  // Mock content rows
  const ContentRow = ({ category }) => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">{category.title}</h2>
        <Button variant="ghost" size="sm">
          See All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="w-full whitespace-nowrap">
        <div className="flex space-x-4 pb-4">
          {category.items.map((item) => (
            <Card 
              key={item.id}
              className="w-[200px] shrink-0 cursor-pointer transition-transform hover:scale-105"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover rounded-lg w-full h-full"
                />
                {item.progress && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative h-[80vh] w-full">
        <img
          src={featured.imageUrl}
          alt={featured.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 space-y-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold">{featured.title}</h1>
            <div className="flex items-center space-x-2">
              <Badge>{featured.type}</Badge>
              <Badge>{featured.genre}</Badge>
              <Badge>{featured.rating}</Badge>
            </div>
            <p className="text-lg max-w-2xl">{featured.description}</p>
          </div>
          <div className="flex space-x-4">
            <Button size="lg">
              <Play className="mr-2 h-5 w-5" /> Play
            </Button>
            <Button size="lg" variant="secondary">
              <Info className="mr-2 h-5 w-5" /> More Info
            </Button>
          </div>
        </div>
      </div>

      {/* Content Sections */}
      <div className="px-4 md:px-8 space-y-8 py-8">
        {categories.map((category, index) => (
          <ContentRow key={index} category={category} />
        ))}
      </div>
    </div>
  );
};

export default Home;