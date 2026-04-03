import { api } from '@/api/instance';
import type { ApiRequestConfig } from '@/types';
import type {
  ApiSuccessResponse,
  MeResponseData,
  DeleteUserResponseData,
} from '@api-types/api-contracts';

export async function getMe(
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<MeResponseData>> {
  const response = await api.get<ApiSuccessResponse<MeResponseData>>('/private/me', config);
  return response.data;
}

export async function deleteAccount(
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<DeleteUserResponseData>> {
  const response = await api.delete<ApiSuccessResponse<DeleteUserResponseData>>(
    '/private/delete',
    config,
  );
  return response.data;
}
