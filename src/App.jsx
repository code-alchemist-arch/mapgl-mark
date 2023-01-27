import React, { useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import {
  FirestoreProvider,
  AuthProvider,
  useFirebaseApp,
  useSigninCheck,
} from 'reactfire';

import FullScreenLoader from '@/components/FullScreenLoader';

import Login from '@/features/login';
import Home from '@/features/home';

function AuthRouter() {
  const { status, data: signInCheckResult } = useSigninCheck();

  if (status === 'loading') {
    return <FullScreenLoader />;
  }

  if (signInCheckResult.signedIn === true) {
    return <Home user={signInCheckResult.user} />;
  } else {
    return <Login />;
  }
}

function App() {
  const firestoreInstance = getFirestore(useFirebaseApp());
  const authInstance = getAuth(useFirebaseApp());

  useEffect(() => {
    if (window?.location?.host !== 'youchoose-9c077977.web.app') return;
    window?.location?.assign('https://youchoose.space');
  }, []);

  return (
    <FirestoreProvider sdk={firestoreInstance}>
      <AuthProvider sdk={authInstance}>
        <AuthRouter />
      </AuthProvider>
    </FirestoreProvider>
  );
}

export default App;
