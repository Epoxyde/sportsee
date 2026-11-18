// UTC évite les décalages liés aux changements d'heure.
export function shiftDate(value: string, days: number): string {
  const date = new Date(`${value}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) {
    throw new Error("La date doit être une date valide au format YYYY-MM-DD.");
  }
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

// La semaine courante suit la date locale de l'utilisateur, du lundi au dimanche.
export function getCurrentWeekStart(today = new Date()): string {
  const localDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  return shiftDate(localDate, -((today.getDay() + 6) % 7));
}

export function formatChartDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", timeZone: "UTC",
  });
}
