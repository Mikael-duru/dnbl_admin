import admin, { ServiceAccount } from 'firebase-admin';
import serviceAccount from '../config/dnbl-admin-firebase-adminsdk-nck9y-9a9f14b6f8.json';

if (!admin.apps.length) {
  const credentials = serviceAccount as ServiceAccount; // Type assertion
  admin.initializeApp({
    credential: admin.credential.cert(credentials),
  });
}

export default admin;