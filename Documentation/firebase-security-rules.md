# Firebase Security Rules Configuration

To complete the setup of your Firebase project, copy and paste the following security rules into your Firebase Console.

---

## 1. Firebase Storage Security Rules

Go to **Firebase Console** -> **Storage** -> **Rules**, and paste the following rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Assets folder rules
    match /storage/{allPaths=**} {
      // Allow public read access to all assets
      allow read: if true;
      
      // Only allow authenticated users to upload, delete, or modify assets
      allow write: if request.auth != null;
    }
  }
}
```

---

## 2. Cloud Firestore Security Rules

Go to **Firebase Console** -> **Firestore Database** -> **Rules**, and paste the following rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Rules for individual asset metadata records
    match /assets/{document} {
      // Allow public read access (required to resolve asset details if queried directly)
      allow read: if true;
      
      // Allow write access only to authenticated users (admin uploads)
      allow write: if request.auth != null;
    }

    // Rules for the central URL resolution manifest document
    match /manifests/{document} {
      // Allow public read access (our React client fetches this single manifest to resolve paths)
      allow read: if true;
      
      // Allow write access only to authenticated users
      allow write: if request.auth != null;
    }
    
    // Default fallback: deny all other reads/writes
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
