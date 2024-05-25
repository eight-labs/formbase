'use server';

import { revalidatePath } from 'next/cache';

export const refreshDashboardAfterDeletion = () => {
  revalidatePath('/dashboard');
};
