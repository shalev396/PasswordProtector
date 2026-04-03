import { api } from '@/api/instance';
import type { ApiRequestConfig } from '@/types';
import type { ApiSuccessResponse } from '@api-types/api-contracts';
import type {
  PasswordListResponseData,
  PasswordResponseData,
  CreatePasswordRequestBody,
  UpdatePasswordRequestBody,
} from '@api-types/api-contracts';

export async function getPasswords(
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<PasswordListResponseData>> {
  const response = await api.get<ApiSuccessResponse<PasswordListResponseData>>(
    '/private/passwords',
    config,
  );
  return response.data;
}

export async function getPassword(
  id: string,
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<PasswordResponseData>> {
  const response = await api.get<ApiSuccessResponse<PasswordResponseData>>(
    `/private/passwords/${id}`,
    config,
  );
  return response.data;
}

export async function createPassword(
  body: CreatePasswordRequestBody,
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<PasswordResponseData>> {
  const response = await api.post<ApiSuccessResponse<PasswordResponseData>>(
    '/private/passwords',
    body,
    config,
  );
  return response.data;
}

export async function updatePassword(
  id: string,
  body: UpdatePasswordRequestBody,
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<PasswordResponseData>> {
  const response = await api.put<ApiSuccessResponse<PasswordResponseData>>(
    `/private/passwords/${id}`,
    body,
    config,
  );
  return response.data;
}

export async function deletePassword(
  id: string,
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<{ message: string }>> {
  const response = await api.delete<ApiSuccessResponse<{ message: string }>>(
    `/private/passwords/${id}`,
    config,
  );
  return response.data;
}
