import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import {
  fetchPasswords,
  createPassword,
  updatePassword,
  deletePassword,
} from "@/redux/thunks/passwordThunks";
import { AppDispatch } from "@/redux/store";
import { Password } from "@/redux/slices/passwordSlice";

export const usePasswords = () => {
  const dispatch = useDispatch<AppDispatch>();
  const passwords = useSelector((state: RootState) => state.passwords.items);
  const isLoading = useSelector(
    (state: RootState) => state.passwords.isLoading
  );
  const error = useSelector((state: RootState) => state.passwords.error);

  const loadPasswords = useCallback(() => {
    return dispatch(fetchPasswords());
  }, [dispatch]);

  const addPassword = useCallback(
    (passwordData: Omit<Password, "id">) => {
      return dispatch(createPassword(passwordData));
    },
    [dispatch]
  );

  const editPassword = useCallback(
    (id: string, passwordData: Partial<Password>) => {
      return dispatch(updatePassword({ id, passwordData }));
    },
    [dispatch]
  );

  const removePassword = useCallback(
    (id: string) => {
      return dispatch(deletePassword(id));
    },
    [dispatch]
  );

  return {
    passwords,
    isLoading,
    error,
    loadPasswords,
    addPassword,
    editPassword,
    removePassword,
  };
};
