import React from 'react';
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  ChevronRight, 
  Settings, 
  Bell,
  User,
  Monitor,
  Film,
  BookMarked,
  TrendingUp
} from "lucide-react";

// Settings Page
export const SettingsPage = () => {
  const settingsCategories = [
    {
      title: "Account",
      items: [
        { id: 1, name: "Profile", icon: <User className="h-5 w-5" /> },
        { id: 2, name: "Notifications", icon: <Bell className="h-5 w-5" /> },
        { id: 3, name: "Playback Settings", icon: <Settings className="h-5 w-5" /> }
      ]
    },
    {
      title: "Preferences",
      items: [
        { id: 1, name: "Language", current: "English" },
        { id: 2, name: "Streaming Quality", current: "Auto" },
        { id: 3, name: "Autoplay", current: "On" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>
      <div className="max-w-3xl space-y-8">
        {settingsCategories.map((category, index) => (
          <div key={index} className="space-y-4">
            <h2 className="text-2xl font-semibold">{category.title}</h2>
            <Card className="p-6">
              {category.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-4 border-b last:border-0">
                  <div className="flex items-center space-x-3">
                    {item.icon}
                    <span>{item.name}</span>
                  </div>
                  {item.current && (
                    <span className="text-muted-foreground">{item.current}</span>
                  )}
                </div>
              ))}
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

// TV Shows Page
export const TVShowsPage = () => {
  const tvCategories = [
    {
      title: "Popular TV Shows",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Popular Show ${i + 1}`,
        imageUrl: `/api/placeholder/300/450`,
        rating: "96% Match"
      }))
    },
    {
      title: "Award-Winning Series",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Award Winner ${i + 1}`,
        imageUrl: `/api/placeholder/300/450`,
        rating: "98% Match"
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Monitor className="h-8 w-8" />
          <h1 className="text-4xl font-bold">TV Shows</h1>
        </div>
        <div className="space-y-8">
          {tvCategories.map((category, index) => (
            <div key={index} className="space-y-4">
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
                        <Badge className="absolute top-2 right-2">{item.rating}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Movies Page
export const MoviesPage = () => {
  const movieCategories = [
    {
      title: "Trending Movies",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Trending Movie ${i + 1}`,
        imageUrl: `/api/placeholder/300/450`,
        genre: ["Action", "Drama", "Thriller"][i % 3]
      }))
    },
    {
      title: "New Releases",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `New Release ${i + 1}`,
        imageUrl: `/api/placeholder/300/450`,
        genre: ["Comedy", "Romance", "Horror"][i % 3]
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <Film className="h-8 w-8" />
          <h1 className="text-4xl font-bold">Movies</h1>
        </div>
        <div className="space-y-8">
          {movieCategories.map((category, index) => (
            <div key={index} className="space-y-4">
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
                        <Badge className="absolute top-2 right-2">{item.genre}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// News & Popular Page
export const NewsAndPopularPage = () => {
  const newsCategories = [
    {
      title: "Trending Today",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Trending ${i + 1}`,
        imageUrl: `/api/placeholder/300/450`,
        trending: `#${i + 1} in Movies Today`
      }))
    },
    {
      title: "Popular on Netflix",
      items: Array(10).fill(null).map((_, i) => ({
        id: i,
        title: `Popular ${i + 1}`,
        imageUrl: `/api/placeholder/300/450`,
        views: `${Math.floor(Math.random() * 50 + 50)}M views`
      }))
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <TrendingUp className="h-8 w-8" />
          <h1 className="text-4xl font-bold">News & Popular</h1>
        </div>
        <div className="space-y-8">
          {newsCategories.map((category, index) => (
            <div key={index} className="space-y-4">
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
                        <Badge className="absolute top-2 right-2">
                          {item.trending || item.views}
                        </Badge>
                      </div>
                    </Card>
                  ))}
                </div>
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// My List Page
export const MyListPage = () => {
  const myList = Array(20).fill(null).map((_, i) => ({
    id: i,
    title: `My List Item ${i + 1}`,
    imageUrl: `/api/placeholder/300/450`,
    dateAdded: new Date(Date.now() - Math.random() * 10000000000).toLocaleDateString()
  }));

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8">
        <div className="flex items-center space-x-4 mb-8">
          <BookMarked className="h-8 w-8" />
          <h1 className="text-4xl font-bold">My List</h1>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {myList.map((item) => (
            <Card 
              key={item.id}
              className="cursor-pointer transition-transform hover:scale-105"
            >
              <div className="relative aspect-[2/3]">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="object-cover rounded-lg w-full h-full"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                  <p className="text-sm text-gray-300">Added: {item.dateAdded}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};