import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Filter,
  Eye,
  EyeOff,
  Trash2,
  Copy,
  LogOut,
  Plus,
  Edit2,
  SortAsc,
  SortDesc,
  Unlock,
  Moon,
  Sun,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { usePasswords } from "@/hooks/usePasswords";
import { useAuth } from "@/hooks/useAuth";
import { Password } from "@/types";
import { decryptPassword } from "@/lib/crypto";

export default function DashboardPage() {
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "category">(
    "recent"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [decryptedPasswords, setDecryptedPasswords] = useState<{
    [key: number]: string;
  }>({});
  const [darkMode, setDarkMode] = useState<boolean>(
    document.documentElement.classList.contains("dark")
  );

  const navigate = useNavigate();
  const {
    passwords = [],
    isLoading,
    deletePasswordMutation,
    fetchPasswords,
  } = usePasswords();
  const { logout, getMasterPassword } = useAuth();

  // Toggle password visibility
  const togglePasswordVisibility = (id: number | undefined) => {
    if (id === undefined) return;

    setVisiblePasswordIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Copy to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      toast.success("Copied to clipboard!");
    });
  };

  // Handle decrypt password
  const handleDecrypt = async (id: number | undefined) => {
    if (id === undefined) return;

    try {
      const masterPassword = getMasterPassword();
      if (!masterPassword) {
        toast.error("Master password not available");
        return;
      }

      const passwordData = passwords.find((p) => p.id === id)?.password || "";
      const decrypted = await decryptPassword(passwordData, masterPassword);
      setDecryptedPasswords((prev) => ({ ...prev, [id]: decrypted }));
      toast.success("Password decrypted!");
    } catch (error) {
      console.error("Decryption error:", error);
      toast.error("Failed to decrypt password");
    }
  };

  // Handle delete password
  const handleDeletePassword = async (id: number | undefined) => {
    if (id === undefined) return;

    try {
      deletePasswordMutation.mutate(id, {
        onSuccess: () => {
          toast.success("Password deleted successfully!");
        },
        onError: () => {
          toast.error("Failed to delete password");
        },
      });
    } catch (error) {
      toast.error("Failed to delete password");
    }
  };

  // Logout
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Navigate to add password page
  const goToAddPassword = () => {
    navigate("/add");
  };

  // Navigate to edit password page
  const goToEditPassword = (id: number | undefined) => {
    if (id === undefined) return;
    navigate(`/edit/${id}`);
  };

  // Filter and sort passwords
  const filteredAndSortedPasswords = useMemo(() => {
    return passwords
      .filter((password: Password) => {
        // Apply search filter
        const matchesSearch =
          password.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (password.website
            ? password.website.toLowerCase().includes(searchTerm.toLowerCase())
            : false) ||
          false;

        // Apply category filter
        const matchesFilter =
          categoryFilter === null || password.category === categoryFilter;

        return matchesSearch && matchesFilter;
      })
      .sort((a: Password, b: Password) => {
        // Apply sorting
        if (sortBy === "recent") {
          const dateA = new Date(a.updatedAt || a.createdAt || 0).getTime();
          const dateB = new Date(b.updatedAt || b.createdAt || 0).getTime();
          return sortDirection === "asc" ? dateA - dateB : dateB - dateA;
        } else if (sortBy === "alphabetical") {
          return sortDirection === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
        } else if (sortBy === "category") {
          const catA = a.category || "";
          const catB = b.category || "";
          return sortDirection === "asc"
            ? catA.localeCompare(catB)
            : catB.localeCompare(catA);
        }
        return 0;
      });
  }, [passwords, searchTerm, categoryFilter, sortBy, sortDirection]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = new Set<string>();
    passwords.forEach((password: Password) => {
      if (password.category) {
        uniqueCategories.add(password.category);
      }
    });
    return Array.from(uniqueCategories);
  }, [passwords]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setDarkMode(!darkMode);
  };

  // Only fetch passwords when the component mounts, not on every re-render
  useEffect(() => {
    // Fetch passwords only if we don't have them already
    if (passwords.length === 0 && !isLoading) {
      fetchPasswords();
    }
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Main container with consistent width */}
      <div className="mx-auto w-full max-w-5xl px-4 flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border py-4 bg-background sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold md:text-2xl flex items-center">
              <Shield className="w-6 h-6 mr-2 text-primary" />
              <span className="text-gradient">Password Protector</span>
            </h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="hidden md:flex text-muted-foreground hover:text-foreground hover:bg-secondary/80"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
                <span className="sr-only">Toggle theme</span>
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="gap-2 hidden md:flex hover:bg-secondary/80 border-border"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
              <Button
                onClick={goToAddPassword}
                className="gap-2 bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4" />
                Add New
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden pt-6">
          {/* Search & Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search passwords..."
                className="pl-10 border-border focus:border-primary focus:ring-primary/30"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border hover:bg-secondary/80"
                >
                  <Filter className="mr-2 h-4 w-4 text-primary" />
                  Category: {categoryFilter || "All"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-border shadow-md"
              >
                <DropdownMenuItem
                  onClick={() => setCategoryFilter(null)}
                  className={
                    !categoryFilter
                      ? "bg-secondary text-secondary-foreground"
                      : ""
                  }
                >
                  All Categories
                </DropdownMenuItem>
                {categories.map((category) => (
                  <DropdownMenuItem
                    key={category}
                    onClick={() => setCategoryFilter(category)}
                    className={
                      categoryFilter === category
                        ? "bg-secondary text-secondary-foreground"
                        : ""
                    }
                  >
                    {category}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="border-border hover:bg-secondary/80"
                >
                  {sortDirection === "asc" ? (
                    <SortAsc className="mr-2 h-4 w-4 text-primary" />
                  ) : (
                    <SortDesc className="mr-2 h-4 w-4 text-primary" />
                  )}
                  Sort
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="border-border shadow-md"
              >
                <DropdownMenuItem
                  onClick={() => setSortBy("recent")}
                  className={
                    sortBy === "recent"
                      ? "bg-secondary text-secondary-foreground"
                      : ""
                  }
                >
                  Last Updated
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("alphabetical")}
                  className={
                    sortBy === "alphabetical"
                      ? "bg-secondary text-secondary-foreground"
                      : ""
                  }
                >
                  Alphabetical
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSortBy("category")}
                  className={
                    sortBy === "category"
                      ? "bg-secondary text-secondary-foreground"
                      : ""
                  }
                >
                  Category
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                  }
                >
                  {sortDirection === "asc" ? "Descending" : "Ascending"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Passwords List */}
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
                <p className="text-sm text-muted-foreground">
                  Loading passwords...
                </p>
              </div>
            </div>
          ) : filteredAndSortedPasswords.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="text-center">
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h2 className="font-semibold text-lg">No passwords found</h2>
                <p className="text-muted-foreground mt-1 max-w-sm">
                  {searchTerm || categoryFilter
                    ? "Try adjusting your search or filters"
                    : "Add your first password to get started"}
                </p>
                <Button
                  onClick={goToAddPassword}
                  className="mt-4 bg-primary hover:bg-primary/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Password
                </Button>
              </div>
            </div>
          ) : (
            <ScrollArea className="flex-1 h-[calc(100vh-180px)]">
              <div className="grid gap-4 pb-4">
                {filteredAndSortedPasswords.map((password: Password) => (
                  <Card
                    key={password.id}
                    className="relative overflow-hidden transition-all hover:shadow-card-hover border-border group card-hover-effect"
                    onClick={() => goToEditPassword(password.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-center">
                        <CardTitle className="text-base text-foreground group-hover:text-primary transition-colors">
                          {password.title}
                        </CardTitle>
                        <Badge
                          variant="secondary"
                          className="bg-secondary/70 hover:bg-secondary/90 text-secondary-foreground"
                        >
                          {password.category}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center mt-1 text-muted-foreground">
                        {password.website && (
                          <span className="truncate">{password.website}</span>
                        )}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="relative flex-1 max-w-[200px]">
                          <Input
                            readOnly
                            type={
                              password.id !== undefined &&
                              visiblePasswordIds.has(password.id)
                                ? "text"
                                : "password"
                            }
                            value={
                              decryptedPasswords[password.id] ||
                              password.password
                            }
                            className="pr-10 border-border focus:border-primary focus:ring-primary/30"
                            onClick={(e) => e.stopPropagation()}
                          />
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full text-muted-foreground hover:text-foreground"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePasswordVisibility(password.id);
                            }}
                          >
                            {password.id !== undefined &&
                            visiblePasswordIds.has(password.id) ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <div className="flex ml-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDecrypt(password.id);
                            }}
                            title="Decrypt password"
                            className="text-muted-foreground hover:text-accent hover:bg-secondary/80"
                          >
                            <Unlock className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              copyToClipboard(
                                decryptedPasswords[password.id] ||
                                  password.password
                              );
                            }}
                            title="Copy to clipboard"
                            className="text-muted-foreground hover:text-primary hover:bg-secondary/80"
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
                            title="Delete password"
                            className="text-muted-foreground hover:text-destructive hover:bg-secondary/80"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              goToEditPassword(password.id);
                            }}
                            title="Edit password"
                            className="text-muted-foreground hover:text-primary hover:bg-secondary/80"
                          >
                            <Edit2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          )}
        </main>
      </div>
    </div>
  );
}
