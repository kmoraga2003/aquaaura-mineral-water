import * as admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let db: any = null;

try {
    if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: process.env.FIREBASE_DATABASE_URL
        });
        db = admin.firestore();
        console.log('🔥 Firebase Admin initialized successfully.');
    } else if (process.env.FIREBASE_PROJECT_ID) {
        admin.initializeApp({
            projectId: process.env.FIREBASE_PROJECT_ID
        });
        db = admin.firestore();
        console.log('🔥 Firebase Admin initialized with Project ID.');
    } else {
        console.log('ℹ️ Firebase environment variables not set. Using local database store for development.');
    }
} catch (error) {
    console.warn('⚠️ Firebase init warning:', error);
}

export { admin, db };
