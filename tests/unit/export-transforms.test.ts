import { describe, expect, it } from 'vitest';

import { type FormData } from '@formbase/db/schema';

type SubmissionData = Pick<FormData, 'data'>;

const createCSVContent = (
  submissions: SubmissionData[],
  formKeys: string[],
): string => {
  let csvContent = 'data:text/csv;charset=utf-8,';
  const header = formKeys.join(',') + '\n';
  csvContent += header;

  submissions.forEach((submission) => {
    if (submission.data && typeof submission.data === 'object') {
      const row = formKeys
        .map((key) => (submission.data as Record<string, unknown>)[key] ?? '')
        .join(',');
      csvContent += row + '\n';
    }
  });

  return csvContent;
};

const createJSONContent = (submissions: SubmissionData[]): string => {
  const jsonContent = JSON.stringify(
    submissions.map((submission) =>
      submission.data && typeof submission.data === 'object'
        ? submission.data
        : {},
    ),
    null,
    2,
  );

  return `data:application/json;charset=utf-8,${jsonContent}`;
};

describe('Export Transforms', () => {
  describe('createCSVContent', () => {
    it('creates valid CSV with headers', () => {
      const submissions: SubmissionData[] = [
        { data: { name: 'John', email: 'john@example.com' } },
      ];
      const keys = ['name', 'email'];

      const csv = createCSVContent(submissions, keys);

      expect(csv).toContain('data:text/csv;charset=utf-8,');
      expect(csv).toContain('name,email');
      expect(csv).toContain('John,john@example.com');
    });

    it('handles empty submissions array', () => {
      const csv = createCSVContent([], ['name', 'email']);

      expect(csv).toContain('data:text/csv;charset=utf-8,');
      expect(csv).toContain('name,email');
      expect(csv.split('\n').filter((l) => l.trim()).length).toBe(1);
    });

    it('handles single submission', () => {
      const submissions: SubmissionData[] = [
        { data: { field: 'value' } },
      ];

      const csv = createCSVContent(submissions, ['field']);

      expect(csv).toContain('field');
      expect(csv).toContain('value');
    });

    it('handles multiple submissions', () => {
      const submissions: SubmissionData[] = [
        { data: { name: 'Alice' } },
        { data: { name: 'Bob' } },
        { data: { name: 'Charlie' } },
      ];

      const csv = createCSVContent(submissions, ['name']);

      expect(csv).toContain('Alice');
      expect(csv).toContain('Bob');
      expect(csv).toContain('Charlie');
    });

    it('handles missing values with empty cells', () => {
      const submissions: SubmissionData[] = [
        { data: { name: 'John' } },
        { data: { email: 'jane@example.com' } },
      ];

      const csv = createCSVContent(submissions, ['name', 'email']);
      const lines = csv.split('\n');

      expect(lines[1]).toContain('John,');
      expect(lines[2]).toContain(',jane@example.com');
    });

    it('handles many columns', () => {
      const data: Record<string, string> = {};
      const keys: string[] = [];
      for (let i = 0; i < 20; i++) {
        data[`col_${i}`] = `value_${i}`;
        keys.push(`col_${i}`);
      }

      const submissions: SubmissionData[] = [{ data }];
      const csv = createCSVContent(submissions, keys);

      expect(csv).toContain('col_0,col_1,col_2');
      expect(csv).toContain('value_0,value_1,value_2');
    });

    it('preserves order of keys', () => {
      const submissions: SubmissionData[] = [
        { data: { z: '3', a: '1', m: '2' } },
      ];
      const keys = ['a', 'm', 'z'];

      const csv = createCSVContent(submissions, keys);
      const lines = csv.split('\n');

      expect(lines[0]).toContain('a,m,z');
      expect(lines[1]).toContain('1,2,3');
    });

    it('handles null data gracefully', () => {
      const submissions: SubmissionData[] = [
        { data: null as unknown as Record<string, unknown> },
      ];

      const csv = createCSVContent(submissions, ['name']);

      expect(csv).toContain('name');
    });

    it('handles numeric values', () => {
      const submissions: SubmissionData[] = [
        { data: { count: 42, price: 19.99 } },
      ];

      const csv = createCSVContent(submissions, ['count', 'price']);

      expect(csv).toContain('42');
      expect(csv).toContain('19.99');
    });

    it('handles boolean values', () => {
      const submissions: SubmissionData[] = [
        { data: { active: true, verified: false } },
      ];

      const csv = createCSVContent(submissions, ['active', 'verified']);

      expect(csv).toContain('true');
      expect(csv).toContain('false');
    });

    it('handles nested objects by stringifying', () => {
      const submissions: SubmissionData[] = [
        {
          data: {
            name: 'John',
            address: { city: 'NYC', zip: '10001' },
          },
        },
      ];

      const csv = createCSVContent(submissions, ['name', 'address']);

      expect(csv).toContain('John');
      expect(csv).toContain('address');
    });

    it('handles array values', () => {
      const submissions: SubmissionData[] = [
        { data: { tags: ['a', 'b', 'c'] } },
      ];

      const csv = createCSVContent(submissions, ['tags']);

      expect(csv).toContain('tags');
    });
  });

  describe('createJSONContent', () => {
    it('creates valid JSON array', () => {
      const submissions: SubmissionData[] = [
        { data: { name: 'John' } },
      ];

      const json = createJSONContent(submissions);

      expect(json).toContain('data:application/json;charset=utf-8,');
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);
      expect(Array.isArray(parsed)).toBe(true);
      expect(parsed[0].name).toBe('John');
    });

    it('handles empty submissions array', () => {
      const json = createJSONContent([]);

      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);
      expect(parsed).toEqual([]);
    });

    it('preserves nested objects', () => {
      const submissions: SubmissionData[] = [
        {
          data: {
            user: {
              name: 'John',
              address: {
                city: 'NYC',
              },
            },
          },
        },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed[0].user.name).toBe('John');
      expect(parsed[0].user.address.city).toBe('NYC');
    });

    it('preserves arrays', () => {
      const submissions: SubmissionData[] = [
        { data: { tags: ['a', 'b', 'c'], numbers: [1, 2, 3] } },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed[0].tags).toEqual(['a', 'b', 'c']);
      expect(parsed[0].numbers).toEqual([1, 2, 3]);
    });

    it('handles multiple submissions', () => {
      const submissions: SubmissionData[] = [
        { data: { id: 1 } },
        { data: { id: 2 } },
        { data: { id: 3 } },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed).toHaveLength(3);
      expect(parsed[0].id).toBe(1);
      expect(parsed[2].id).toBe(3);
    });

    it('handles unicode characters', () => {
      const submissions: SubmissionData[] = [
        { data: { name: 'テスト', emoji: '👋' } },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed[0].name).toBe('テスト');
      expect(parsed[0].emoji).toBe('👋');
    });

    it('handles null and undefined values', () => {
      const submissions: SubmissionData[] = [
        { data: { present: 'yes', missing: null, undef: undefined } },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed[0].present).toBe('yes');
      expect(parsed[0].missing).toBeNull();
      expect(parsed[0].undef).toBeUndefined();
    });

    it('handles special characters', () => {
      const submissions: SubmissionData[] = [
        { data: { quote: 'He said "hello"', newline: 'Line1\nLine2' } },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed[0].quote).toBe('He said "hello"');
      expect(parsed[0].newline).toBe('Line1\nLine2');
    });

    it('returns empty object for invalid data', () => {
      const submissions: SubmissionData[] = [
        { data: null as unknown as Record<string, unknown> },
        { data: 'string' as unknown as Record<string, unknown> },
      ];

      const json = createJSONContent(submissions);
      const content = json.replace('data:application/json;charset=utf-8,', '');
      const parsed = JSON.parse(content);

      expect(parsed[0]).toEqual({});
      expect(parsed[1]).toEqual({});
    });

    it('pretty prints with indentation', () => {
      const submissions: SubmissionData[] = [
        { data: { name: 'John' } },
      ];

      const json = createJSONContent(submissions);

      expect(json).toContain('\n');
      expect(json).toContain('  ');
    });
  });

  describe('Filename Sanitization', () => {
    const sanitizeFilename = (title: string): string => {
      return title
        .replace(/[<>:"/\\|?*]/g, '_')
        .replace(/\s+/g, '_')
        .substring(0, 50);
    };

    it('removes special characters', () => {
      expect(sanitizeFilename('Test<Form>')).toBe('Test_Form_');
      expect(sanitizeFilename('Path/To\\File')).toBe('Path_To_File');
      expect(sanitizeFilename('What?Why!')).toBe('What_Why!');
    });

    it('replaces spaces with underscores', () => {
      expect(sanitizeFilename('My Form Name')).toBe('My_Form_Name');
      expect(sanitizeFilename('  Multiple   Spaces  ')).toBe('_Multiple_Spaces_');
    });

    it('truncates long titles', () => {
      const longTitle = 'A'.repeat(100);
      const sanitized = sanitizeFilename(longTitle);
      expect(sanitized.length).toBeLessThanOrEqual(50);
    });

    it('handles unicode characters', () => {
      expect(sanitizeFilename('フォーム')).toBe('フォーム');
      expect(sanitizeFilename('Формуляр')).toBe('Формуляр');
    });

    it('handles empty string', () => {
      expect(sanitizeFilename('')).toBe('');
    });
  });
});
