#!/usr/bin/env node

/**
 * Firebase MCP Server
 * Provides context about Firebase configuration and data models
 */

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "../..");

const server = new Server(
  {
    name: "firebase-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Tool definitions
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "get_firebase_config",
        description: "Get Firebase configuration and setup",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_firestore_schema",
        description: "Get Firestore collections and data schema",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_firebase_patterns",
        description: "Get common Firebase usage patterns",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "get_firebase_hooks",
        description: "Get custom Firebase hooks and utilities",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ],
  };
});

// Tool execution handlers
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name } = request.params;

  try {
    switch (name) {
      case "get_firebase_config": {
        const envExample = await fs.readFile(
          path.join(projectRoot, ".env.example"),
          "utf-8"
        );
        const firebaseVars = envExample
          .split("\n")
          .filter((line) => line.includes("FIREBASE"));

        return {
          content: [
            {
              type: "text",
              text: `Firebase Configuration:\n\nEnvironment Variables:\n${firebaseVars.join(
                "\n"
              )}\n\nSetup Pattern:\n\`\`\`typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
\`\`\``,
            },
          ],
        };
      }

      case "get_firestore_schema": {
        // Try to find type definitions
        const typesPath = path.join(projectRoot, "src/types");
        let schema = "No explicit schema found. Inferred structure:\n\n";

        try {
          const files = await fs.readdir(typesPath);
          const typeFiles = files.filter((f) => f.endsWith(".ts"));

          for (const file of typeFiles) {
            const content = await fs.readFile(
              path.join(typesPath, file),
              "utf-8"
            );
            schema += `\n// ${file}\n${content}\n`;
          }
        } catch (error) {
          schema += "Collections (inferred from project):\n";
          schema +=
            "- followups: { id, title, description, date, status, userId }\n";
          schema += "- users: { id, email, displayName, photoURL }\n";
        }

        return {
          content: [
            {
              type: "text",
              text: `Firestore Schema:\n${schema}`,
            },
          ],
        };
      }

      case "get_firebase_patterns": {
        const patterns = {
          addDocument: `// Add document
const docRef = await addDoc(collection(db, 'followups'), {
  title: 'New Followup',
  description: 'Description',
  createdAt: serverTimestamp(),
  userId: user.uid,
});`,

          getDocument: `// Get document
const docSnap = await getDoc(doc(db, 'followups', id));
if (docSnap.exists()) {
  const data = docSnap.data();
}`,

          queryDocuments: `// Query documents
const q = query(
  collection(db, 'followups'),
  where('userId', '==', user.uid),
  orderBy('createdAt', 'desc'),
  limit(10)
);
const snapshot = await getDocs(q);
const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));`,

          realtimeListener: `// Realtime listener
const unsubscribe = onSnapshot(
  query(collection(db, 'followups'), where('userId', '==', user.uid)),
  (snapshot) => {
    const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFollowups(docs);
  }
);`,

          updateDocument: `// Update document
await updateDoc(doc(db, 'followups', id), {
  status: 'completed',
  updatedAt: serverTimestamp(),
});`,

          deleteDocument: `// Delete document
await deleteDoc(doc(db, 'followups', id));`,
        };

        return {
          content: [
            {
              type: "text",
              text: `Firebase Patterns:\n\n${JSON.stringify(
                patterns,
                null,
                2
              )}`,
            },
          ],
        };
      }

      case "get_firebase_hooks": {
        const hooks = {
          useFirestore: `// Custom hook for Firestore
import { useEffect, useState } from 'react';
import { collection, query, onSnapshot } from 'firebase/firestore';

export function useFirestore<T>(collectionName: string, ...queryConstraints) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const q = query(collection(db, collectionName), ...queryConstraints);
    
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const docs = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        })) as T[];
        setData(docs);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}`,
          useAuth: `// Custom hook for Authentication
import { useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, loading };
}`,
        };

        return {
          content: [
            {
              type: "text",
              text: `Firebase Hooks:\n\n${JSON.stringify(hooks, null, 2)}`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);

console.error("Firebase MCP Server running on stdio");
