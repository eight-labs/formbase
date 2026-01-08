import { describe, expect, it } from 'vitest';

describe('File Upload Helper Functions', () => {
  describe('assignFileOrImage logic', () => {
    const assignFileOrImage = ({
      formData,
      key,
      fileUrl,
    }: {
      formData: Record<string, Blob | string | undefined>;
      key: string;
      fileUrl: string;
    }): void => {
      const isImage =
        formData[key] instanceof Blob &&
        (formData[key] as Blob).type.startsWith('image/');
      const field = isImage ? 'image' : 'file';
      formData[field] = fileUrl;

      if (key !== 'file' && key !== 'image') {
        formData[key] = undefined;
      }
    };

    it('assigns image URL to image field when blob is image type', () => {
      const imageBlob = new Blob(['fake-image'], { type: 'image/jpeg' });
      const formData: Record<string, Blob | string | undefined> = {
        profile_pic: imageBlob,
        name: 'Test User',
      };

      assignFileOrImage({
        formData,
        key: 'profile_pic',
        fileUrl: 'https://storage.local/image.jpg',
      });

      expect(formData.image).toBe('https://storage.local/image.jpg');
      expect(formData.profile_pic).toBeUndefined();
      expect(formData.name).toBe('Test User');
    });

    it('assigns file URL to file field when blob is not image type', () => {
      const pdfBlob = new Blob(['fake-pdf'], { type: 'application/pdf' });
      const formData: Record<string, Blob | string | undefined> = {
        document: pdfBlob,
        name: 'Test User',
      };

      assignFileOrImage({
        formData,
        key: 'document',
        fileUrl: 'https://storage.local/doc.pdf',
      });

      expect(formData.file).toBe('https://storage.local/doc.pdf');
      expect(formData.document).toBeUndefined();
    });

    it('keeps original key if key is already "file"', () => {
      const pdfBlob = new Blob(['fake-pdf'], { type: 'application/pdf' });
      const formData: Record<string, Blob | string | undefined> = {
        file: pdfBlob,
      };

      assignFileOrImage({
        formData,
        key: 'file',
        fileUrl: 'https://storage.local/doc.pdf',
      });

      expect(formData.file).toBe('https://storage.local/doc.pdf');
    });

    it('keeps original key if key is already "image"', () => {
      const imageBlob = new Blob(['fake-image'], { type: 'image/png' });
      const formData: Record<string, Blob | string | undefined> = {
        image: imageBlob,
      };

      assignFileOrImage({
        formData,
        key: 'image',
        fileUrl: 'https://storage.local/image.png',
      });

      expect(formData.image).toBe('https://storage.local/image.png');
    });

    it('handles multiple file fields', () => {
      const imageBlob = new Blob(['image'], { type: 'image/jpeg' });
      const pdfBlob = new Blob(['pdf'], { type: 'application/pdf' });
      const formData: Record<string, Blob | string | undefined> = {
        photo: imageBlob,
        resume: pdfBlob,
      };

      assignFileOrImage({
        formData,
        key: 'photo',
        fileUrl: 'https://storage.local/photo.jpg',
      });

      expect(formData.image).toBe('https://storage.local/photo.jpg');
      expect(formData.photo).toBeUndefined();
      expect(formData.resume).toEqual(pdfBlob);
    });
  });

  describe('File Type Detection', () => {
    it('correctly identifies image mime types', () => {
      const imageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

      imageTypes.forEach((type) => {
        expect(type.startsWith('image/')).toBe(true);
      });
    });

    it('correctly identifies non-image mime types', () => {
      const nonImageTypes = [
        'application/pdf',
        'text/plain',
        'application/json',
        'application/zip',
        'video/mp4',
        'audio/mpeg',
      ];

      nonImageTypes.forEach((type) => {
        expect(type.startsWith('image/')).toBe(false);
      });
    });
  });

  describe('File Extension Extraction', () => {
    const getExtension = (mimetype: string) => mimetype.split('/')[1];

    it('extracts extension from common mime types', () => {
      expect(getExtension('image/jpeg')).toBe('jpeg');
      expect(getExtension('image/png')).toBe('png');
      expect(getExtension('application/pdf')).toBe('pdf');
      expect(getExtension('text/plain')).toBe('plain');
    });

    it('handles complex mime type extensions', () => {
      expect(getExtension('image/svg+xml')).toBe('svg+xml');
      expect(getExtension('application/vnd.ms-excel')).toBe('vnd.ms-excel');
    });
  });

  describe('File Key Detection', () => {
    it('identifies file keys from form data', () => {
      const formData: Record<string, Blob | string | undefined> = {
        name: 'John',
        email: 'john@example.com',
        avatar: new Blob(['image'], { type: 'image/png' }),
        resume: new Blob(['pdf'], { type: 'application/pdf' }),
      };

      const fileKeys = Object.keys(formData).filter(
        (key) => formData[key] instanceof Blob,
      );

      expect(fileKeys).toEqual(['avatar', 'resume']);
    });

    it('returns empty array when no files', () => {
      const formData: Record<string, string> = {
        name: 'John',
        email: 'john@example.com',
      };

      const fileKeys = Object.keys(formData).filter(
        (key) => formData[key] instanceof Blob,
      );

      expect(fileKeys).toEqual([]);
    });
  });

  describe('Blob to Buffer Conversion', () => {
    it('can convert Blob to ArrayBuffer', async () => {
      const testContent = 'test-blob-content';
      const blob = new Blob([testContent], { type: 'text/plain' });

      const response = new Response(blob);
      const buffer = await response.arrayBuffer();

      expect(buffer.byteLength).toBe(testContent.length);
    });

    it('preserves content during conversion', async () => {
      const testContent = 'Hello World';
      const blob = new Blob([testContent], { type: 'text/plain' });

      const response = new Response(blob);
      const buffer = await response.arrayBuffer();
      const decoded = new TextDecoder().decode(buffer);

      expect(decoded).toBe(testContent);
    });

    it('handles binary content', async () => {
      const binaryData = new Uint8Array([0, 1, 2, 3, 255]);
      const blob = new Blob([binaryData], { type: 'application/octet-stream' });

      const response = new Response(blob);
      const buffer = await response.arrayBuffer();
      const result = new Uint8Array(buffer);

      expect(result).toEqual(binaryData);
    });
  });

  describe('File Name Generation', () => {
    const generateFilename = (id: string, mimetype: string) => {
      const extension = mimetype.split('/')[1];
      return `${id}.${extension}`;
    };

    it('generates filename with correct extension', () => {
      expect(generateFilename('abc123', 'image/jpeg')).toBe('abc123.jpeg');
      expect(generateFilename('def456', 'application/pdf')).toBe('def456.pdf');
    });

    it('handles various mime types', () => {
      expect(generateFilename('id', 'image/png')).toBe('id.png');
      expect(generateFilename('id', 'image/gif')).toBe('id.gif');
      expect(generateFilename('id', 'text/plain')).toBe('id.plain');
    });
  });
});
