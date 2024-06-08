'use server';

import { revalidatePath } from 'next/cache';

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateDashboard = async () => {
  revalidatePath('/dashboard');
};

// eslint-disable-next-line @typescript-eslint/require-await
export const revalidateFromClient = async (route: string) => {
  revalidatePath(route);
};
