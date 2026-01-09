import { apiKeys, formDatas, forms } from '@formbase/db/schema';
import { generateId } from '@formbase/utils/generate-id';
import { generateApiKey, hashApiKey } from '@formbase/api/lib/api-key';

import { getTestDb } from './db';

export interface TestForm {
  id: string;
  userId: string;
  title: string;
  description: string | null;
}

export interface TestFormData {
  id: string;
  formId: string;
  data: Record<string, unknown>;
}

export async function createTestForm(options: {
  userId: string;
  title?: string;
  description?: string;
  enableSubmissions?: boolean;
  enableEmailNotifications?: boolean;
  returnUrl?: string;
  keys?: string[];
}): Promise<TestForm> {
  const db = getTestDb();
  const formId = generateId(15);
  const title = options.title ?? 'Test Form';
  const description = options.description ?? null;

  db.insert(forms)
    .values({
      id: formId,
      userId: options.userId,
      title,
      description,
      keys: JSON.stringify(options.keys ?? ['']),
      enableSubmissions: options.enableSubmissions ?? true,
      enableEmailNotifications: options.enableEmailNotifications ?? false,
      returnUrl: options.returnUrl ?? null,
      updatedAt: new Date(),
    })
    .run();

  return {
    id: formId,
    userId: options.userId,
    title,
    description,
  };
}

export async function createTestFormData(options: {
  formId: string;
  data?: Record<string, unknown>;
}): Promise<TestFormData> {
  const db = getTestDb();
  const id = generateId(15);
  const data = options.data ?? { name: 'Test', email: 'test@example.com' };

  db.insert(formDatas)
    .values({
      id,
      formId: options.formId,
      data: JSON.stringify(data),
    })
    .run();

  return {
    id,
    formId: options.formId,
    data,
  };
}

export interface TestApiKey {
  id: string;
  userId: string;
  name: string;
  key: string;
  keyPrefix: string;
  expiresAt: Date | null;
}

export async function createTestApiKey(options: {
  userId: string;
  name?: string;
  expiresAt?: Date | null;
}): Promise<TestApiKey> {
  const db = getTestDb();
  const id = generateId(15);
  const name = options.name ?? 'Test API Key';
  const { key, prefix, hash } = generateApiKey();

  db.insert(apiKeys)
    .values({
      id,
      userId: options.userId,
      name,
      keyHash: hash,
      keyPrefix: prefix,
      expiresAt: options.expiresAt ?? null,
    })
    .run();

  return {
    id,
    userId: options.userId,
    name,
    key,
    keyPrefix: prefix,
    expiresAt: options.expiresAt ?? null,
  };
}

export async function createExpiredApiKey(options: {
  userId: string;
  name?: string;
}): Promise<TestApiKey> {
  const expiredDate = new Date(Date.now() - 1000 * 60 * 60);
  return createTestApiKey({
    userId: options.userId,
    name: options.name ?? 'Expired API Key',
    expiresAt: expiredDate,
  });
}
