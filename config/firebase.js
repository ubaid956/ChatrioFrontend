import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the service account key file
const serviceAccountPath = path.join(__dirname, '../../frontend/chatrio-c889c-firebase-adminsdk-fbsvc-946989508e.json');

// Firebase Admin SDK configuration
const firebaseConfig = {
  credential: cert(serviceAccountPath),
  projectId: 'chatrio-c889c',
};

// Initialize Firebase Admin SDK only if no apps exist
let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Export auth instance
export const adminAuth = getAuth(app);
export default app;
