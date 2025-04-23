/**
 * Calcula el CityScore de una zona.
 */
export function calcularCityScore({
  reportesActivos,
  reportesResueltos,
  votosConfirmados,
  participacion,
}: {
  reportesActivos: number;
  reportesResueltos: number;
  votosConfirmados: number;
  participacion: number;
}): number {
  const base = 100;
  const penalizacion = reportesActivos * 2;
  const bonoResueltos = reportesResueltos * 1.5;
  const bonoParticipacion = participacion * 0.5;
  const confirmacion = votosConfirmados * 0.5;
  return Math.max(
    0,
    Math.min(
      100,
      base - penalizacion + bonoResueltos + bonoParticipacion + confirmacion
    )
  );
}
