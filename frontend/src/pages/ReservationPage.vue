<template>
  <div class="homepage-for-la" data-model-id="1:2">
    <NavbarSection />
    <main>
      <section class="hero">
        <div class="content-width">
          <div class="eyebrow">
            <span></span>
            LA MARINE · RESTAURANT - BAR
          </div>
          <h1><strong>Réserver</strong> <em>une table</em></h1>
          <p>
            Choisissez votre créneau, on s'occupe du reste. Une confirmation
            vous sera envoyée par email sous 24 heures.
          </p>
        </div>
      </section>
      <section id="reservation" class="booking-section content-width">
        <form class="booking-form" @submit.prevent="submitReservation">
          <fieldset class="field-set">
            <legend>Vos coordonnées</legend>
            <div class="field-grid">
              <label class="form-field">
                <span>Prénom <b>*</b></span>
                <input v-model="reservation.firstName" type="text" placeholder="Marie" required />
              </label>
              <label class="form-field">
                <span>Nom <b>*</b></span>
                <input v-model="reservation.lastName" type="text" placeholder="Dupont" required />
              </label>
              <label class="form-field">
                <span>Adresse email <b>*</b></span>
                <input v-model="reservation.email" type="email" placeholder="marie@exemple.fr" required />
              </label>
              <label class="form-field">
                <span>Téléphone</span>
                <input v-model="reservation.phone" type="tel" placeholder="06 12 34 56 78" />
              </label>
            </div>
          </fieldset>
          <fieldset class="field-set">
            <legend>Votre réservation</legend>
            <div class="field-grid">
              <label class="form-field">
                <span>Date souhaitée <b>*</b></span>
                <input v-model="reservation.date" type="date" required />
              </label>
              <label class="form-field">
                <span>Nombre de personnes <b>*</b></span>
                <select v-model="reservation.guests" required>
                  <option value="1">1 personne</option>
                  <option value="2">2 personnes</option>
                  <option value="3">3 personnes</option>
                  <option value="4">4 personnes</option>
                  <option value="5">5 personnes</option>
                  <option value="6">6 personnes</option>
                  <option value="7">7 personnes</option>
                  <option value="8">8 personnes</option>
                  <option value="9">9 personnes</option>
                  <option value="10">10 personnes</option>
                  <option value="11">11 personnes</option>
                  <option value="12">12 personnes</option>
                </select>
              </label>
            </div>
            <div class="form-field service-field">
              <span>Service <b>*</b></span>
              <div class="service-options">
                <button :class="{ selected: reservation.service === 'lunch' }" type="button"
                  @click="reservation.service = 'lunch'">
                  <strong>Déjeuner</strong>
                  <small>12h00 – 14h00</small>
                </button>
                <button :class="{ selected: reservation.service === 'dinner' }" type="button"
                  @click="reservation.service = 'dinner'">
                  <strong>Dîner</strong>
                  <small>19h00 – 22h00</small>
                </button>
              </div>
            </div>
            <label class="form-field arrival-field">
              <span>Heure d'arrivée <b>*</b></span>
              <select v-model="reservation.time" required>
                <option disabled value="">Choisir un créneau…</option>
                <option>12h00</option>
                <option>12h15</option>
                <option>12h30</option>
                <option>13h00</option>
                <option>13h15</option>
                <option>13h30</option>
                <option>19h00</option>
                <option>19h15</option>
                <option>19h30</option>
                <option>20h00</option>
                <option>20h15</option>
                <option>20h30</option>
              </select>
            </label>
          </fieldset>
          <fieldset class="field-set">
            <legend>
              Demande particulière <small>(optionnel)</small>
            </legend>
            <label class="form-field">
              <span>Message ou demande spéciale</span>
              <textarea v-model="reservation.message"
                placeholder="Allergie alimentaire, anniversaire, chaise haute, terrasse souhaitée…"></textarea>
            </label>
          </fieldset>
          <p class="privacy-text">
            En envoyant ce formulaire, vous acceptez que vos informations soient
            utilisées uniquement dans le cadre de votre réservation. Aucun
            démarchage commercial. Annulation gratuite jusqu'à 24h avant.
          </p>
          <p v-if="feedback.message" :class="['feedback-message', feedback.type]">
            {{ feedback.message }}
          </p>
          <button class="submit-button" type="submit" :disabled="isSubmitting">
            <span>✉</span>
            {{ isSubmitting ? "Envoi en cours…" : "Confirmer la réservation" }}
          </button>
        </form>
        <aside class="sidebar">
          <section class="opening-card">
            <h2><span>◷</span> Horaires d'ouverture</h2>
            <div v-for="schedule in schedules" :key="schedule.day" class="schedule-row">
              <strong>{{ schedule.day }}</strong>
              <p><span>Déj.</span> {{ schedule.lunch }}</p>
              <p><span>Soir</span> {{ schedule.dinner }}</p>
            </div>
          </section>
          <section class="sidebar-card">
            <h2>Réserver par téléphone</h2>
            <p>
              Vous préférez nous appeler ? Notre équipe est disponible du mardi
              au dimanche de 10h à 22h.
            </p>
            <a class="phone-link" href="tel:+33251550012">
              <span>☎</span>
              <span>
                <small>Appelez-nous</small>
                <strong>02 51 55 00 12</strong>
              </span>
            </a>
          </section>
          <section class="sidebar-card useful-info">
            <h2>Informations utiles</h2>
            <ul>
              <li>Annulation gratuite jusqu'à 24 heures avant votre réservation.</li>
              <li>En haute saison, réservez 48h à l'avance pour garantir une table en terrasse.</li>
              <li>Pour les groupes de plus de 12, contactez-nous directement par téléphone.</li>
              <li>Nous confirmons chaque réservation par email sous 24 heures.</li>
            </ul>
          </section>
          <section class="terrace-card">
            <div>
              <span>⌖</span>
              Terrasse face à l'océan — Saint-Gilles-Croix-de-Vie
            </div>
          </section>
        </aside>
      </section>
    </main>
    <FooterSection />
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import NavbarSection from "../components/NavbarSection.vue";
import FooterSection from "../components/FooterSection.vue";

