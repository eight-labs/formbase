"use server";

import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/require-await
export const refreshDashboardAfterDeletion = async () => {
  revalidatePath("/dashboard");
};
