import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Upload, Search, Menu, User, LogOut } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
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
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const Header = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();

  const navigationItems = [
    { label: 'Home', path: '/home' },
    { label: 'Browse', path: '/browse' },
    { label: 'TV Shows', path: '/tv-shows' },
    { label: 'Movies', path: '/movies' },
    { label: 'New & Popular', path: '/news' },
    { label: 'My List', path: '/my-list' },
  ];

  const MobileMenu = () => (
    <div className="space-y-4 pt-4">
      {navigationItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className="block px-4 py-2 text-lg hover:bg-accent rounded-md"
        >
          {item.label}
        </Link>
      ))}
      <div className="px-4 pt-4">
        <Input
          placeholder="Search videos..."
          className="w-full"
        />
      </div>
    </div>
  );

  return (
    <header className="fixed top-0 w-full z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="flex h-16 items-center px-4">
        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80">
            <div className="flex flex-col h-full">
              <h2 className="text-2xl font-bold text-primary">StreamVerse</h2>
              <MobileMenu />
            </div>
          </SheetContent>
        </Sheet>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className="hidden md:inline-block text-2xl font-bold">
            StreamVerse
          </span>
          <span className="md:hidden text-2xl font-bold">SV</span>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden md:flex mx-6">
          <NavigationMenuList>
            {navigationItems.map((item) => (
              <NavigationMenuItem key={item.path}>
                <Link to={item.path}>
                  <NavigationMenuLink className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                    {item.label}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        {/* Right Side Icons */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Search */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Upload */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/upload')}
          >
            <Upload className="h-5 w-5" />
          </Button>

          {/* Notifications */}
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/my-list')}>
                My List
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/upload')}>
                <Upload className="mr-2 h-4 w-4" />
                <span>Upload Video</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Search Bar - Expandable */}
      {isSearchOpen && (
        <div className="border-t p-4 animate-in slide-in-from-top">
          <div className="max-w-2xl mx-auto">
            <Input
              placeholder="Search videos..."
              className="w-full"
              autoFocus
            />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;