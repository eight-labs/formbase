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
