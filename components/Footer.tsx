import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-[#4A4A4A] text-[#FFD600] py-6 px-4 flex flex-col md:flex-row md:justify-between md:items-center gap-4 text-center md:text-left mt-auto">
      <div className="flex flex-col gap-2 md:gap-0">
        <span className="font-bold text-lg">CiudadScore.gt</span>
        <span className="text-sm">Hecho por chapines para chapines</span>
      </div>
      <div className="flex flex-col gap-1 md:gap-2 md:items-end">
        <div className="flex gap-4 justify-center md:justify-end mb-1">
          <a href="mailto:hola@ciudadscore.gt" title="Contacto" className="hover:text-[#4CAF50] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M2 6.5A2.5 2.5 0 0 1 4.5 4h15A2.5 2.5 0 0 1 22 6.5v11A2.5 2.5 0 0 1 19.5 20h-15A2.5 2.5 0 0 1 2 17.5v-11Zm2.47-.5 7.53 6.1L19.53 6H4.47ZM20 7.86l-7.2 5.83a1 1 0 0 1-1.6 0L4 7.86V17.5c0 .28.22.5.5.5h15a.5.5 0 0 0 .5-.5V7.86ZM4.91 6h14.18L12 11.9 4.91 6Z"/></svg>
          </a>
          <a href="https://twitter.com/ciudadscoregt" target="_blank" rel="noopener noreferrer" title="X" aria-label="X" className="hover:text-[#4CAF50] transition-colors">
            {/* X Logo SVG */}
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M17.53 3H21L14.81 10.39L22 21H15.68L11.09 14.36L5.92 21H2L8.57 13.13L2 3H8.48L12.67 9.13L17.53 3ZM16.34 19H18.13L7.75 4.97H5.84L16.34 19Z"/></svg>
          </a>
          <a href="https://www.facebook.com/ciudadscoregt" target="_blank" rel="noopener noreferrer" title="Facebook" className="hover:text-[#4CAF50] transition-colors">
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path fill="currentColor" d="M13.5 21.5v-8h2.5l.5-3h-3V8.5c0-.8.2-1.5 1.5-1.5h1.5V4.5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.3-3.7 3.7V10.5H7V13.5h2v8h4.5Z"/></svg>
          </a>
        </div>
        <span className="text-xs">Contacto: hola@ciudadscore.gt</span>
      </div>
    </footer>
  );
}

