"use client";

import { useState, FormEvent } from "react";

interface MessageComposerProps {
  onEnviar: (contenido: string) => void;
  deshabilitado?: boolean;
}

export function MessageComposer({
  onEnviar,
  deshabilitado = false,
}: MessageComposerProps) {
  const [contenido, setContenido] = useState("");
  const [error, setError] = useState(false);

  const manejarEnvio = (e: FormEvent) => {
    e.preventDefault();
    const textoRecortado = contenido.trim();

    if (!textoRecortado) {
      setError(true);
      return;
    }

    setError(false);
    onEnviar(textoRecortado);
    setContenido("");
  };

  return (
    <form onSubmit={manejarEnvio} className="p-4 border-t border-zinc-200 dark:border-zinc-800">
      <div className="flex gap-2">
        <input
          type="text"
          value={contenido}
          onChange={(e) => {
            setContenido(e.target.value);
            if (error) setError(false);
          }}
          placeholder="Escribí un mensaje..."
          disabled={deshabilitado}
          className={`flex-1 px-4 py-2 rounded-full border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            error
              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
              : "border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800"
          }`}
          aria-label="Mensaje"
          aria-invalid={error}
        />
        <button
          type="submit"
          disabled={deshabilitado || !contenido.trim()}
          className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${
            contenido.trim() && !deshabilitado
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "bg-zinc-300 dark:bg-zinc-600 text-zinc-500 dark:text-zinc-400 cursor-not-allowed"
          }`}
        >
          Enviar
        </button>
      </div>
      {error && (
        <p className="mt-2 text-xs text-red-500" role="alert">
          No se puede enviar un mensaje vacío
        </p>
      )}
    </form>
  );
}
