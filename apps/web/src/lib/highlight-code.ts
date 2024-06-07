'use server';

import type { ThemeInput } from 'shiki';

import { getHighlighter } from 'shiki';

import { blackoutTheme } from './themes/dark';

export async function highlightCode(code: string) {
  const highlighter = await getHighlighter({
    langs: ['typescript', 'html'],
    themes: [],
  });

  await highlighter.loadTheme(blackoutTheme as unknown as ThemeInput);

  return highlighter.codeToHtml(code, {
    lang: 'html',
    theme: 'Lambda Studio — Blackout',
    transformers: [
      {
        pre(node) {
          this.addClassToHast(
            node,
            'flex items-center p-5 rounded-lg border w-[700px]',
          );
        },
      },
    ],
  });
}
