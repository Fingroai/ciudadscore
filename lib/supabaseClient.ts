import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Debe ser: https://npbzswbxgmejmcoqiekl.supabase.co
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Debe ser la anon key del proyecto
// Si falta alguna variable, consulta el README o tu panel de Supabase.

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
