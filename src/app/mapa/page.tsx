import { MapaLiceo } from "@/components/MapaLiceo";

export default function MapaPage() {
  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-12 text-zinc-950 dark:bg-black sm:px-10 sm:py-16">
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-8">
        <header className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            Liceo 1° de Salto
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Mapa del liceo
          </h1>
          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-400">
            Elegí el piso y tocá un punto de interés para orientarte dentro del edificio.
          </p>
        </header>

        <MapaLiceo />
      </main>
    </div>
  );
}