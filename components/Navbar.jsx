'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { Search, Moon, Sun, Menu, X, UserCog, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import useAuthStore from '@/lib/store/authStore';
import { useTheme } from 'next-themes';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from '@/components/ui/sheet';

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { user, isAuthenticated, logout, login } = useAuthStore();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path) => pathname === path;

  // ... (hydrateSession remains same)

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } catch (error) {
    } finally {
      logout();
      setIsSheetOpen(false);
      router.push('/');
    }
  };

  // ... (handleCommandSelect remains same)

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        {/* ... (Logo remains same) ... */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="relative flex items-center justify-center w-8 h-8">
            <div className="absolute -inset-2 bg-primary/20 blur-md rounded-full z-0 transition-all duration-300 group-hover:bg-primary/30 group-hover:blur-lg" />
            <Image 
              src="/logo_light.png" 
              alt="Nainix Logo" 
              fill
              className="object-contain block dark:hidden relative z-10"
            />
            <Image 
              src="/logo_dark.png" 
              alt="Nainix Logo" 
              fill
              className="object-contain hidden dark:block relative z-10"
            />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Nainix
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {/* ... links ... */}
          <Link href="/jobs" className={`text-sm transition-all px-4 py-2 rounded-full ${isActive('/jobs') ? 'bg-primary/10 text-primary font-semibold' : 'font-medium text-foreground/80 hover:text-primary hover:bg-primary/5'}`}>
            Find Work
          </Link>
          <Link href="/founders" className={`group relative inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 text-sm transition-all border ${isActive('/founders') ? 'bg-primary text-primary-foreground border-primary shadow-md font-semibold' : 'bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 font-semibold'}`}>
            <Zap className={`h-3.5 w-3.5 fill-current ${!isActive('/founders') ? 'group-hover:animate-pulse' : ''}`} />
            Founders Offer
          </Link>
          <Link href="/#how-it-works" className="text-sm transition-all px-4 py-2 rounded-full font-medium text-foreground/80 hover:text-primary hover:bg-primary/5">
            How it Works
          </Link>
          <Link href="/pricing" className={`text-sm transition-all px-4 py-2 rounded-full ${isActive('/pricing') ? 'bg-primary/10 text-primary font-semibold' : 'font-medium text-foreground/80 hover:text-primary hover:bg-primary/5'}`}>
            Pricing
          </Link>
          <Link href="/collab" className={`text-sm transition-all px-4 py-2 rounded-full ${isActive('/collab') ? 'bg-primary/10 text-primary font-semibold' : 'font-medium text-foreground/80 hover:text-primary hover:bg-primary/5'}`}>
            Collab
          </Link>
          
          <Button
            variant="outline"
            className="relative w-64 justify-start text-sm text-muted-foreground"
            onClick={() => setOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            <span>Search...</span>
          </Button>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          {isAuthenticated ? (
            <DropdownMenu>
              {/* ... User Menu ... */}
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 sm:h-10 sm:w-10 rounded-full">
                  <Avatar className="h-9 w-9 sm:h-10 sm:w-10">
                    <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                    <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                  <Link href={`/${user?.username}`}>Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'}>Dashboard</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Button variant="ghost" asChild><Link href="/login">Login</Link></Button>
              <Button asChild><Link href="/register">Sign Up</Link></Button>
            </div>
          )}

          {/* 📱 MOBILE MENU FIX: Use Sheet Component */}
          <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[350px] p-0 border-l border-border/60">
              <SheetHeader className="p-6 pb-2 border-b border-border/40">
                <SheetTitle className="text-left font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Nainix Menu
                </SheetTitle>
              </SheetHeader>
              
              <div className="flex flex-col p-4 h-[calc(100vh-80px)] overflow-y-auto scrollbar-none">
                <div className="space-y-1 mb-6">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start h-11 text-muted-foreground border-border/40 bg-muted/20"
                    onClick={() => {
                      setIsSheetOpen(false);
                      setOpen(true);
                    }}
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Global Search
                  </Button>
                </div>

                <div className="space-y-1">
                  <p className="px-4 text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">Marketplace</p>
                  <Link 
                    href="/jobs" 
                    onClick={() => setIsSheetOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/jobs') ? 'bg-primary/10 text-primary font-bold shadow-sm' : 'text-foreground/80 hover:bg-muted font-medium'}`}
                  >
                    Find Work
                  </Link>
                  <Link 
                    href="/founders" 
                    onClick={() => setIsSheetOpen(false)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${isActive('/founders') ? 'bg-primary text-primary-foreground border-primary shadow-md font-bold' : 'text-primary bg-primary/10 border-primary/20 hover:bg-primary/20 font-bold'}`}
                  >
                    <Zap className={`h-4 w-4 fill-current ${!isActive('/founders') ? 'animate-pulse' : ''}`} />
                    Founders Offer
                  </Link>
                  <Link 
                    href="/pricing" 
                    onClick={() => setIsSheetOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/pricing') ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/80 hover:bg-muted font-medium'}`}
                  >
                    Pricing
                  </Link>
                  <Link 
                    href="/collab" 
                    onClick={() => setIsSheetOpen(false)}
                    className={`flex items-center px-4 py-3 rounded-xl transition-all ${isActive('/collab') ? 'bg-primary/10 text-primary font-bold' : 'text-foreground/80 hover:bg-muted font-medium'}`}
                  >
                    Collab Rooms
                  </Link>
                </div>

                <Separator className="my-6 opacity-40" />

                <div className="space-y-1 mt-auto">
                  {!isAuthenticated ? (
                    <div className="grid grid-cols-2 gap-3 p-2">
                      <Button variant="outline" className="rounded-xl h-11" asChild onClick={() => setIsSheetOpen(false)}>
                        <Link href="/login">Login</Link>
                      </Button>
                      <Button className="rounded-xl h-11" asChild onClick={() => setIsSheetOpen(false)}>
                        <Link href="/register">Sign Up</Link>
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2 p-2">
                       <Link 
                        href={user?.role === 'CLIENT' ? '/dashboard/client' : '/dashboard/freelancer'} 
                        onClick={() => setIsSheetOpen(false)}
                        className="flex items-center px-4 py-3 rounded-xl font-bold bg-muted/40 hover:bg-muted transition-all"
                      >
                        Go to Dashboard
                      </Link>
                      <Button variant="ghost" className="w-full justify-start px-4 py-3 text-destructive hover:text-destructive hover:bg-destructive/5 rounded-xl h-auto" onClick={handleLogout}>
                        Logout
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
      {/* ... CommandDialog remains same ... */}

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
            <CommandItem onSelect={() => handleCommandSelect('pricing')}>
              <span>Pricing & Upgrades</span>
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