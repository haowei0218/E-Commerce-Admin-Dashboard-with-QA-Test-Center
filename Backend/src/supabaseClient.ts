import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ?? ''
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_KEY ?? ''

console.log('supabase setting : ', { url: SUPABASE_URL, key: SUPABASE_KEY })
export const supabaseClient = createClient(SUPABASE_URL, SUPABASE_KEY)
