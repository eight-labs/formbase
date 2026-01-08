async function loadDbDeps() {
  const [{ db, drizzlePrimitives }, schema] = await Promise.all([
    import('@formbase/db'),
    import('@formbase/db/schema'),
  ]);

  return {
    db,
    eq: drizzlePrimitives.eq,
    accounts: schema.accounts,
    forms: schema.forms,
    sessions: schema.sessions,
    users: schema.users,
  };
}

// Test user credentials (used in E2E tests)
export const E2E_TEST_USER = {
  email: 'e2e-test@formbase.dev',
  password: 'TestPassword123!',
  name: 'E2E Test User',
};

export async function seedE2EData() {
  console.log('🌱 Seeding E2E test data...');
  const { db, eq, forms, users } = await loadDbDeps();
  const { generateId } = await import('@formbase/utils/generate-id');
  const { auth } = await import('@formbase/auth');

  // Check if test user already exists
  const existingUser = await db.query.users.findFirst({
    where: (table) => eq(table.email, E2E_TEST_USER.email),
  });

  let userId: string;

  if (existingUser) {
    console.log('✅ E2E test user already exists');
    userId = existingUser.id;
  } else {
    // Use better-auth's signUp API to create user with properly hashed password
    const response = await auth.api.signUpEmail({
      body: {
        email: E2E_TEST_USER.email,
        password: E2E_TEST_USER.password,
        name: E2E_TEST_USER.name,
      },
    });

    if (!response.user) {
      throw new Error('Failed to create E2E test user');
    }

    userId = response.user.id;

    // Mark email as verified so user can log in immediately
    await db
      .update(users)
      .set({ emailVerified: true })
      .where(eq(users.id, userId));

    console.log('✅ Created E2E test user:', E2E_TEST_USER.email);
  }

  // Check if test form already exists
  const existingForm = await db.query.forms.findFirst({
    where: (table) => eq(table.userId, userId),
  });

  if (existingForm) {
    console.log('✅ E2E test form already exists');
    return { userId, formId: existingForm.id };
  }

  // Create a test form for the user
  const formId = generateId(15);
  await db.insert(forms).values({
    id: formId,
    userId: userId,
    title: 'E2E Test Form',
    description: 'A form created for E2E testing',
    enableSubmissions: true,
    enableEmailNotifications: false,
    keys: JSON.stringify(['']),
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  console.log('✅ Created E2E test form:', formId);

  return { userId, formId };
}

export async function cleanupE2EData() {
  console.log('🧹 Cleaning up E2E test data...');
  const { db, eq, accounts, forms, sessions, users } = await loadDbDeps();

  const testUser = await db.query.users.findFirst({
    where: (table) => eq(table.email, E2E_TEST_USER.email),
  });

  if (!testUser) {
    console.log('ℹ️ No E2E test data to clean up');
    return;
  }

  // Delete in order due to foreign key constraints
  await db.delete(sessions).where(eq(sessions.userId, testUser.id));
  await db.delete(forms).where(eq(forms.userId, testUser.id));
  await db.delete(accounts).where(eq(accounts.userId, testUser.id));
  await db.delete(users).where(eq(users.id, testUser.id));

  console.log('✅ Cleaned up E2E test data');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedE2EData()
    .then(() => {
      console.log('🎉 E2E seeding complete');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ E2E seeding failed:', error);
      process.exit(1);
    });
}
