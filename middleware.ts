import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Función del middleware
export function middleware(request: NextRequest) {
  // Obtenemos la ruta actual
  const path = request.nextUrl.pathname;

  // Definimos las rutas públicas y protegidas
  const isLoginPath = path === '/login';
  const isProtectedPath = path.startsWith('/dashboard');

  // Verificamos si el usuario está autenticado (en un escenario real esto sería más robusto)
  const isAuthenticated = request.cookies.has('ciudad_score_auth');

  // Si el usuario intenta acceder a una ruta protegida sin autenticación
  if (isProtectedPath && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  // Si el usuario ya está autenticado e intenta acceder al login
  if (isLoginPath && isAuthenticated) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // Permitimos la navegación normal para el resto de los casos
  return NextResponse.next();
}

// Configuración del middleware - solo se ejecuta en las rutas especificadas
export const config = {
  matcher: ['/dashboard', '/dashboard/:path*', '/login'],
};
