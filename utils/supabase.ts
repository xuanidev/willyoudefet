import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xpcxizggkkkxvvpzxxrw.supabase.co' 

export default createClient(
  supabaseUrl,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)