import { createClient } from "@supabase/supabase-js";

// Manejo seguro de inicialización para prevenir errores en build time
let supabase: any;

// Solo inicializa Supabase cuando las variables de entorno están disponibles
// y estamos en un contexto donde window existe (cliente)
if (typeof window !== 'undefined') {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  } else {
    console.error('Supabase URL o Anon Key no disponibles');
    // Proporcionar un cliente simulado para prevenir errores
    supabase = {
      from: () => ({
        select: () => ({ data: null, error: new Error('Supabase no inicializado') })
      }),
      storage: {
        from: () => ({
          upload: () => ({ data: null, error: new Error('Supabase no inicializado') })
        })
      }
    };
  }
} else {
  // Durante el build/prerender, proporcionar un cliente simulado
  supabase = {
    from: () => ({
      select: () => ({ data: null, error: new Error('Supabase no inicializado') })
    }),
    storage: {
      from: () => ({
        upload: () => ({ data: null, error: new Error('Supabase no inicializado') })
      })
    }
  };
}

export { supabase };
