"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({
      ...credentials,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulación de verificación para el MVP
      // Usuario: fingro.tech@gmail.com
      // Contraseña: 3Robles1
      await new Promise(resolve => setTimeout(resolve, 800));

      if (credentials.email === 'fingro.tech@gmail.com' && credentials.password === '3Robles1') {
        // En un sistema real, aquí se establecería una cookie segura
        document.cookie = "ciudad_score_auth=true; path=/; max-age=86400"; // Cookie válida por 1 día
        
        // Redirigir al dashboard
        router.push('/dashboard');
      } else {
        setError('Credenciales incorrectas. Inténtalo de nuevo.');
      }
    } catch (error) {
      setError('Error al iniciar sesión. Inténtalo más tarde.');
      console.error('Error de login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFDE7] px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-[#4A4A4A] p-3 rounded-full">
              <svg width="48" height="48" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="70" cy="70" r="66" stroke="#FFF" strokeWidth="8" fill="#FFD600"/>
                <g>
                  <rect x="40" y="60" width="16" height="32" fill="#4A4A4A"/>
                  <rect x="62" y="44" width="16" height="48" fill="#4A4A4A"/>
                  <rect x="84" y="54" width="16" height="38" fill="#4A4A4A"/>
                  <polygon points="35,110 70,95 105,110 70,120" fill="#4A4A4A"/>
                </g>
              </svg>
            </div>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold text-[#4A4A4A]">
            Panel Institucional
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acceda al panel administrativo de CiudadScore.gt
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-xl">
          {error && (
            <div className="mb-4 bg-red-50 text-red-800 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}
          
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={credentials.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-[#FFD600]"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={credentials.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-[#FFD600] focus:border-[#FFD600]"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#FFD600] focus:ring-[#FFD600] border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Recordarme
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#4CAF50] hover:text-green-700">
                  ¿Olvidó su contraseña?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4A4A4A] hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD600]"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="animate-spin h-5 w-5 mr-2 border-t-2 border-b-2 border-white rounded-full"></div>
                    Iniciando sesión...
                  </div>
                ) : (
                  'Iniciar sesión'
                )}
              </button>
            </div>
          </form>
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  O volver a
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <Link
                href="/"
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FFD600]"
              >
                Sitio público
              </Link>
            </div>
          </div>
        </div>
        
        <div className="text-center text-xs text-gray-500">
          <p>Para el demo, use:</p>
          <p>Email: fingro.tech@gmail.com</p>
          <p>Contraseña: 3Robles1</p>
        </div>
      </div>
    </div>
  );
}
