import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { usePasswords } from "@/hooks/usePasswords";
import { useAuth } from "@/hooks/useAuth";
import { Password } from "@/types";

export default function DashboardPage() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [visiblePasswordIds, setVisiblePasswordIds] = useState<Set<number>>(
    new Set()
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"recent" | "alphabetical" | "category">(
    "recent"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const navigate = useNavigate();
  const { passwords, deletePassword } = usePasswords();
  const { logout } = useAuth();

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

  // Handle delete password
  const handleDeletePassword = async (id: number | undefined) => {
    if (id === undefined) return;

    try {
      await deletePassword(id);
      toast.success("Password deleted successfully!");
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
          password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          password.website?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 border-b flex justify-between items-center bg-background">
        <div className="flex items-center">
          <Sheet open={showSidebar} onOpenChange={setShowSidebar}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] p-0">
              <div className="px-6 py-4 border-b">
                <h2 className="text-lg font-semibold">Password Protector</h2>
              </div>
              <ScrollArea className="h-[calc(100vh-60px)] p-6">
                <div className="flex flex-col space-y-1">
                  <Button onClick={goToAddPassword} className="justify-start">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Password
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="justify-start"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <h1 className="text-xl font-bold ml-2 md:ml-0">Your Passwords</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handleLogout}
            className="hidden md:flex"
          >
            <LogOut className="h-5 w-5" />
            <span className="sr-only">Logout</span>
          </Button>
          <Button onClick={goToAddPassword}>
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 overflow-auto">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search passwords..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    {categoryFilter || "All Categories"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setCategoryFilter(null)}>
                    All Categories
                  </DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem
                      key={category}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    {sortDirection === "asc" ? (
                      <SortAsc className="mr-2 h-4 w-4" />
                    ) : (
                      <SortDesc className="mr-2 h-4 w-4" />
                    )}
                    Sort
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={() => setSortBy("recent")}
                    className={sortBy === "recent" ? "bg-muted" : ""}
                  >
                    Last Updated
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("alphabetical")}
                    className={sortBy === "alphabetical" ? "bg-muted" : ""}
                  >
                    Alphabetical
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setSortBy("category")}
                    className={sortBy === "category" ? "bg-muted" : ""}
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
          </div>

          {/* Passwords List */}
          {filteredAndSortedPasswords.length === 0 ? (
            <div className="text-center py-12">
              <h2 className="text-xl font-medium mb-2">No passwords found</h2>
              <p className="text-muted-foreground mb-4">
                {searchTerm || categoryFilter
                  ? "Try adjusting your search or filters"
                  : "Add your first password to get started"}
              </p>
              <Button onClick={goToAddPassword}>
                <Plus className="mr-2 h-4 w-4" />
                Add Password
              </Button>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredAndSortedPasswords.map((password: Password) => (
                <Card
                  key={password.id}
                  className="cursor-pointer transition-shadow hover:shadow-md"
                  onClick={() => goToEditPassword(password.id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <div>
                        <CardTitle>{password.title}</CardTitle>
                        <CardDescription>
                          {password.username}
                          {password.website && ` • ${password.website}`}
                        </CardDescription>
                      </div>
                      {password.category && (
                        <Badge variant="outline">{password.category}</Badge>
                      )}
                    </div>
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
                          value={password.password}
                          className="pr-10"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-0 top-0 h-full"
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
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(password.password);
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={(e) => {
                            e.stopPropagation();
                            goToEditPassword(password.id);
                          }}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeletePassword(password.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
