/**
 * E2E Test Data Cleanup
 *
 * Removes all E2E test data from the database.
 * Run before seeding to ensure a clean state.
 */

import { cleanupE2EData } from './seed';

cleanupE2EData()
  .then(() => {
    console.log('🎉 E2E cleanup complete');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ E2E cleanup failed:', error);
    process.exit(1);
  });
