import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePasswords } from "@/hooks/usePasswords";
import { useAuth } from "@/hooks/useAuth";
import {
  Search,
  PlusCircle,
  EyeOff,
  Eye,
  Trash2,
  Copy,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const { passwords, isLoading, loadPasswords, removePassword } =
    usePasswords();

  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [visiblePasswords, setVisiblePasswords] = useState<
    Record<string, boolean>
  >({});
  const [sortBy, setSortBy] = useState("recent");

  // Check if user is authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  // Load passwords if authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadPasswords();
    }
  }, [isAuthenticated, loadPasswords]);

  // Toggle password visibility
  const togglePasswordVisibility = (id: string) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Copy password to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Handle password deletion
  const handleDeletePassword = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      try {
        await removePassword(id);
      } catch (error) {
        console.error("Failed to delete password:", error);
      }
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigate to add new password page
  const goToAddPassword = () => {
    navigate("/add");
  };

  // Navigate to edit password page
  const goToEditPassword = (id: string) => {
    navigate(`/edit-item/${id}`);
  };

  // Filtered and sorted passwords
  const filteredAndSortedPasswords = useMemo(() => {
    return passwords
      .filter((password) => {
        // Apply search filter
        const matchesSearch =
          password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (password.url &&
            password.url.toLowerCase().includes(searchTerm.toLowerCase()));

        // Apply category filter
        const matchesFilter =
          filter === "all" ||
          (password.category && password.category === filter);

        return matchesSearch && matchesFilter;
      })
      .sort((a, b) => {
        // Apply sorting
        if (sortBy === "recent") {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        } else if (sortBy === "alphabetical") {
          return a.title.localeCompare(b.title);
        } else if (sortBy === "category") {
          return (a.category || "").localeCompare(b.category || "");
        }
        return 0;
      });
  }, [passwords, searchTerm, filter, sortBy]);

  // Get unique categories for filter dropdown
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    passwords.forEach((password) => {
      if (password.category) {
        uniqueCategories.add(password.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [passwords]);

  // Return loading UI if still loading
  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <div className="mb-6 flex justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-8 w-32" />
        </div>
        <div className="mb-6 flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="mb-4 h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Password Vault</h1>
          <p className="text-muted-foreground">
            {user?.email
              ? `Logged in as ${user.email}`
              : "Your secure password manager"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={goToAddPassword} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Password
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate("/settings")}>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="mb-6 flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search passwords..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Sort By" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="alphabetical">Alphabetical</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredAndSortedPasswords.length === 0 ? (
        <div className="mt-8 flex flex-col items-center justify-center p-8 text-center">
          <div className="rounded-full bg-primary/10 p-3">
            <Search className="h-6 w-6 text-primary" />
          </div>
          <h3 className="mt-4 text-xl font-medium">No passwords found</h3>
          <p className="mt-2 text-muted-foreground">
            {searchTerm || filter !== "all"
              ? "Try changing your search or filter criteria"
              : "Add your first password to get started"}
          </p>
          <Button onClick={goToAddPassword} className="mt-4">
            Add Password
          </Button>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredAndSortedPasswords.map((password) => (
            <Card
              key={password.id}
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => goToEditPassword(password.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium">{password.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {password.username || "No username"}
                    </p>
                    {password.category && (
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
                        {password.category}
                      </span>
                    )}
                  </div>
                  <div
                    className="flex items-center space-x-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePasswordVisibility(password.id);
                      }}
                      title={
                        visiblePasswords[password.id]
                          ? "Hide password"
                          : "Show password"
                      }
                    >
                      {visiblePasswords[password.id] ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        copyToClipboard(password.password);
                      }}
                      title="Copy password"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeletePassword(password.id);
                      }}
                      className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                      title="Delete password"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {visiblePasswords[password.id] && (
                  <div
                    className="mt-2 rounded bg-muted/50 p-2 font-mono text-sm"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {password.password}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
