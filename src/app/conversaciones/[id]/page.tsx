import { notFound } from "next/navigation";
import Link from "next/link";
import { ConversacionInteractiva } from "@/components/ConversacionInteractiva";
import {
  conversaciones,
  obtenerConversacion,
  obtenerMensajesConversacion,
} from "@/data/mensajes";

/**
 * `src/app/conversaciones/[id]/page.tsx`: página de historial completo
 * de una conversación. Muestra mensajes en orden cronológico con
 * autor y fecha visibles.
 */

// Simular usuario actual (en producción vendría de auth)
const USUARIO_ACTUAL_ID = "u1";

export function generateStaticParams() {
  return conversaciones.map((c) => ({ id: c.id }));
}

export default async function ConversacionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const conversacion = obtenerConversacion(id);

  if (!conversacion) {
    notFound();
  }

  const mensajes = obtenerMensajesConversacion(id);

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-6 py-16 dark:bg-black">
      <main className="flex w-full max-w-2xl flex-col gap-6">
        <Link
          href="/conversaciones"
          className="text-sm text-blue-600 hover:underline dark:text-blue-400"
        >
          ← Volver a conversaciones
        </Link>

        <ConversacionInteractiva
          conversacion={conversacion}
          mensajesIniciales={mensajes}
          usuarioActualId={USUARIO_ACTUAL_ID}
        />
      </main>
    </div>
  );
}
