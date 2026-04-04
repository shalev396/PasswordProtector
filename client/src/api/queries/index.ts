import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMe, updateMe, exportMyData, deleteAccount } from '@/api/services/userService';
import {
  getPasswords,
  getPassword,
  createPassword,
  updatePassword,
  deletePassword,
} from '@/api/services/passwordService';
import type {
  CreatePasswordRequestBody,
  UpdatePasswordRequestBody,
  UpdateMeRequestBody,
} from '@api-types/api-contracts';

export const queryKeys = {
  me: ['me'] as const,
};

export function useMe() {
  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const response = await getMe();
      return response.data;
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMeRequestBody) => {
      const response = await updateMe(data);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.me });
    },
  });
}

export function useExportMyData() {
  return useMutation({
    mutationFn: async () => {
      await exportMyData();
    },
  });
}

export function useDeleteAccount() {
  return useMutation({
    mutationFn: async () => {
      const response = await deleteAccount();
      return response.data;
    },
  });
}

// ---------------------------------------------------------------------------
// Password queries
// ---------------------------------------------------------------------------

export const passwordQueryKeys = {
  all: ['passwords'] as const,
  detail: (id: string) => ['passwords', id] as const,
};

export function usePasswords() {
  return useQuery({
    queryKey: passwordQueryKeys.all,
    queryFn: async () => {
      const response = await getPasswords();
      return response.data;
    },
  });
}

export function usePassword(id: string) {
  return useQuery({
    queryKey: passwordQueryKeys.detail(id),
    queryFn: async () => {
      const response = await getPassword(id);
      return response.data;
    },
    enabled: id !== '',
  });
}

export function useCreatePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreatePasswordRequestBody) => {
      const response = await createPassword(body);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: passwordQueryKeys.all });
    },
  });
}

export function useUpdatePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, body }: { id: string; body: UpdatePasswordRequestBody }) => {
      const response = await updatePassword(id, body);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: passwordQueryKeys.all });
    },
  });
}

export function useDeletePassword() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deletePassword(id);
      return response.data;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: passwordQueryKeys.all });
    },
  });
}
