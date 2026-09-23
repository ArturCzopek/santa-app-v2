// One-off migration of existing draws to the current data format.
//
//   node scripts/migrate.mjs <service-account-key.json>           # dry run
//   node scripts/migrate.mjs <service-account-key.json> --apply   # write
//
// The key comes from Firebase console -> Project settings -> Service
// accounts -> Generate new private key. Never commit it.
import { readFileSync } from 'fs';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { migrateDraws } from './migrateDraws.mjs';

const [keyPath, flag] = process.argv.slice(2);

if (!keyPath) {
  console.error('Usage: node scripts/migrate.mjs <service-account-key.json> [--apply]');
  process.exit(1);
}

const serviceAccount = JSON.parse(readFileSync(keyPath, 'utf8'));
initializeApp({ credential: cert(serviceAccount) });

const apply = flag === '--apply';
console.log(
  `Project ${serviceAccount.project_id}: ${apply ? 'APPLYING migration' : 'dry run (add --apply to write)'}`,
);

await migrateDraws(getFirestore(), { apply });
