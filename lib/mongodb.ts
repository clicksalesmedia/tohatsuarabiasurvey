import { MongoClient, Db } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  family: 4, // Use IPv4, skip trying IPv6
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  const globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>;
  };

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export async function getDatabase(): Promise<Db> {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DB);
    
    // Test the connection
    await db.admin().ping();
    console.log('✅ MongoDB connection successful');
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    
    // Fallback: Try direct connection with different SSL settings
    try {
      console.log('🔄 Attempting fallback connection...');
      const fallbackClient = new MongoClient(uri, {
        ...options,
        tls: true,
        tlsInsecure: true, // Less strict for Vercel
        directConnection: false,
      });
      
      await fallbackClient.connect();
      const db = fallbackClient.db(process.env.MONGODB_DB);
      await db.admin().ping();
      
      console.log('✅ Fallback MongoDB connection successful');
      return db;
    } catch (fallbackError) {
      console.error('❌ Fallback connection also failed:', fallbackError);
      throw new Error(`MongoDB connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
} 