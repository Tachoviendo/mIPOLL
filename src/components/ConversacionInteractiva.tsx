"use client";

import { useState } from "react";
import { HistorialConversacion } from "@/components/HistorialConversacion";
import { MessageComposer } from "@/components/MessageComposer";
import type { Conversacion, Mensaje } from "@/data/mensajes";

/**
 * `src/components/ConversacionInteractiva.tsx`: historial de una conversación
 * con el formulario para enviar mensajes. Los mensajes nuevos viven solo en
 * el estado del cliente hasta que exista un backend.
 */
export function ConversacionInteractiva({
  conversacion,
  mensajesIniciales,
  usuarioActualId,
}: {
  conversacion: Conversacion;
  mensajesIniciales: Mensaje[];
  usuarioActualId: string;
}) {
  const [mensajes, setMensajes] = useState<Mensaje[]>(mensajesIniciales);

  const manejarEnviar = (contenido: string) => {
    setMensajes((prev) => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        conversacionId: conversacion.id,
        autorId: usuarioActualId,
        contenido,
        fecha: new Date().toISOString(),
        leido: true,
      },
    ]);
  };

  return (
    <div className="flex flex-col gap-4">
      <HistorialConversacion
        conversacion={conversacion}
        mensajes={mensajes}
        usuarioActualId={usuarioActualId}
      />

      {mensajes.length === 0 && (
        <p className="text-center text-sm text-zinc-500">
          No hay mensajes aún. ¡Iniciá la conversación!
        </p>
      )}

      <div className="rounded-lg border border-black/[.08] bg-white dark:border-white/[.145] dark:bg-zinc-900">
        <MessageComposer onEnviar={manejarEnviar} />
      </div>
    </div>
  );
}
