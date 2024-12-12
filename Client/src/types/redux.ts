import { UserState } from "../redux/slices/userSlice";
import { TokenState } from "../redux/slices/tokenSlice";

// Define SessionState from the reducer
interface SessionState {
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Root state type combining all slices
export interface RootState {
  user: UserState;
  token: TokenState;
  session: SessionState;
  passwords: {
    items: any[];
    isLoading: boolean;
    error: string | null;
  };
  // Add other state slices here as needed
}

// Type for dispatch function from store
export type AppDispatch = (action: any) => any;
