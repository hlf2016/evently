import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI

// cached 缓存数据库连接 因为 在 serverless 环境中，多次请求可能在多个实例上执行，因此我们需要缓存数据库连接 以便在多个请求之间共享 减少重连接的次数
// 将 mongoose 全局设置为 any 类型
const cached = (global as any).mongoose || { conn: null, promise: null }

export const connectToDatabase = async () => {
  if (cached.conn) {
    return cached.conn
  }

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is missing')
  }

  cached.promise = cached.promise || mongoose.connect(MONGODB_URI, {
    dbName: 'Evently',
    bufferCommands: false,
  })

  cached.conn = await cached.promise

  return cached.conn
}
