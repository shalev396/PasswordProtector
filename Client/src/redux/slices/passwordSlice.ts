import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Password, PasswordState } from "../../types";

const initialState: PasswordState = {
  passwords: [],
  filteredPasswords: [],
  isLoading: false,
  error: null,
  searchTerm: "",
  selectedCategory: "All",
  sortOption: "newest",
  currentPassword: null,
};

const passwordSlice = createSlice({
  name: "passwords",
  initialState,
  reducers: {
    setPasswordsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setPasswordsError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      if (action.payload) {
        console.error(`Password error set: ${action.payload}`);
      } else {
      }
    },
    setPasswords: (state, action: PayloadAction<Password[]>) => {
      state.passwords = action.payload;

      state.filteredPasswords = filterAndSortPasswords(
        action.payload,
        state.searchTerm,
        state.selectedCategory,
        state.sortOption
      );
      // Clear any previous errors when successfully setting passwords
      state.error = null;
    },
    addPasswordToStore: (state, action: PayloadAction<Password>) => {
      state.passwords = [...state.passwords, action.payload];
      state.filteredPasswords = filterAndSortPasswords(
        state.passwords,
        state.searchTerm,
        state.selectedCategory,
        state.sortOption
      );
      // Clear any previous errors
      state.error = null;
    },
    updatePasswordInStore: (state, action: PayloadAction<Password>) => {
      const index = state.passwords.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.passwords[index] = action.payload;
      } else {
        // Log if we're trying to update a non-existent password
        console.warn(
          `Tried to update non-existent password with ID: ${action.payload.id}`
        );
      }
      state.filteredPasswords = filterAndSortPasswords(
        state.passwords,
        state.searchTerm,
        state.selectedCategory,
        state.sortOption
      );
      // Clear any previous errors
      state.error = null;
    },
    removePasswordFromStore: (state, action: PayloadAction<number>) => {
      state.passwords = state.passwords.filter((p) => p.id !== action.payload);
      state.filteredPasswords = filterAndSortPasswords(
        state.passwords,
        state.searchTerm,
        state.selectedCategory,
        state.sortOption
      );
      // Clear any previous errors
      state.error = null;
    },
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;

      state.filteredPasswords = filterAndSortPasswords(
        state.passwords,
        action.payload,
        state.selectedCategory,
        state.sortOption
      );
    },
    setSelectedCategory: (state, action: PayloadAction<string>) => {
      state.selectedCategory = action.payload;

      state.filteredPasswords = filterAndSortPasswords(
        state.passwords,
        state.searchTerm,
        action.payload,
        state.sortOption
      );
    },
    setSortOption: (
      state,
      action: PayloadAction<"newest" | "oldest" | "alphabetical">
    ) => {
      state.sortOption = action.payload;

      state.filteredPasswords = filterAndSortPasswords(
        state.passwords,
        state.searchTerm,
        state.selectedCategory,
        action.payload
      );
    },
    clearPasswords: (state) => {
      state.passwords = [];
      state.filteredPasswords = [];
      state.searchTerm = "";
      state.selectedCategory = "All";
      state.sortOption = "newest";
    },
    setCurrentPassword: (state, action: PayloadAction<Password | null>) => {
      state.currentPassword = action.payload;
      // Clear any previous errors
      state.error = null;
    },
  },
});

// Helper function to filter and sort passwords
const filterAndSortPasswords = (
  passwords: Password[],
  searchTerm: string,
  category: string,
  sortOption: string
): Password[] => {
  // First filter by category if not "All"
  let filtered =
    category === "All"
      ? [...passwords]
      : passwords.filter((p) => p.category === category);

  // Then filter by search term
  if (searchTerm) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.username.toLowerCase().includes(term) ||
        p.website.toLowerCase().includes(term)
    );
  }

  // Finally sort according to sort option
  return filtered.sort((a, b) => {
    if (sortOption === "newest") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === "oldest") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === "alphabetical") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });
};

export const {
  setPasswordsLoading,
  setPasswordsError,
  setPasswords,
  addPasswordToStore,
  updatePasswordInStore,
  removePasswordFromStore,
  setSearchTerm,
  setSelectedCategory,
  setSortOption,
  clearPasswords,
  setCurrentPassword,
} = passwordSlice.actions;

// For backward compatibility with code that might still use the old names
export const setLoading = setPasswordsLoading;
export const setError = setPasswordsError;
export const addPassword = addPasswordToStore;
export const updatePassword = updatePasswordInStore;
export const deletePassword = removePasswordFromStore;

export default passwordSlice.reducer;
