import db, { Pool } from 'pg'
import dotenv from 'dotenv'
dotenv.config()

// server.js要在最外層跑才能讀到.env檔案

console.log('url string : ', process.env.NEXT_PUBLIC_SUPABASE_URL)

const SupabaseClient = new Pool({
  connectionString: process.env.NEXT_PUBLIC_SUPABASE_URL,
})


export default SupabaseClient