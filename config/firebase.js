

import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
let firebaseConfig;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // ✅ If full JSON is in env
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  firebaseConfig = {
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  };
} else if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  // ✅ If path is provided in env
  const serviceAccountPath = path.resolve(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));
  firebaseConfig = {
    credential: cert(serviceAccount),
    projectId: serviceAccount.project_id,
  };
} else {
  throw new Error("❌ Firebase service account not configured!");
}

// Initialize Firebase Admin SDK
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

export const adminAuth = getAuth(app);
export default app;
