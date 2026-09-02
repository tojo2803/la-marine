// Script de test manuel (pas un framework de test comme Jest, juste un script
// qui appelle l'API en HTTP et vérifie que chaque règle métier répond comme
// attendu). Utile pour vérifier rapidement que le backend fonctionne
// correctement après une modification, ou pour le montrer à l'oral.
//
// Prérequis : le serveur doit déjà tourner (npm run dev), et un compte admin
// doit déjà exister (voir src/scripts/createAdmin.js).
//
// Usage :
//   node src/scripts/testScenarios.js admin@lamarine.fr ton-mot-de-passe

const BASE_URL = process.env.API_URL || "http://localhost:3000/api";

const [, , adminEmail, adminPassword] = process.argv;
if (!adminEmail || !adminPassword) {
  console.error("Usage : node src/scripts/testScenarios.js <email-admin> <mot-de-passe-admin>");
  process.exit(1);
}

let passCount = 0;
let failCount = 0;

function report(label, expectedStatus, actualStatus, extra = "") {
  const ok = expectedStatus === actualStatus;
  ok ? passCount++ : failCount++;
  const icon = ok ? "✅" : "❌";
  console.log(`${icon} ${label} — attendu ${expectedStatus}, reçu ${actualStatus} ${extra}`);
}

async function call(method, path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* réponse vide (ex: 204) */
  }
  return { status: res.status, data };
}

// Utilitaires de dates
function toISODate(date) {
  return date.toISOString().slice(0, 10);
}
function nextDateWithWeekday(weekday) {
  const d = new Date();
  d.setDate(d.getDate() + ((7 + weekday - d.getDay()) % 7 || 7));
  return d;
}
function futureDate(daysFromNow) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d;
}

const baseReservation = {
  firstName: "Marie",
  lastName: "Test",
  email: "marie.test@exemple.fr",
  phone: "0600000000",
  service: "dinner",
  time: "19h00",
  guests: 4,
  message: "Réservation de test",
};

async function run() {
  console.log("\n=== 1. Réservation valide (cas normal) ===");
  {
    const date = toISODate(futureDate(10));
    const { status, data } = await call("POST", "/reservations", { ...baseReservation, date });
    report("Créer une réservation valide", 201, status, data?.message ? `— ${data.message}` : "");
  }

  console.log("\n=== 2. Données invalides ===");
  {
    const { status } = await call("POST", "/reservations", { ...baseReservation, email: "pas-un-email" });
    report("Email invalide", 400, status);
  }
  {
    const { status } = await call("POST", "/reservations", { ...baseReservation, date: toISODate(futureDate(5)), guests: 0 });
    report("Nombre de personnes invalide (0)", 400, status);
  }

  console.log("\n=== 3. Date passée ===");
  {
    const { status } = await call("POST", "/reservations", { ...baseReservation, date: toISODate(futureDate(-2)) });
    report("Date déjà passée", 400, status);
  }

  console.log("\n=== 4. Jour de fermeture hebdomadaire (lundi, cf. seed) ===");
  {
    const mondayDate = toISODate(nextDateWithWeekday(1));
    const { status } = await call("POST", "/reservations", { ...baseReservation, date: mondayDate });
    report(`Réservation un lundi (${mondayDate})`, 400, status);
  }

  console.log("\n=== 5. Créneau complet (409 Conflict) ===");
  {

    const date = toISODate(futureDate(15));
    const slot = { ...baseReservation, date, time: "20h00", guests: 7 };
    const r1 = await call("POST", "/reservations", slot);
    const r2 = await call("POST", "/reservations", slot);
    const r3 = await call("POST", "/reservations", slot);
    report("1ère réservation (7 pers.)", 201, r1.status);
    report("2e réservation (7 pers., total 14)", 201, r2.status);
    report("3e réservation (7 pers., total 21 > capacité 20)", 409, r3.status, r3.data?.message ? `— ${r3.data.message}` : "");
  }

  console.log("\n=== 6. Authentification back-office ===");
  let token = null;
  {
    const { status, data } = await call("POST", "/auth/login", { email: adminEmail, password: adminPassword });
    report("Login admin avec bons identifiants", 200, status);
    token = data?.data?.token;
  }
  {
    const { status } = await call("POST", "/auth/login", { email: adminEmail, password: "mauvais-mot-de-passe" });
    report("Login admin avec mauvais mot de passe", 401, status);
  }

  console.log("\n=== 7. Routes protégées (back-office) ===");
  {
    const { status } = await call("GET", "/reservations", null, null);
    report("Lister les réservations SANS token", 401, status);
  }
  let reservationId = null;
  if (token) {
    const { status, data } = await call("GET", "/reservations", null, token);
    report("Lister les réservations AVEC token", 200, status, `— ${data?.data?.length ?? 0} réservation(s)`);
    reservationId = data?.data?.[0]?.id;
  }

  console.log("\n=== 8. Confirmer / annuler une réservation ===");
  if (token && reservationId) {
    const { status } = await call("PATCH", `/reservations/${reservationId}/status`, { status: "confirmed" }, token);
    report(`Confirmer la réservation #${reservationId}`, 200, status);
  }
  if (token) {
    const { status } = await call("PATCH", `/reservations/999999/status`, { status: "confirmed" }, token);
    report("Confirmer une réservation inexistante", 404, status);
  }

  console.log("\n=== 9. Jours de fermeture exceptionnels ===");
  const exceptionalDate = toISODate(futureDate(20));
  if (token) {
    const { status } = await call("POST", "/closing-days", { date: exceptionalDate, reason: "Test — événement privé" }, token);
    report("Ajouter un jour de fermeture (admin)", 201, status);
  }
  {
    const { status } = await call("POST", "/closing-days", { date: exceptionalDate, reason: "sans token" }, null);
    report("Ajouter un jour de fermeture SANS token", 401, status);
  }
  {
    const { status } = await call("POST", "/reservations", { ...baseReservation, date: exceptionalDate });
    report("Réserver un jour exceptionnellement fermé", 400, status);
  }

  console.log("\n=== 10. Consultation publique des créneaux ===");
  {
    const { status, data } = await call("GET", "/time-slots", null, null);
    report("Lister les créneaux (public)", 200, status, `— ${data?.data?.length ?? 0} créneau(x)`);
  }

  console.log(`\n----- Résultat global : ${passCount} réussi(s), ${failCount} échoué(s) -----\n`);
  process.exit(failCount > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error("Erreur pendant l'exécution des tests :", err);
  process.exit(1);
});
