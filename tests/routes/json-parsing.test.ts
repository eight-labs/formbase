import type { TestForm, TestUser } from '../helpers';

import { beforeEach, describe, expect, it } from 'vitest';

import {
  createTestForm,
  createTestUser,
  createUnauthenticatedCaller,
  getTestDb,
} from '../helpers';

describe('JSON Parsing Edge Cases', () => {
  let user: TestUser;
  let testForm: TestForm;
  let publicCaller: Awaited<ReturnType<typeof createUnauthenticatedCaller>>;

  beforeEach(async () => {
    user = await createTestUser({
      email: 'jsontest@example.com',
    });
    testForm = await createTestForm({
      userId: user.id,
      title: 'JSON Edge Case Form',
      enableEmailNotifications: false,
    });
    publicCaller = await createUnauthenticatedCaller();
  });

  describe('Unicode field names', () => {
    it('handles Japanese characters in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          名前: 'テスト',
          メール: 'test@example.com',
        },
        keys: ['名前', 'メール'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['名前']).toBe('テスト');
      expect(data['メール']).toBe('test@example.com');
    });

    it('handles Cyrillic characters in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          Имя: 'Тест',
          Электронная_почта: 'test@example.com',
        },
        keys: ['Имя', 'Электронная_почта'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['Имя']).toBe('Тест');
    });

    it('handles emoji in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          '👤_name': 'John',
          '📧_email': 'john@example.com',
          '💬_message': 'Hello! 🎉',
        },
        keys: ['👤_name', '📧_email', '💬_message'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['👤_name']).toBe('John');
      expect(data['💬_message']).toBe('Hello! 🎉');
    });

    it('handles mixed Unicode scripts', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          name_名前_Имя: 'Mixed',
          العربية: 'Arabic',
          עברית: 'Hebrew',
        },
        keys: ['name_名前_Имя', 'العربية', 'עברית'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['name_名前_Имя']).toBe('Mixed');
    });
  });

  describe('Empty structures', () => {
    it('handles empty arrays', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          tags: [],
          items: [],
        },
        keys: ['tags', 'items'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.tags).toEqual([]);
      expect(data.items).toEqual([]);
    });

    it('handles empty objects', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          metadata: {},
          config: {},
        },
        keys: ['metadata', 'config'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.metadata).toEqual({});
      expect(data.config).toEqual({});
    });

    it('handles empty string values', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          name: '',
          description: '',
        },
        keys: ['name', 'description'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.name).toBe('');
      expect(data.description).toBe('');
    });
  });

  describe('Deeply nested structures', () => {
    it('handles 10 levels of nesting', async () => {
      const deeplyNested = {
        level1: {
          level2: {
            level3: {
              level4: {
                level5: {
                  level6: {
                    level7: {
                      level8: {
                        level9: {
                          level10: 'deep value',
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      };

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: deeplyNested,
        keys: ['level1'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(
        data.level1.level2.level3.level4.level5.level6.level7.level8.level9
          .level10,
      ).toBe('deep value');
    });

    it('handles nested arrays within objects', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          users: [
            {
              name: 'John',
              roles: ['admin', 'user'],
              permissions: {
                read: true,
                write: false,
                scopes: ['api', 'web'],
              },
            },
          ],
        },
        keys: ['users'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.users[0].roles).toEqual(['admin', 'user']);
      expect(data.users[0].permissions.scopes).toEqual(['api', 'web']);
    });
  });

  describe('Special characters in field names', () => {
    it('handles dots in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          'user.name': 'John',
          'config.setting.value': '123',
        },
        keys: ['user.name', 'config.setting.value'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['user.name']).toBe('John');
      expect(data['config.setting.value']).toBe('123');
    });

    it('handles brackets in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          'items[0]': 'first',
          'items[1]': 'second',
          'data[key]': 'value',
        },
        keys: ['items[0]', 'items[1]', 'data[key]'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['items[0]']).toBe('first');
      expect(data['items[1]']).toBe('second');
    });

    it('handles quotes in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          "field'with'single": 'value1',
          'field"with"double': 'value2',
        },
        keys: ["field'with'single", 'field"with"double'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data["field'with'single"]).toBe('value1');
      expect(data['field"with"double']).toBe('value2');
    });

    it('handles backslashes in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          'path\\to\\file': 'C:\\Users\\test',
          'escape\\n\\t': 'literal',
        },
        keys: ['path\\to\\file', 'escape\\n\\t'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['path\\to\\file']).toBe('C:\\Users\\test');
    });

    it('handles spaces and hyphens in field names', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          'first name': 'John',
          'last-name': 'Doe',
          '  leading-trailing  ': 'spaces',
        },
        keys: ['first name', 'last-name', '  leading-trailing  '],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data['first name']).toBe('John');
      expect(data['last-name']).toBe('Doe');
    });
  });

  describe('Special values', () => {
    it('handles null values', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          name: 'John',
          middleName: null,
          age: null,
        },
        keys: ['name', 'middleName', 'age'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.name).toBe('John');
      expect(data.middleName).toBeNull();
      expect(data.age).toBeNull();
    });

    it('handles boolean values', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          active: true,
          verified: false,
          settings: {
            notifications: true,
            darkMode: false,
          },
        },
        keys: ['active', 'verified', 'settings'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.active).toBe(true);
      expect(data.verified).toBe(false);
      expect(data.settings.notifications).toBe(true);
      expect(data.settings.darkMode).toBe(false);
    });

    it('handles numeric edge cases', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          zero: 0,
          negative: -42,
          float: 3.14159,
          largeNumber: 9007199254740991, // MAX_SAFE_INTEGER
          scientific: 1.5e10,
        },
        keys: ['zero', 'negative', 'float', 'largeNumber', 'scientific'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.zero).toBe(0);
      expect(data.negative).toBe(-42);
      expect(data.float).toBeCloseTo(3.14159);
      expect(data.largeNumber).toBe(9007199254740991);
    });
  });

  describe('Control characters and special strings', () => {
    it('handles newlines and tabs in values', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          multiline: 'Line 1\nLine 2\nLine 3',
          tabbed: 'Col1\tCol2\tCol3',
          mixed: 'Text\twith\ttabs\nand\nnewlines',
        },
        keys: ['multiline', 'tabbed', 'mixed'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.multiline).toContain('\n');
      expect(data.tabbed).toContain('\t');
    });

    it('handles carriage returns', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          windowsLines: 'Line 1\r\nLine 2\r\nLine 3',
          oldMac: 'Line 1\rLine 2',
        },
        keys: ['windowsLines', 'oldMac'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.windowsLines).toContain('\r\n');
    });

    it('handles very long strings', async () => {
      const longString = 'x'.repeat(10000);
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          longField: longString,
        },
        keys: ['longField'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.longField.length).toBe(10000);
    });
  });

  describe('Array variations', () => {
    it('handles arrays of mixed types', async () => {
      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          mixed: [1, 'two', true, null, { nested: 'object' }, [1, 2, 3]],
        },
        keys: ['mixed'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.mixed).toHaveLength(6);
      expect(data.mixed[0]).toBe(1);
      expect(data.mixed[1]).toBe('two');
      expect(data.mixed[2]).toBe(true);
      expect(data.mixed[3]).toBeNull();
      expect(data.mixed[4]).toEqual({ nested: 'object' });
      expect(data.mixed[5]).toEqual([1, 2, 3]);
    });

    it('handles large arrays', async () => {
      const largeArray = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        value: `item-${i}`,
      }));

      await publicCaller.formData.setFormData({
        formId: testForm.id,
        data: {
          items: largeArray,
        },
        keys: ['items'],
      });

      const db = getTestDb();
      const submissions = await db.query.formDatas.findMany({
        where: (table, { eq }) => eq(table.formId, testForm.id),
      });

      expect(submissions).toHaveLength(1);
      const data = JSON.parse(submissions[0]?.data ?? '{}');
      expect(data.items).toHaveLength(100);
      expect(data.items[99]).toEqual({ id: 99, value: 'item-99' });
    });
  });
});
