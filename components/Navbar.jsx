'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Moon, Sun, Menu, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import useAuthStore from '@/lib/store/authStore';
import { useTheme } from 'next-themes';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  // Command menu
  const handleCommandSelect = (value) => {
    setOpen(false);
    if (value === 'jobs') router.push('/jobs');
    if (value === 'collab') router.push('/collab');
    if (value === 'dashboard') router.push(user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Zap className="h-7 w-7 text-primary" fill="currentColor" />
            <div className="absolute -inset-1 bg-primary/20 blur-md rounded-full" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nainix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
            Find Work
          </Link>
          <Link href="/collab" className="text-sm font-medium hover:text-primary transition-colors">
            Collab
          </Link>
          
          {/* Search */}
          <Button
            variant="outline"
            className="relative w-64 justify-start text-sm text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search...</span>
            <kbd className="pointer-events-none absolute right-2 top-2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {/* Theme Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {/* Post a Job Button */}
          {isAuthenticated && user?.role === 'CLIENT' && (
            <Button asChild className="hidden md:flex">
              <Link href="/dashboard/client">Post a Job</Link>
            </Button>
          )}

          {/* Auth Buttons */}
          {!isAuthenticated ? (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </div>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/${user?.username}`}>My Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'}>
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout}>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t p-4 space-y-3">
          <Button variant="outline" className="w-full justify-start" onClick={() => setOpen(true)}>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
          <Link href="/jobs" className="block px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
            Find Work
          </Link>
          <Link href="/collab" className="block px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
            Collab
          </Link>
          {!isAuthenticated ? (
            <>
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/login">Login</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/register">Sign Up</Link>
              </Button>
            </>
          ) : (
            <>
              <Link href={`/${user?.username}`} className="block px-4 py-2 hover:bg-muted rounded-md" onClick={() => setMobileMenuOpen(false)}>
                My Profile
              </Link>
              <Link 
                href={user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'} 
                className="block px-4 py-2 hover:bg-muted rounded-md" 
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Button variant="ghost" className="w-full" onClick={() => { logout(); setMobileMenuOpen(false); }}>
                Logout
              </Button>
            </>
          )}
        </div>
      )}

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => handleCommandSelect('jobs')}>
              <Search className="mr-2 h-4 w-4" />
              <span>Browse Jobs</span>
            </CommandItem>
            <CommandItem onSelect={() => handleCommandSelect('collab')}>
              <span>Community Collab</span>
            </CommandItem>
            {isAuthenticated && (
              <CommandItem onSelect={() => handleCommandSelect('dashboard')}>
                <span>My Dashboard</span>
              </CommandItem>
            )}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </nav>
  );
};

export default Navbar;
