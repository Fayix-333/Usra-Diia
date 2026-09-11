import { useEffect, useState } from 'react';
import { db, doc, setDoc, onSnapshot } from '../firebase';
import { increment, serverTimestamp } from 'firebase/firestore';
import { Users, Wifi } from 'lucide-react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null, // Since this might be pre-auth or public visitor count
      email: null,
    },
    operationType,
    path
  };
  console.error('[VisitorCounter] Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function VisitorCounter() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const hasVisited = sessionStorage.getItem('usra_portal_visited');
    const docRef = doc(db, 'analytics', 'visitors');

    // 1. Safe write increment
    if (!hasVisited) {
      sessionStorage.setItem('usra_portal_visited', 'true');
      
      setDoc(docRef, {
        count: increment(1),
        updatedAt: serverTimestamp()
      }, { merge: true })
        .catch((err) => {
          console.warn('[VisitorCounter] Error during safe increment:', err);
          // Don't crash the user UI if write fails, fallback to read
        });
    }

    // 2. Setup real-time updates listener
    const unsubscribe = onSnapshot(docRef, 
      (docSnap) => {
        if (docSnap.exists()) {
          setVisitorCount(docSnap.data().count || 0);
        } else {
          // If document doesn't exist yet, seed it
          setDoc(docRef, { count: 124, updatedAt: serverTimestamp() }, { merge: true })
            .then(() => setVisitorCount(124))
            .catch((err) => handleFirestoreError(err, OperationType.WRITE, 'analytics/visitors'));
        }
      }, 
      (err) => {
        setError(true);
        handleFirestoreError(err, OperationType.GET, 'analytics/visitors');
      }
    );

    return () => unsubscribe();
  }, []);

  if (error) {
    return null; // Gracefully hide counter if there are rules issues during startup
  }

  if (visitorCount === null) {
    return (
      <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-neutral-500 select-none">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500/40"></span>
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500/60"></span>
        </span>
        Connecting to live campus metrics...
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/5 backdrop-blur-md shadow-lg transition-all duration-300 hover:border-blue-500/20 hover:bg-white/[0.07] group">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
      </span>
      <div className="flex items-center gap-1.5">
        <Users className="w-3.5 h-3.5 text-neutral-400 group-hover:text-cyan-400 transition-colors duration-300" />
        <span className="text-xs font-mono text-neutral-300">
          <span className="text-white font-bold font-display text-sm tracking-wide mr-1 drop-shadow-[0_0_10px_rgba(34,211,238,0.2)]">
            {visitorCount.toLocaleString()}
          </span> 
          students joined the portal
        </span>
      </div>
    </div>
  );
}
