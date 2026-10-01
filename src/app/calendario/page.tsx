"use client";

import { useState } from "react";
import { CalendarioGrilla } from "@/components/CalendarioGrilla";
import { DetalleEventoModal } from "@/components/DetalleEventoModal";
import { FiltrosCalendario } from "@/components/FiltrosCalendario";
import { FormularioEvento } from "@/components/FormularioEvento";
import { LeyendaCalendario } from "@/components/LeyendaCalendario";
import { proximosEventos, type EventoCalendario, type TipoEvento } from "@/data/eventos";

export default function CalendarioPage() {
  const [eventoSeleccionado, setEventoSeleccionado] = useState<EventoCalendario | null>(null);
  const [filtros, setFiltros] = useState<TipoEvento[]>([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [eventoEditando, setEventoEditando] = useState<EventoCalendario | null>(null);

  const handleCrearEvento = () => {
    setEventoEditando(null);
    setMostrarFormulario(true);
  };

  const exportarICS = () => {
    const eventos = eventosCalendario;
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//MiPol//Calendario Escolar//ES\nCALSCALE:GREGORIAN\n";

    eventos.forEach((evento) => {
      const fechaInicio = new Date(evento.fechaInicio);
      const fechaFin = evento.todoElDia
        ? new Date(fechaInicio.getTime() + 24 * 60 * 60 * 1000)
        : new Date(fechaInicio.getTime() + evento.duracionMinutos * 60 * 1000);

      const uid = evento.id;
      const dtstart = fechaInicio.toISOString().replace(/[-:]/g, "").replace("T", "") + "Z";
      const dtend = fechaFin.toISOString().replace(/[-:]/g, "").replace("T", "") + "Z";
      const summary = evento.titulo.replace(/'/g, "''");
      const description = (evento.descripcion || "").replace(/'/g, "''");

      icsContent += "BEGIN:VEVENT\n";
      icsContent += `UID:${uid}\n`;
      icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").replace("T", "")}Z\n`;
      icsContent += `DTSTART:${dtstart}\n`;
      icsContent += `DTEND:${dtend}\n`;
      icsContent += `SUMMARY:${summary}\n`;
      icsContent += `DESCRIPTION:${description}\n`;
      icsContent += `END:VEVENT\n`;
    });

    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eventos-calendario-" + new Date().toISOString().slice(0, 10) + ".ics";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGuardarEvento = (evento: EventoCalendario) => {
    setMostrarFormulario(false);
    setEventoEditando(null);
  };

  const handleCancelarFormulario = () => {
    setMostrarFormulario(false);
    setEventoEditando(null);
  };

  return (
    <div className="flex flex-1 flex-col items-center bg-zinc-50 px-4 py-8 dark:bg-black sm:px-6">
      <main className="flex w-full max-w-4xl flex-col gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">
            Calendario
          </h1>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCrearEvento}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              + Nuevo evento
            </button>
            <button
              onClick={exportarICS}
              className="rounded-lg bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
            >
              Exportar .ics
            </button>
          </div>
        </div>

        <FiltrosCalendario filtros={filtros} onChange={setFiltros} />

        <CalendarioGrilla
          filtros={filtros}
          onEventoClick={setEventoSeleccionado}
        />

        <LeyendaCalendario />

        {/* Próximos eventos */}
        <div className="mt-4 rounded-xl border border-black/[.08] bg-white p-4 shadow-sm dark:border-white/[.145] dark:bg-zinc-900">
          <h3 className="font-semibold text-zinc-950 dark:text-zinc-50 mb-3">Próximos eventos</h3>
          <div className="space-y-2 text-sm">
            {proximosEventos(5).map((evento) => {
              const fecha = new Date(evento.fechaInicio);
              const esTodoElDia = evento.todoElDia;
              return (
                <div key={evento.id} className="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${evento.tipo === "feriado" ? "bg-yellow-500" : evento.tipo === "examen" ? "bg-red-500" : evento.tipo === "reunion" ? "bg-purple-500" : evento.tipo === "actividad" ? "bg-green-500" : "bg-blue-500"}`}
                    style={{ backgroundColor: colorPorTipo(evento.tipo) }}
                    aria-hidden="true"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-zinc-900 dark:text-zinc-100 truncate" title={evento.titulo}>
                      {evento.titulo}
                    </p>
                    <p className="text-zinc-500 dark:text-zinc-400">{esTodoElDia ? "Todo el día" : new Date(evento.fechaInicio).toLocaleDateString("es-UY")}</p>
                  </div>
                </div>
              );
            })}
            {proximosEventos(5).length === 0 && (
              <p className="text-zinc-400 dark:text-zinc-50">No hay eventos próximos</p>
            )}
          </div>
        </div>

        {eventoSeleccionado && (
          <DetalleEventoModal
            evento={eventoSeleccionado}
            onClose={() => setEventoSeleccionado(null)}
          />
        )}

        {mostrarFormulario && (
          <FormularioEvento
            evento={eventoEditando ?? undefined}
            onGuardar={handleGuardarEvento}
            onCancelar={handleCancelarFormulario}
          />
        )}
      </main>
    </div>
  );
}
