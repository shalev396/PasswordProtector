import { UserState } from "../redux/slices/userSlice";
import { AccessTokenState } from "../redux/slices/accessTokenSlice";
import { RefreshTokenState, SessionState, PasswordState } from "../types";

// Root state type combining all slices
export interface RootState {
  user: UserState;
  accessToken: AccessTokenState;
  refreshToken: RefreshTokenState;
  session: SessionState;
  passwords: PasswordState;
}

// Type for dispatch function from store
export type AppDispatch = (action: any) => any;
