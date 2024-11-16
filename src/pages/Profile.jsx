// pages/Profile.jsx
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  // Mock watch history
  const watchHistory = Array(10).fill(null).map((_, i) => ({
    id: i,
    title: `Movie/Show Title ${i + 1}`,
    watchedDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    thumbnail: `/api/placeholder/160/90`,
    progress: Math.floor(Math.random() * 100),
  }));

  // Mock uploaded content
  const uploadedContent = Array(5).fill(null).map((_, i) => ({
    id: i,
    title: `My Upload ${i + 1}`,
    uploadDate: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toLocaleDateString(),
    thumbnail: `/api/placeholder/160/90`,
    views: Math.floor(Math.random() * 10000),
    status: ['Published', 'Processing', 'Draft'][i % 3],
  }));

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 bg-card rounded-lg border">
          <Avatar className="w-24 h-24">
            <AvatarImage src="/api/placeholder/100/100" />
            <AvatarFallback>US</AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold">User Name</h1>
            <p className="text-muted-foreground">user@example.com</p>
            <div className="flex gap-2">
              <Badge>Premium Member</Badge>
              <Badge variant="outline">Since 2023</Badge>
            </div>
          </div>
          <Button className="md:ml-auto">Edit Profile</Button>
        </div>

        {/* Profile Content */}
        <Tabs defaultValue="history" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 md:grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="history">Watch History</TabsTrigger>
            <TabsTrigger value="uploads">My Uploads</TabsTrigger>
            <TabsTrigger value="playlist">Playlists</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <CardTitle>Watch History</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-4">
                    {watchHistory.map((item) => (
                      <div key={item.id} className="flex gap-4 p-2 hover:bg-accent rounded-lg">
                        <img 
                          src={item.thumbnail} 
                          alt={item.title}
                          className="w-40 h-24 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">Watched on {item.watchedDate}</p>
                          <div className="mt-2 h-1 bg-secondary rounded-full">
                            <div 
                              className="h-full bg-primary rounded-full" 
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="uploads">
            <Card>
              <CardHeader>
                <CardTitle>My Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uploadedContent.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-lg">
                      <img 
                        src={item.thumbnail} 
                        alt={item.title}
                        className="w-40 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">Uploaded on {item.uploadDate}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <Badge variant="secondary">{item.views.toLocaleString()} views</Badge>
                          <Badge 
                            variant={item.status === 'Published' ? 'default' : 'outline'}
                          >
                            {item.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="destructive" size="sm">Delete</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="playlist">
            <Card>
              <CardHeader>
                <CardTitle>My Playlists</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Array(6).fill(null).map((_, i) => (
                    <Card key={i} className="cursor-pointer hover:bg-accent/50">
                      <CardContent className="p-4">
                        <div className="aspect-video relative rounded-lg overflow-hidden mb-4">
                          <img 
                            src={`/api/placeholder/320/180`}
                            alt={`Playlist ${i + 1}`}
                            className="object-cover w-full h-full"
                          />
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge className="text-lg">{Math.floor(Math.random() * 20) + 1} videos</Badge>
                          </div>
                        </div>
                        <h3 className="font-semibold">My Playlist {i + 1}</h3>
                        <p className="text-sm text-muted-foreground">Last updated 2 days ago</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;