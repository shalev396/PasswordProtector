import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Eye,
  EyeOff,
  Plus,
  Search,
  Trash,
  Edit,
  Copy,
  KeyRound,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { calculatePasswordStrength } from "../lib/passwordGenerator";
import { usePasswords } from "../hooks/usePasswords";
import { RootState } from "../redux/store";

interface PasswordItem {
  id: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  visible?: boolean;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const { fetchPasswords, deletePassword: deletePasswordFromAPI } =
    usePasswords();
  const { isAuthenticated } = useSelector((state: RootState) => state.session);
  const { user } = useSelector((state: RootState) => state.user);
  const passwordsState = useSelector((state: RootState) => state.passwords);

  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState<PasswordItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [decryptedPasswords, setDecryptedPasswords] = useState<
    Record<string, string>
  >({});
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [sortBy, setSortBy] = useState<keyof PasswordItem>("updatedAt");

  useEffect(() => {
    // Check if user is logged in
    if (!isAuthenticated || !user) {
      navigate("/login");
      return;
    }

    const loadPasswords = async () => {
      try {
        setLoading(true);
        // Load passwords from API via the hook
        if (passwordsState.items.length === 0) {
          await fetchPasswords();
        }

        // Convert to the format expected by the component
        const formattedPasswords = passwordsState.items.map((item) => ({
          id: item.id,
          website: item.url || item.title, // Use url or title as website
          username: item.username,
          password: item.password,
          notes: item.category, // Map category to notes temporarily
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
          visible: false,
        }));

        setPasswords(formattedPasswords);
      } catch (error) {
        console.error("Failed to load passwords:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPasswords();
  }, [navigate, isAuthenticated, user, fetchPasswords, passwordsState.items]);

  // Filter passwords based on search term
  const filteredPasswords = passwords
    .filter(
      (password) =>
        password.website.toLowerCase().includes(searchTerm.toLowerCase()) ||
        password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (password.notes &&
          password.notes.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      const aValue = a[sortBy];
      const bValue = b[sortBy];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortOrder === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      return 0;
    });

  // Toggle password visibility
  const toggleVisibility = async (id: string) => {
    const password = passwords.find((p) => p.id === id);
    if (!password) return;

    try {
      // Only decrypt if becoming visible and not already decrypted
      if (!password.visible && !decryptedPasswords[id]) {
        // The password is already decrypted from the API
        setDecryptedPasswords((prev) => ({
          ...prev,
          [id]: password.password,
        }));
      }

      setPasswords(
        passwords.map((pw) =>
          pw.id === id ? { ...pw, visible: !pw.visible } : pw
        )
      );
    } catch (error) {
      console.error("Failed to decrypt password:", error);
      alert("Failed to decrypt password. Please try again.");
    }
  };

  // Delete password
  const deletePassword = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this password?")) {
      try {
        await deletePasswordFromAPI(id);

        // Update local state to reflect the deletion
        const updatedPasswords = passwords.filter((pw) => pw.id !== id);
        setPasswords(updatedPasswords);

        // Remove from decrypted cache
        const newDecrypted = { ...decryptedPasswords };
        delete newDecrypted[id];
        setDecryptedPasswords(newDecrypted);
      } catch (error) {
        console.error("Failed to delete password:", error);
        alert("Failed to delete password. Please try again.");
      }
    }
  };

  // Copy password to clipboard
  const copyPassword = async (id: string) => {
    try {
      // Use already decrypted password if available
      if (decryptedPasswords[id]) {
        await navigator.clipboard.writeText(decryptedPasswords[id]);
      } else {
        const passwordItem = passwords.find((pw) => pw.id === id);
        if (!passwordItem) return;

        // The password is already decrypted from the API
        const decryptedPassword = passwordItem.password;

        // Store decrypted password for future use
        setDecryptedPasswords((prev) => ({
          ...prev,
          [id]: decryptedPassword,
        }));

        await navigator.clipboard.writeText(decryptedPassword);
      }

      // Show toast notification (simplified)
      alert("Password copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy password:", error);
      alert("Failed to copy password");
    }
  };

  // Handle sorting
  const handleSort = (column: keyof PasswordItem) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };

