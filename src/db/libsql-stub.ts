// Stub for native libsql native module on Vercel Serverless
export default class Database {
  constructor() {
    throw new Error("Native libsql C++ binding is not available in Vercel Serverless environment");
  }
}
