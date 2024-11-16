// pages/Browse.jsx
import React, { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, SlidersHorizontal } from "lucide-react";
import image from "../assets/stranger.png";

const Browse = () => {
  const [view, setView] = useState('grid');
  
  // Mock content data
  const content = Array(20).fill(null).map((_, i) => ({
    id: i,
    title: `Content Title ${i + 1}`,
    type: i % 2 === 0 ? 'Movie' : 'TV Show',
    genre: ['Action', 'Drama', 'Comedy', 'Sci-Fi'][i % 4],
    year: 2020 + (i % 5),
    rating: ['TV-MA', 'TV-14', 'TV-PG'][i % 3],
    duration: i % 2 === 0 ? '2h 15m' : `${i + 1} Seasons`,
    imageUrl: image
  }));

  const ContentCard = ({ item }) => (
    <Card className="h-full cursor-pointer hover:scale-105 transition-transform">
      <div className="relative aspect-[2/3]">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="object-cover rounded-t-lg w-full h-full"
        />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary">{item.rating}</Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold truncate">{item.title}</h3>
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <span>{item.year}</span>
          <span>•</span>
          <span>{item.type}</span>
          <span>•</span>
          <span>{item.duration}</span>
        </div>
        <Badge variant="outline" className="mt-2">{item.genre}</Badge>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background p-4 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-4xl font-bold">Browse</h1>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Content Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="movies">Movies</SelectItem>
              <SelectItem value="tv">TV Shows</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>

          <Select defaultValue="trending">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="trending">Trending</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="az">A-Z</SelectItem>
            </SelectContent>
          </Select>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" /> Filters
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>Filter By</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Genre</DropdownMenuItem>
              <DropdownMenuItem>Year</DropdownMenuItem>
              <DropdownMenuItem>Rating</DropdownMenuItem>
              <DropdownMenuItem>Language</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" onClick={() => setView(view === 'grid' ? 'list' : 'grid')}>
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            View
          </Button>
        </div>
      </div>

      {/* Content Grid */}
      <div className={`grid gap-6 ${
        view === 'grid' 
          ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5' 
          : 'grid-cols-1'
      }`}>
        {content.map((item) => (
          <ContentCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Browse;