import { formDatas, forms } from '@formbase/db/schema';
import { generateId } from '@formbase/utils/generate-id';

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
