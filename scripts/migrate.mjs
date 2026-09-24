// Migration of existing draws to the current data format. Idempotent:
// already migrated draws are skipped, so the deploy workflow runs it on
// every deploy.
//
//   node scripts/migrate.mjs [service-account-key.json]            # dry run
//   node scripts/migrate.mjs [service-account-key.json] --apply    # write
//
// Without a key file it uses Application Default Credentials
// (GOOGLE_APPLICATION_CREDENTIALS, set by the deploy workflow). A key comes
// from Firebase console -> Project settings -> Service accounts ->
// Generate new private key. Never commit it.
import { readFileSync } from 'fs';
import { applicationDefault, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { migrateDraws, migrateLetters } from './migrateDraws.mjs';

const args = process.argv.slice(2);
const apply = args.includes('--apply');
const keyPath = args.find((arg) => !arg.startsWith('--'));

let projectId;
if (keyPath) {
  const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
  projectId = serviceAccount.project_id;
  initializeApp({ credential: cert(serviceAccount) });
} else {
  projectId = process.env.GOOGLE_CLOUD_PROJECT ?? process.env.GCLOUD_PROJECT;
  if (!projectId) {
    console.error(
      'Usage: node scripts/migrate.mjs [service-account-key.json] [--apply]\n' +
        'Without a key file, set GOOGLE_APPLICATION_CREDENTIALS and GOOGLE_CLOUD_PROJECT.',
    );
    process.exit(1);
  }
  initializeApp({ credential: applicationDefault(), projectId });
}

console.log(
  `Project ${projectId}: ${apply ? 'APPLYING migration' : 'dry run (add --apply to write)'}`,
);

await migrateDraws(getFirestore(), { apply });
await migrateLetters(getFirestore(), { apply });
