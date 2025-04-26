import { QueryClient } from "@tanstack/react-query";

/**
 * Centralized query keys for the application
 * Using this as a single source of truth ensures consistency across the app
 */
export const queryKeys = {
  // Password related keys
  passwords: {
    all: () => ["passwords"] as const,
    lists: () => [...queryKeys.passwords.all(), "list"] as const,
    list: (filters: any) =>
      [...queryKeys.passwords.lists(), { filters }] as const,
    details: () => [...queryKeys.passwords.all(), "detail"] as const,
    detail: (id: number) => [...queryKeys.passwords.details(), id] as const,
  },
  // User related keys
  users: {
    all: () => ["users"] as const,
    me: () => [...queryKeys.users.all(), "me"] as const,
  },
  // Auth related keys
  auth: {
    token: () => ["auth", "token"] as const,
  },
};

/**
 * Single QueryClient instance for the entire application
 * All components should use this instance via the useQueryClient hook
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      // Optional default options for mutations
      retry: 0, // Don't retry mutations by default
    },
  },
});

/**
 * Helper function to reset the query cache
 * Useful for logging out or when you need to clear all queries
 */
export const clearQueryCache = () => {
  return queryClient.clear();
};
