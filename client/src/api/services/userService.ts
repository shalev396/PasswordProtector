import axiosInstance, { api } from '@/api/instance';
import type { ApiRequestConfig } from '@/types';
import type {
  ApiSuccessResponse,
  MeResponseData,
  UpdateMeRequestBody,
  UpdateMeResponseData,
  DeleteUserResponseData,
} from '@api-types/api-contracts';

export async function getMe(
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<MeResponseData>> {
  const response = await api.get<ApiSuccessResponse<MeResponseData>>('/private/me', config);
  return response.data;
}

export async function updateMe(
  data: UpdateMeRequestBody,
  config?: ApiRequestConfig,
): Promise<ApiSuccessResponse<UpdateMeResponseData>> {
  const response = await api.put<ApiSuccessResponse<UpdateMeResponseData>>(
    '/private/me',
    data,
    config,
  );
  return response.data;
}

/** Response type returned by the export endpoint - allows future format changes */
const EXPORT_RESPONSE_TYPE = 'application/zip';

/**
 * Requests the user data export (ZIP). The API returns the binary file directly.
 * Uses X-Response-Type header to detect response format (future-proof).
 * Triggers a download in the browser and resolves when done.
 */
export async function exportMyData(config?: ApiRequestConfig): Promise<void> {
  const response = await axiosInstance.get<Blob>('/private/me/export', {
    ...config,
    responseType: 'blob',
    suppressErrorToast: true,
  });
  const headers = response.headers as { 'x-response-type'?: string; 'content-type'?: string };
  const xResponseType = headers['x-response-type'];
  const contentType: string | undefined = headers['content-type'];
  const contentTypeBase =
    typeof contentType === 'string' ? (contentType.split(';')[0]?.trim() ?? undefined) : undefined;
  const responseType = xResponseType ?? contentTypeBase;
  if (
    responseType !== EXPORT_RESPONSE_TYPE &&
    (typeof responseType !== 'string' || !responseType.includes('zip'))
  ) {
    throw new Error(`Unexpected export response type: ${responseType ?? 'unknown'}`);
  }
  const blob = response.data;
  const contentDisposition = (response.headers as { 'content-disposition'?: string })[
    'content-disposition'
  ];
  const filenameMatch = contentDisposition?.match(/filename="?([^";\n]+)"?/);
  const filename = filenameMatch?.[1] ?? `user-export-${Date.now()}.zip`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 1000);
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
