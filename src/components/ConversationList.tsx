import type { Conversacion } from "@/data/mensajeria";
import { ConversationCard } from "@/components/ConversationCard";
import { EstadoVacio } from "@/components/EstadoVacio";

function obtenerUltimaActividad(conversacion: Conversacion): string {
  return conversacion.ultimoMensaje?.fecha ?? conversacion.actualizadoEn;
}

export function ConversationList({ conversaciones }: { conversaciones: Conversacion[] }) {
  const ordenadas = [...conversaciones].sort(
    (a, b) => obtenerUltimaActividad(b).localeCompare(obtenerUltimaActividad(a))
  );

  return (
    <section aria-label="Lista de conversaciones" className="flex flex-col gap-3">
      {ordenadas.map((conversacion) => (
        <ConversationCard key={conversacion.id} conversacion={conversacion} />
      ))}
      {ordenadas.length === 0 && (
        <EstadoVacio
          icono="mensaje"
          titulo="Todavía no hay conversaciones"
          descripcion="Cuando recibas o inicies un mensaje, aparecerá acá."
        />
      )}
    </section>
  );
}