// URL de l'API backend. En production, préfère une variable d'environnement
// Vite (import.meta.env.VITE_API_URL) plutôt qu'une URL en dur.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

const reservation = reactive({
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  date: "",
  guests: "2",
  service: "lunch",
  time: "",
  message: "",
});

const isSubmitting = ref(false);
const feedback = reactive({ type: "", message: "" });

const schedules = [
  { day: "maardi – Jeudi", lunch: "12h00 – 14h00", dinner: "19h00 – 22h00" },
  { day: "Vendredi", lunch: "12h00 – 14h00", dinner: "19h00 – 22h00" },
  { day: "Samedi", lunch: "12h00 – 14h00", dinner: "19h00 – 22h00" },
  { day: "Dimanche", lunch: "12h00 – 14h00", dinner: "19h00 – 22h00" },
  { day: "Lundi", lunch: "fermer", dinner: "fermer" },
];

function resetForm() {
  reservation.firstName = "";
  reservation.lastName = "";
  reservation.email = "";
  reservation.phone = "";
  reservation.date = "";
  reservation.guests = "2";
  reservation.service = "lunch";
  reservation.time = "";
  reservation.message = "";
}

async function submitReservation() {
  feedback.type = "";
  feedback.message = "";
  isSubmitting.value = true;

  try {
    const response = await fetch(`${API_URL}/reservations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: reservation.firstName,
        lastName: reservation.lastName,
        email: reservation.email,
        phone: reservation.phone,
        date: reservation.date,
        service: reservation.service,
        time: reservation.time,
        guests: Number(reservation.guests),
        message: reservation.message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      // Le backend renvoie un message clair adapté à chaque cas :
      // 400 (données invalides, date passée, jour fermé) ou 409 (créneau complet).
      feedback.type = "error";
      feedback.message = result.message || "Une erreur est survenue, merci de réessayer.";
      return;
    }

    feedback.type = "success";
    feedback.message = result.message || "Votre demande de réservation a bien été envoyée.";
    resetForm();
  } catch (err) {
    // Erreur réseau (API injoignable) : on ne montre jamais le détail technique au client.
    feedback.type = "error";
    feedback.message = "Impossible de contacter le serveur. Merci de réessayer dans un instant.";
  } finally {
    isSubmitting.value = false;
  }
}
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;1,400&family=Nunito+Sans:wght@400;500;600;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

.homepage-for-la {
  --navy: #1a3560;
  --gold: #c9963a;
  --cream: #f8f6f1;
  --muted: #5a7299;
  background: var(--cream);
  color: var(--navy);
  font-family: "Nunito Sans", Helvetica, sans-serif;
  min-width: 320px;
}

.content-width {
  margin: 0 auto;
  max-width: 1280px;
  padding-left: 40px;
  padding-right: 40px;
}

.footer a {
  text-decoration: none;
}

.footer-about h2 span {
  align-items: center;
  background: rgba(201, 150, 58, 0.2);
  border-radius: 50%;
  color: var(--gold);
  display: inline-flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.hero {
  background: var(--navy);
  color: #fff;
  padding: 160px 0 80px;
}

.eyebrow {
  align-items: center;
  color: var(--gold);
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 12px;
  letter-spacing: 2.8px;
}

.eyebrow span {
  background: var(--gold);
  display: inline-block;
  height: 1px;
  width: 40px;
}

.hero h1 {
  font-family: "Lora", serif;
  font-size: 60px;
  font-weight: 400;
  line-height: 1;
  margin: 18px 0;
}

.hero h1 strong {
  font-weight: 600;
}

.hero h1 em {
  font-weight: 400;
}

.hero p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 18px;
  line-height: 1.6;
  margin: 0;
  max-width: 520px;
}

.booking-section {
  display: grid;
  gap: 64px;
  padding-bottom: 96px;
  padding-top: 96px;
}

.booking-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.field-set {
  background: #fff;
  border: 1px solid rgba(26, 53, 96, 0.12);
  border-radius: 16px;
  margin: 0;
  padding: 32px;
}

.field-set legend {
  color: var(--navy);
  font-family: "Lora", serif;
  font-size: 18px;
  font-weight: 600;
  padding: 0 4px;
}

.field-set legend small {
  color: var(--muted);
  font-family: "Nunito Sans", sans-serif;
  font-size: 14px;
  font-weight: 400;
}

.field-grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 1fr;
  margin-top: 20px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-field>span {
  color: var(--navy);
  font-size: 14px;
  font-weight: 600;
}

.form-field b {
  color: var(--gold);
}

.form-field input,
.form-field select,
.form-field textarea {
  appearance: none;
  background: #fff;
  border: 1px solid rgba(26, 53, 96, 0.12);
  border-radius: 14px;
  color: var(--navy);
  font: inherit;
  font-size: 14px;
  min-height: 46px;
  outline: none;
  padding: 12px 16px;
  width: 100%;
}

.form-field input:focus,
.form-field select:focus,
.form-field textarea:focus {
  border-color: var(--gold);
  box-shadow: 0 0 0 3px rgba(201, 150, 58, 0.15);
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: rgba(90, 114, 153, 0.6);
}

.form-field textarea {
  background: var(--cream);
  min-height: 106px;
  resize: vertical;
}

.service-field,
.arrival-field {
  margin-top: 20px;
}

.service-options {
  display: grid;
  gap: 12px;
  grid-template-columns: 1fr 1fr;
}

.service-options button {
  background: #fff;
  border: 1.5px solid rgba(26, 53, 96, 0.12);
  border-radius: 14px;
  color: var(--navy);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 16px 20px;
  text-align: left;
}

.service-options button.selected {
  background: rgba(26, 53, 96, 0.05);
  border-color: var(--navy);
}

.service-options strong {
  font-size: 14px;
}

.service-options small {
  color: var(--muted);
  font-size: 12px;
}

.privacy-text {
  color: var(--muted);
  font-size: 12px;
  line-height: 1.65;
  margin: 0;
  padding: 0 4px;
}

.feedback-message {
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.5;
  margin: 0;
  padding: 14px 18px;
}

.feedback-message.success {
  background: rgba(34, 139, 87, 0.12);
  color: #1e6b3a;
}

.feedback-message.error {
  background: rgba(201, 58, 58, 0.1);
  color: #a43333;
}

.submit-button:disabled {
  cursor: not-allowed;
  opacity: 0.65;
}

.submit-button {
  align-items: center;
  background: var(--navy);
  border: 0;
  border-radius: 999px;
  box-shadow: 0 10px 15px -3px rgba(26, 53, 96, 0.2);
  color: #fff;
  cursor: pointer;
  display: flex;
  font: inherit;
  font-size: 16px;
  font-weight: 600;
  gap: 8px;
  justify-content: center;
  min-height: 56px;
}

.submit-button:hover {
  background: #244675;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.opening-card,
.sidebar-card {
  border-radius: 16px;
  padding: 24px;
}

.opening-card {
  background: var(--navy);
  color: #fff;
}

.opening-card h2,
.sidebar-card h2 {
  font-family: "Lora", serif;
  font-size: 18px;
  margin: 0;
}

.opening-card h2 span {
  color: var(--gold);
  margin-right: 8px;
}

.schedule-row {
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 16px 0 12px;
}

.schedule-row:last-child {
  border-bottom: 0;
}

.schedule-row strong {
  color: rgba(255, 255, 255, 0.7);
  font-size: 12px;
}

.schedule-row p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 14px;
  line-height: 1.35;
  margin: 4px 0 0;
}

.schedule-row p span {
  color: var(--gold);
  display: inline-block;
  font-weight: 600;
  min-width: 37px;
}

.sidebar-card {
  background: #fff;
  border: 1px solid rgba(26, 53, 96, 0.12);
}

.sidebar-card>p {
  color: var(--muted);
  font-size: 14px;
  line-height: 1.65;
  margin: 16px 0;
}

.phone-link {
  align-items: center;
  background: rgba(26, 53, 96, 0.08);
  border: 1px solid rgba(26, 53, 96, 0.15);
  border-radius: 14px;
  color: var(--navy);
  display: flex;
  gap: 12px;
  padding: 12px 16px;
  text-decoration: none;
}

.phone-link>span:first-child {
  align-items: center;
  background: var(--navy);
  border-radius: 50%;
  color: #fff;
  display: flex;
  height: 36px;
  justify-content: center;
  width: 36px;
}

.phone-link>span:last-child {
  display: flex;
  flex-direction: column;
}

.phone-link small {
  color: var(--muted);
  font-size: 12px;
}

.phone-link strong {
  font-size: 14px;
}

.useful-info ul {
  color: var(--muted);
  display: flex;
  flex-direction: column;
  font-size: 14px;
  gap: 16px;
  line-height: 1.6;
  list-style: none;
  margin: 16px 0 0;
  padding: 0;
}

.useful-info li {
  padding-left: 24px;
  position: relative;
}

.useful-info li::before {
  color: var(--gold);
  content: "✓";
  left: 0;
  position: absolute;
}

.terrace-card {
  background-image: linear-gradient(0deg, rgba(26, 53, 96, 0.85), rgba(26, 53, 96, 0.2)), url("/img/image-terrasse-de-la-marine.png");
  background-position: center;
  background-size: cover;
  border-radius: 16px;
  color: #fff;
  height: 160px;
  overflow: hidden;
  position: relative;
}

.terrace-card div {
  bottom: 0;
  font-size: 12px;
  font-weight: 500;
  left: 0;
  padding: 16px;
  position: absolute;
}

.terrace-card span {
  color: var(--gold);
  margin-right: 8px;
}

.footer {
  background: var(--navy);
  color: #fff;
  padding: 64px 0 32px;
}

.footer-content {
  display: grid;
  gap: 48px;
  grid-template-columns: 2fr 1fr 1.5fr;
}

.footer h2 {
  align-items: center;
  display: flex;
  font-family: "Lora", serif;
  font-size: 20px;
  gap: 10px;
  margin: 0;
}

.footer-about p,
.footer address,
.footer-nav a {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.65;
}

.footer-about p {
  max-width: 320px;
}

.footer h3 {
  font-family: "Lora", serif;
  font-size: 14px;
  letter-spacing: 1.4px;
  margin: 8px 0 20px;
}

.footer-nav {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer a {
  color: rgba(255, 255, 255, 0.6);
}

.footer address {
  font-style: normal;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.4);
  display: flex;
  font-size: 12px;
  justify-content: space-between;
  margin-top: 56px;
  padding-top: 32px;
}

.footer-bottom div {
  display: flex;
  gap: 24px;
}

.footer-bottom a {
  color: rgba(255, 255, 255, 0.4);
}

@media (max-width: 900px) {
  .navigation {
    display: none;
  }

  .booking-section {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }

  .terrace-card {
    grid-column: 1 / -1;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
  }

  .footer-about {
    grid-column: 1 / -1;
  }
}

@media (max-width: 600px) {
  .content-width {
    padding-left: 20px;
    padding-right: 20px;
  }

  .header {
    height: 68px;
    padding: 0 20px;
  }

  .header-booking-link {
    font-size: 12px;
    padding: 9px 12px;
  }

  .brand {
    font-size: 17px;
  }

  .brand-icon {
    height: 30px;
    width: 30px;
  }

  .hero {
    padding: 125px 0 60px;
  }

  .hero h1 {
    font-size: 42px;
  }

  .hero p {
    font-size: 16px;
  }

  .booking-section {
    gap: 40px;
    padding-bottom: 64px;
    padding-top: 64px;
  }

  .field-set {
    padding: 24px 18px;
  }

  .field-grid,
  .service-options,
  .sidebar,
  .footer-content {
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: flex;
  }

  .footer {
    padding-top: 48px;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
    margin-top: 40px;
  }

  .footer-bottom div {
    flex-direction: column;
    gap: 8px;
  }
}
</style>