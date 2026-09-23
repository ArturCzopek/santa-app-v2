import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  initializeTestEnvironment,
  RulesTestEnvironment,
} from '@firebase/rules-unit-testing';

export const PROJECT_ID = 'demo-santa-app';

export const createTestEnv = (): Promise<RulesTestEnvironment> =>
  initializeTestEnvironment({
    projectId: PROJECT_ID,
    firestore: {
      rules: readFileSync(resolve(__dirname, '../../firestore.rules'), 'utf8'),
      host: '127.0.0.1',
      port: 8080,
    },
  });

export const OWNER = 'owner-uid';
export const ALICE = 'alice-uid';
export const BOB = 'bob-uid';
export const MALLORY = 'mallory-uid';

export const authed = (env: RulesTestEnvironment, uid: string) =>
  env
    .authenticatedContext(uid, { name: `${uid} name`, picture: '' })
    .firestore();
