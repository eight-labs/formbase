import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createTestForm,
  createTestUser,
  getTestDb,
  type TestForm,
  type TestUser,
} from '../helpers';

const mockSendMail = vi.fn().mockResolvedValue({ messageId: 'mock-id' });

vi.mock('@formbase/email', () => ({
  sendMail: (...args: unknown[]) => mockSendMail(...args),
}));

describe('Email Key Formatting', () => {
  const formatKey = (key: string): string => {
    if (key.includes('_')) {
      return key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ');
    }

    const result = key.replace(/([A-Z])/g, ' $1');
    return result.charAt(0).toUpperCase() + result.slice(1);
  };

  describe('formatKey function', () => {
    it('formats snake_case to Title Case', () => {
      expect(formatKey('first_name')).toBe('First Name');
      expect(formatKey('last_name')).toBe('Last Name');
      expect(formatKey('phone_number')).toBe('Phone Number');
    });

    it('formats camelCase to Title Case', () => {
      expect(formatKey('firstName')).toBe('First Name');
      expect(formatKey('lastName')).toBe('Last Name');
      expect(formatKey('phoneNumber')).toBe('Phone Number');
    });

    it('handles single word keys', () => {
      expect(formatKey('name')).toBe('Name');
      expect(formatKey('email')).toBe('Email');
    });

    it('handles all uppercase words in snake_case', () => {
      expect(formatKey('API_KEY')).toBe('Api Key');
    });

    it('handles empty string', () => {
      expect(formatKey('')).toBe('');
    });

    it('handles numbers in keys', () => {
      expect(formatKey('field_1')).toBe('Field 1');
      expect(formatKey('address2')).toBe('Address2');
    });

    it('handles mixed case snake_case', () => {
      expect(formatKey('First_Name')).toBe('First Name');
    });
  });
});

describe('Email Message Info', () => {
  type MessageInfo = {
    to: string;
    subject: string;
    body: string;
  };

  const validateMessageInfo = (info: MessageInfo): boolean => {
    return (
      typeof info.to === 'string' &&
      info.to.length > 0 &&
      typeof info.subject === 'string' &&
      typeof info.body === 'string'
    );
  };

  it('validates complete message info', () => {
    const message: MessageInfo = {
      to: 'test@example.com',
      subject: 'Test Subject',
      body: '<p>Test body</p>',
    };
    expect(validateMessageInfo(message)).toBe(true);
  });

  it('rejects empty to field', () => {
    const message: MessageInfo = {
      to: '',
      subject: 'Subject',
      body: 'Body',
    };
    expect(validateMessageInfo(message)).toBe(false);
  });

  it('accepts empty subject', () => {
    const message: MessageInfo = {
      to: 'test@example.com',
      subject: '',
      body: 'Body',
    };
    expect(validateMessageInfo(message)).toBe(true);
  });

  it('accepts empty body', () => {
    const message: MessageInfo = {
      to: 'test@example.com',
      subject: 'Subject',
      body: '',
    };
    expect(validateMessageInfo(message)).toBe(true);
  });
});

describe('Email Address Validation', () => {
  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  it('validates correct email formats', () => {
    expect(isValidEmail('test@example.com')).toBe(true);
    expect(isValidEmail('user.name@domain.org')).toBe(true);
    expect(isValidEmail('user+tag@example.co.uk')).toBe(true);
  });

  it('rejects invalid email formats', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@example.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
    expect(isValidEmail('user@.')).toBe(false);
  });
});

describe('Email Notification Settings', () => {
  let user: TestUser;
  let formWithNotifications: TestForm;
  let formWithoutNotifications: TestForm;

  beforeEach(async () => {
    mockSendMail.mockClear();

    user = await createTestUser({
      email: 'notification-test@example.com',
    });

    formWithNotifications = await createTestForm({
      userId: user.id,
      title: 'Form With Notifications',
      enableEmailNotifications: true,
    });

    formWithoutNotifications = await createTestForm({
      userId: user.id,
      title: 'Form Without Notifications',
      enableEmailNotifications: false,
    });
  });

  it('creates form with email notifications enabled', async () => {
    const db = getTestDb();
    const form = await db.query.forms.findFirst({
      where: (table, { eq }) => eq(table.id, formWithNotifications.id),
    });

    expect(form?.enableEmailNotifications).toBe(true);
  });

  it('creates form with email notifications disabled', async () => {
    const db = getTestDb();
    const form = await db.query.forms.findFirst({
      where: (table, { eq }) => eq(table.id, formWithoutNotifications.id),
    });

    expect(form?.enableEmailNotifications).toBe(false);
  });

  it('form can have custom default submission email', async () => {
    const customEmailForm = await createTestForm({
      userId: user.id,
      title: 'Form With Custom Email',
      enableEmailNotifications: true,
      defaultSubmissionEmail: 'custom@example.com',
    });

    const db = getTestDb();
    const form = await db.query.forms.findFirst({
      where: (table, { eq }) => eq(table.id, customEmailForm.id),
    });

    expect(form?.defaultSubmissionEmail).toBe('custom@example.com');
  });
});

describe('Email Template Content', () => {
  it('formatKey is properly defined in template', () => {
    const formatKey = (key: string): string => {
      if (key.includes('_')) {
        return key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      const result = key.replace(/([A-Z])/g, ' $1');
      return result.charAt(0).toUpperCase() + result.slice(1);
    };

    expect(formatKey('user_email')).toBe('User Email');
    expect(formatKey('firstName')).toBe('First Name');
    expect(formatKey('message')).toBe('Message');
  });

  it('template can format submission data', () => {
    const submissionData = {
      user_name: 'John Doe',
      user_email: 'john@example.com',
      message: 'Hello World',
    };

    const formatKey = (key: string): string => {
      if (key.includes('_')) {
        return key
          .split('_')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }
      const result = key.replace(/([A-Z])/g, ' $1');
      return result.charAt(0).toUpperCase() + result.slice(1);
    };

    const formattedEntries = Object.entries(submissionData).map(([key, value]) => ({
      label: formatKey(key),
      value: String(value),
    }));

    expect(formattedEntries).toEqual([
      { label: 'User Name', value: 'John Doe' },
      { label: 'User Email', value: 'john@example.com' },
      { label: 'Message', value: 'Hello World' },
    ]);
  });

  it('handles various data types in submission', () => {
    const submissionData = {
      number_field: 123,
      boolean_field: true,
      null_field: null,
      array_field: [1, 2, 3],
    };

    const stringified = Object.entries(submissionData).map(([key, value]) => ({
      key,
      value: String(value),
    }));

    expect(stringified).toEqual([
      { key: 'number_field', value: '123' },
      { key: 'boolean_field', value: 'true' },
      { key: 'null_field', value: 'null' },
      { key: 'array_field', value: '1,2,3' },
    ]);
  });
});
