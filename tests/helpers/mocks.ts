import { vi } from 'vitest';

export const mockUploadedFileUrl = 'https://mock-storage.local/test-bucket/mock-file.jpg';

export const mockMinioClient = {
  bucketExists: vi.fn().mockResolvedValue(true),
  makeBucket: vi.fn().mockResolvedValue(undefined),
  putObject: vi.fn().mockResolvedValue(undefined),
  presignedUrl: vi.fn().mockResolvedValue(mockUploadedFileUrl),
  getObject: vi.fn().mockResolvedValue(Buffer.from('mock-file-content')),
  removeObject: vi.fn().mockResolvedValue(undefined),
};

export const setupMinioMock = () => {
  vi.mock('minio', () => ({
    Client: vi.fn().mockImplementation(() => mockMinioClient),
  }));
};

export const resetMinioMock = () => {
  mockMinioClient.bucketExists.mockClear();
  mockMinioClient.makeBucket.mockClear();
  mockMinioClient.putObject.mockClear();
  mockMinioClient.presignedUrl.mockClear();
  mockMinioClient.getObject.mockClear();
  mockMinioClient.removeObject.mockClear();
};

export const mockEmailSent: Array<{ to: string; subject: string; body: string }> = [];

export const mockSendMail = vi.fn().mockImplementation(async (info) => {
  mockEmailSent.push(info);
  return { messageId: `mock-${Date.now()}` };
});

export const setupEmailMock = () => {
  vi.mock('@formbase/email', () => ({
    sendMail: mockSendMail,
  }));
};

export const resetEmailMock = () => {
  mockSendMail.mockClear();
  mockEmailSent.length = 0;
};

export const getLastSentEmail = () => {
  return mockEmailSent[mockEmailSent.length - 1];
};

export const resetAllMocks = () => {
  resetMinioMock();
  resetEmailMock();
};
