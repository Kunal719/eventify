import mongoose from 'mongoose';

// referring to global type of mongoose not the one defined above
let cached = (global as any).mongoose || { conn: null, promise: null }

const MONGO_URI = process.env.MONGO_URI;

export const connectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!MONGO_URI) {
        throw new Error('MongoDB URI is missing')
    }

    cached.promise = cached.promise || mongoose.connect(MONGO_URI);

    cached.conn = await cached.promise;

    return cached.conn;
}