  if (loading || passwordsState.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-xl font-medium">Loading your password vault...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold">Password Vault</h1>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search passwords..."
                className="border rounded-lg pl-10 pr-4 py-2 w-full dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            <Link
              to="/add"
              className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 flex items-center justify-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Password
            </Link>
            <Link
              to="/password-generator"
              className="bg-secondary hover:bg-secondary-dark text-secondary-foreground rounded-lg px-4 py-2 flex items-center justify-center"
            >
              <KeyRound className="h-4 w-4 mr-2" />
              Password Generator
            </Link>
          </div>
        </div>

        {filteredPasswords.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">
              {searchTerm
                ? "No passwords match your search"
                : "No passwords yet"}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm
                ? "Try a different search term"
                : "Add your first password to get started"}
            </p>
            {!searchTerm && (
              <Link
                to="/add"
                className="bg-primary hover:bg-primary-dark text-white rounded-lg px-4 py-2 inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Your First Password
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow mb-4 p-4 hidden md:block">
              <div className="grid grid-cols-12 gap-4 font-medium text-gray-600 dark:text-gray-300">
                <div
                  className="col-span-3 flex items-center cursor-pointer"
                  onClick={() => handleSort("website")}
                >
                  Website
                  {sortBy === "website" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
                <div
                  className="col-span-2 flex items-center cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  Username
                  {sortBy === "username" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
                <div className="col-span-4">Password</div>
                <div
                  className="col-span-2 flex items-center cursor-pointer"
                  onClick={() => handleSort("updatedAt")}
                >
                  Last Updated
                  {sortBy === "updatedAt" && (
                    <span className="ml-1">
                      {sortOrder === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
                <div className="col-span-1 text-right">Actions</div>
              </div>
            </div>

            <div className="grid gap-4">
              {filteredPasswords.map((item) => {
                const strength = calculatePasswordStrength(
                  decryptedPasswords[item.id] || ""
                );
                return (
                  <div
                    key={item.id}
                    className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 transition-all hover:shadow-md"
                  >
                    <div className="md:grid md:grid-cols-12 md:gap-4 flex flex-col">
                      <div className="col-span-3">
                        <h3 className="text-lg font-semibold md:hidden">
                          Website
                        </h3>
                        <p className="overflow-hidden text-ellipsis">
                          {item.website}
                        </p>
                      </div>
                      <div className="col-span-2">
                        <h3 className="text-lg font-semibold md:hidden mt-2">
                          Username
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 overflow-hidden text-ellipsis">
                          {item.username}
                        </p>
                      </div>
                      <div className="col-span-4">
                        <h3 className="text-lg font-semibold md:hidden mt-2">
                          Password
                        </h3>
                        <div className="flex items-center">
                          <div className="relative flex-grow">
                            <input
                              type={item.visible ? "text" : "password"}
                              value={
                                item.visible
                                  ? decryptedPasswords[item.id] || "••••••••"
                                  : "••••••••"
                              }
                              readOnly
                              className="border rounded w-full py-1 px-2 bg-gray-50 dark:bg-gray-700 dark:text-white"
                            />
                            <button
                              onClick={() => toggleVisibility(item.id)}
                              className="absolute right-2 top-1/2 transform -translate-y-1/2"
                              aria-label={
                                item.visible ? "Hide password" : "Show password"
                              }
                            >
                              {item.visible ? (
                                <EyeOff className="h-4 w-4 text-gray-500" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-500" />
                              )}
                            </button>
                          </div>
                          <button
                            onClick={() => copyPassword(item.id)}
                            className="ml-2 p-1 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                            aria-label="Copy password"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </div>
                        {item.visible && (
                          <div className="mt-2">
                            <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${
                                  strength <= 1
                                    ? "bg-red-500"
                                    : strength <= 3
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                                }`}
                                style={{ width: `${(strength / 5) * 100}%` }}
                              ></div>
                            </div>
                            <div className="text-xs mt-1 text-gray-500">
                              Password strength:{" "}
                              {strength <= 1
                                ? "Weak"
                                : strength <= 3
                                ? "Medium"
                                : "Strong"}
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="col-span-2">
                        <h3 className="text-lg font-semibold md:hidden mt-2">
                          Last Updated
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(item.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="col-span-1 md:text-right flex md:justify-end items-center mt-4 md:mt-0 gap-2">
                        <Link
                          to={`/edit/${item.id}`}
                          className="p-2 text-blue-500 hover:text-blue-700 dark:hover:text-blue-300"
                          aria-label="Edit password"
                        >
                          <Edit className="h-5 w-5" />
                        </Link>
                        <button
                          onClick={() => deletePassword(item.id)}
                          className="p-2 text-red-500 hover:text-red-700 dark:hover:text-red-300"
                          aria-label="Delete password"
                        >
                          <Trash className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                    {item.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <h3 className="text-sm font-medium">Notes</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.notes}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
