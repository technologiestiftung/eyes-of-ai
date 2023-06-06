import { createClient } from "@supabase/supabase-js";
import { Database } from "./database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
export const anonClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
