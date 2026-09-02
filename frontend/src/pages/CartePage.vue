<template>
  <main class="homepage-for-la" data-model-id="2:2">
    <NavbarSection />
    <section id="accueil" class="hero">
      <div class="content-width">
        <div class="eyebrow">
          <span></span>
          LA MARINE · BISTROT
        </div>
        <h1>Notre <em>Carte</em></h1>
        <p>
          Une cuisine honnête de bord de mer, renouvelée chaque jour selon la pêche et les arrivages du marché.
          Tout est fait maison — ou presque.
        </p>
      </div>
    </section>
    <section class="daily-menu">
      <div class="daily-menu-title">
        <div class="daily-menu-icon">☀</div>
        <div>
          <span>AUJOURD'HUI</span>
          <h2>Menu du Jour</h2>
        </div>
      </div>
      <div class="daily-menu-options">
        <article class="daily-option">
          <span>2 PLATS</span>
          <p>Entrée + Plat <i>ou</i> Plat + Dessert</p>
          <strong>22 €</strong>
        </article>
        <article class="daily-option recommended">
          <div>
            <span>3 PLATS</span>
            <b>Recommandé</b>
          </div>
          <p>Entrée + Plat + Dessert</p>
          <strong>28 €</strong>
        </article>
      </div>
    </section>
    <section id="carte" class="menu-layout content-width">
      <aside class="sidebar">
        <section>
          <h3>CATÉGORIES</h3>
          <nav class="category-navigation">
            <a v-for="category in categories" :key="category.label" :class="{ selected: category.selected }"
              :href="category.href">
              <span>{{ category.icon }}</span>
              {{ category.label }}
            </a>
          </nav>
        </section>
        <section class="allergens">
          <h3>ALLERGÈNES</h3>
          <div class="allergen-list">
            <span v-for="allergen in allergens" :key="allergen.label">
              <i :class="allergen.className">{{ allergen.icon }}</i>
              {{ allergen.label }}
            </span>
          </div>
          <div class="diet-list">
            <span v-for="diet in diets" :key="diet.label">
              <i :class="diet.className">{{ diet.icon }}</i>
              {{ diet.label }}
            </span>
          </div>
          <p>Pour toute allergie ou intolérance, merci de nous en informer à la prise de commande.</p>
        </section>
      </aside>
      <div class="menu-content">
        <div class="section-heading">
          <h2>Entrées</h2>
          <span class="section-icon">🦞</span>
          <small>6 plats</small>
        </div>
        <div class="dish-list">
          <article v-for="dish in dishes" :key="dish.name" class="dish">
            <div class="dish-main">
              <div class="dish-title">
                <h3>{{ dish.name }}</h3>
                <span v-if="dish.badge" :class="['dish-badge', dish.badge.className]">
                  {{ dish.badge.icon }} {{ dish.badge.label }}
                </span>
              </div>
              <p>{{ dish.description }}</p>
              <div class="dish-tags">
                <span v-for="tag in dish.tags" :key="tag.label" :class="tag.className">
                  {{ tag.icon }} {{ tag.label }}
                </span>
              </div>
            </div>
            <strong class="dish-price">{{ dish.price }}</strong>
          </article>
        </div>
        <div class="chef-note">
          <span>☀</span>
          <p>
            <strong>Suggestion du chef — </strong>
            Les plats marqués de ce badge sont les coups de cœur du moment de notre chef.
            Ils peuvent varier selon les arrivages de la semaine.
          </p>
        </div>
        <div id="reservation" class="menu-actions">
          <a class="primary-action" href="tel:+33251550012">Réserver une table</a>
          <a class="secondary-action" href="tel:+33251550012">Nous appeler</a>
        </div>
      </div>
    </section>
    <FooterSection/>
  </main>
</template>
<script setup>
import NavbarSection from "../components/NavbarSection.vue";
import FooterSection from "../components/FooterSection.vue";

const categories = [
  { label: "Entrées", icon: "🦞", href: "#carte", selected: true },
  { label: "Plats", icon: "🐟", href: "#plats", selected: false },
  { label: "Desserts", icon: "🍮", href: "#desserts", selected: false },
  { label: "Boissons & Vins", icon: "🍷", href: "#boissons", selected: false },
];

const allergens = [
  { label: "Poisson", icon: "🐟", className: "fish" },
  { label: "Crustacés", icon: "🦞", className: "shellfish" },
  { label: "Gluten", icon: "🌾", className: "gluten" },
  { label: "Lait", icon: "🥛", className: "milk" },
  { label: "Œufs", icon: "🥚", className: "eggs" },
  { label: "Fruits à coque", icon: "🥜", className: "nuts" },
];

const diets = [
  { label: "Végétarien", icon: "🌱", className: "vegetarian" },
  { label: "Végan", icon: "🍃", className: "vegan" },
];

const dishes = [
  {
    name: "Soupe de poisson maison",
    description:
      "Rouille, croûtons grillés, gruyère râpé. Recette transmise depuis 1998.",
    price: "12 €",
    badge: { label: "Suggestion du chef", icon: "☀", className: "chef" },
    tags: [
      { label: "Poisson", icon: "🐟", className: "fish" },
      { label: "Gluten", icon: "🌾", className: "gluten" },
      { label: "Lait", icon: "🥛", className: "milk" },
      { label: "Œufs", icon: "🥚", className: "eggs" },
    ],
  },
  {
    name: "Huîtres de Marennes n°3",
    description:
      "La douzaine, servies sur glace pilée avec pain de seigle et beurre salé.",
    price: "22 €",
    tags: [{ label: "Crustacés", icon: "🦞", className: "shellfish" }],
  },
  {
    name: "Tartare de saumon",
    description:
      "Saumon Label Rouge, avocat, citron vert, gingembre frais, sésame torréfié.",
    price: "16 €",
    badge: { label: "Nouveau", icon: "✦", className: "new" },
    tags: [
      { label: "Poisson", icon: "🐟", className: "fish" },
      { label: "Gluten", icon: "🌾", className: "gluten" },
    ],
  },
  {
    name: "Salade chèvre chaud & noix",
    description:
      "Mesclun, crottin de Chavignol grillé, noix de Périgord, miel de fleurs, vinaigrette au xérès.",
    price: "12 €",
    badge: { label: "Végétarien", icon: "🌱", className: "vegetarian" },
    tags: [
      { label: "Lait", icon: "🥛", className: "milk" },
      { label: "Fruits à coque", icon: "🥜", className: "nuts" },
    ],
  },
  {
    name: "Terrine de la mer",
    description:
      "Mousse de poisson, coulis de poivrons doux, pickles de concombre maison.",
    price: "14 €",
    tags: [
      { label: "Poisson", icon: "🐟", className: "fish" },
      { label: "Gluten", icon: "🌾", className: "gluten" },
      { label: "Œufs", icon: "🥚", className: "eggs" },
    ],
  },
  {
    name: "Carpaccio de Saint-Jacques",
    description:
      "Noix de Saint-Jacques sauvages, huile d'olive, fleur de sel, zeste de citron et câpres.",
    price: "18 €",
    badge: { label: "Suggestion du chef", icon: "☀", className: "chef" },
    tags: [{ label: "Crustacés", icon: "🦞", className: "shellfish" }],
  },
];
</script>
<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,600;0,700;1,400&family=Nunito+Sans:wght@400;500;600;700&display=swap");

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
}

a {
  color: inherit;
  text-decoration: none;
}

.homepage-for-la {
  background: #f8f6f1;
  color: #1a3560;
  font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
  min-width: 320px;
}

.content-width {
  margin: 0 auto;
  max-width: 1280px;
  padding-left: 40px;
  padding-right: 40px;
  width: 100%;
}

.primary-action {
  background: #c9963a;
  border-radius: 999px;
  color: #fff;
  font-weight: 600;
}

.hero {
  background: #1a3560;
  color: #fff;
  padding: 176px 0 96px;
}

.eyebrow {
  align-items: center;
  color: #c9963a;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 12px;
  letter-spacing: 2.8px;
}

.eyebrow span {
  background: #c9963a;
  display: block;
  height: 1px;
  width: 40px;
}

.hero h1 {
  font-family: "Lora", Georgia, serif;
  font-size: clamp(46px, 5vw, 60px);
  font-weight: 600;
  line-height: 1;
  margin: 20px 0 16px;
}

.hero h1 em {
  font-weight: 400;
}

.hero p {
  color: rgba(255, 255, 255, 0.65);
  font-size: 18px;
  line-height: 1.62;
  margin: 0;
  max-width: 576px;
}

.daily-menu {
  align-items: center;
  background: #c9963a;
  color: #fff;
  display: flex;
  gap: 64px;
  justify-content: center;
  padding: 40px;
}

.daily-menu-title {
  align-items: flex-start;
  display: flex;
  gap: 16px;
  min-width: 230px;
}

.daily-menu-icon {
  align-items: center;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  font-size: 23px;
  height: 48px;
  justify-content: center;
  width: 48px;
}

.daily-menu-title span,
.daily-option>span,
.daily-option>div>span {
  color: rgba(255, 255, 255, 0.72);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.4px;
}

.daily-menu-title h2 {
  font-family: "Lora", Georgia, serif;
  font-size: 24px;
  margin: 4px 0 0;
}

.daily-menu-options {
  display: flex;
  gap: 32px;
}

.daily-option {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  min-width: 280px;
  padding: 16px 24px;
}

.daily-option.recommended {
  background: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
}

.daily-option>div {
  align-items: center;
  display: flex;
  gap: 8px;
}

.daily-option b {
  background: rgba(255, 255, 255, 0.25);
  border-radius: 99px;
  font-size: 10px;
  padding: 2px 8px;
}

.daily-option p {
  font-size: 14px;
  margin: 8px 0 4px;
}

.daily-option p i {
  color: rgba(255, 255, 255, 0.6);
  font-style: normal;
}

.daily-option strong {
  font-family: "Lora", Georgia, serif;
  font-size: 24px;
}

.menu-layout {
  display: grid;
  gap: 64px;
  grid-template-columns: 208px minmax(0, 1fr);
  padding-bottom: 96px;
  padding-top: 96px;
}

.sidebar h3,
.footer h3 {
  font-family: "Nunito Sans", Helvetica, Arial, sans-serif;
  font-size: 12px;
  letter-spacing: 2.16px;
  margin: 0;
}

.sidebar h3 {
  color: #5a7299;
}

.category-navigation {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-top: 16px;
}

.category-navigation a {
  align-items: center;
  border-radius: 14px;
  color: #5a7299;
  display: flex;
  font-size: 14px;
  font-weight: 600;
  gap: 12px;
  padding: 12px 16px;
}

.category-navigation a span {
  font-size: 16px;
}

.category-navigation a.selected,
.category-navigation a:hover {
  background: #1a3560;
  box-shadow: 0 4px 8px rgba(26, 53, 96, 0.18);
  color: #fff;
}

.allergens {
  margin-top: 40px;
}

.allergen-list,
.diet-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 12px;
}

.allergen-list span,
.diet-list span {
  align-items: center;
  color: #5a7299;
  display: flex;
  font-size: 12px;
  gap: 8px;
}

.allergen-list i,
.diet-list i {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  font-size: 12px;
  font-style: normal;
  height: 20px;
  justify-content: center;
  width: 20px;
}

.fish {
  background: #dbeafe;
  color: #1447e6;
}

.shellfish {
  background: #ffedd4;
  color: #ca3500;
}

.gluten {
  background: #fef9c2;
  color: #a65f00;
}

.milk {
  background: #f1f5f9;
  color: #45556c;
}

.eggs,
.chef {
  background: #fef3c6;
  color: #bb4d00;
}

.nuts {
  background: #ffe2e2;
  color: #c10007;
}

.vegetarian {
  background: #dcfce7;
  color: #008236;
}

.vegan {
  background: #d0fae5;
  color: #008236;
}

.diet-list {
  border-top: 1px solid rgba(26, 53, 96, 0.12);
  margin-top: 12px;
  padding-top: 12px;
}

.allergens>p {
  color: #5a7299;
  font-size: 11px;
  line-height: 1.63;
  margin: 16px 0 0;
}

.section-heading {
  align-items: flex-end;
  border-bottom: 2px solid #1a3560;
  display: flex;
  gap: 16px;
  padding-bottom: 24px;
}

.section-heading h2 {
  font-family: "Lora", Georgia, serif;
  font-size: 48px;
  line-height: 1;
  margin: 0;
}

.section-icon {
  font-size: 30px;
  line-height: 1;
}

.section-heading small {
  color: #5a7299;
  font-size: 14px;
  margin-left: auto;
}

.dish-list {
  margin-top: 12px;
}

.dish {
  display: flex;
  gap: 12px;
  justify-content: space-between;
  padding: 20px 0;
}

.dish:not(:last-child) {
  border-bottom: 1px solid rgba(26, 53, 96, 0.12);
}

.dish-main {
  min-width: 0;
}

.dish-title {
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.dish h3 {
  color: #1a3560;
  font-family: "Lora", Georgia, serif;
  font-size: 16px;
  margin: 0;
}

.dish-main>p {
  color: #5a7299;
  font-size: 14px;
  line-height: 1.63;
  margin: 4px 0 0;
}

.dish-badge {
  align-items: center;
  border: 1px solid transparent;
  border-radius: 99px;
  display: inline-flex;
  font-size: 10px;
  font-weight: 700;
  gap: 4px;
  padding: 2px 8px;
}

.dish-badge.chef {
  border-color: #fee685;
}

.dish-badge.new {
  background: rgba(26, 53, 96, 0.1);
  border-color: rgba(26, 53, 96, 0.2);
  color: #1a3560;
}

.dish-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 8px;
}

.dish-tags span {
  align-items: center;
  border-radius: 4px;
  display: inline-flex;
  font-size: 10px;
  gap: 4px;
  padding: 2px 6px;
}

.dish-price {
  color: #1a3560;
  flex: 0 0 auto;
  font-family: "Lora", Georgia, serif;
  font-size: 16px;
}

.chef-note {
  align-items: flex-start;
  background: #fffbeb;
  border: 1px solid #fee685;
  border-radius: 16px;
  color: #973c00;
  display: flex;
  gap: 12px;
  margin-top: 40px;
  padding: 20px;
}

.chef-note>span {
  font-size: 18px;
}

.chef-note p {
  font-size: 14px;
  line-height: 1.63;
  margin: 0;
}

.menu-actions {
  border-top: 1px solid rgba(26, 53, 96, 0.12);
  display: flex;
  gap: 16px;
  margin-top: 48px;
  padding-top: 32px;
}

.primary-action,
.secondary-action {
  font-size: 16px;
  padding: 14px 32px;
}

.secondary-action {
  border: 1px solid rgba(26, 53, 96, 0.15);
  border-radius: 999px;
  color: #1a3560;
  font-weight: 600;
}

.footer {
  background: #1a3560;
  color: #fff;
  padding: 64px 0 32px;
}

.footer-content {
  display: grid;
  gap: 48px;
  grid-template-columns: minmax(260px, 2fr) 1fr 1.25fr;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.63;
  margin: 20px 0 0;
  max-width: 320px;
}

.footer h3 {
  color: #fff;
  letter-spacing: 1.4px;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.footer-links a,
.contact-details a,
.contact-details p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 14px;
  line-height: 1.43;
  margin: 0;
}

.contact-details>div {
  align-items: flex-start;
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.contact-details>div:first-of-type {
  margin-top: 20px;
}

.contact-details>div>span {
  color: #c9963a;
  line-height: 20px;
  width: 16px;
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

@media (max-width: 900px) {
  .header-navigation {
    display: none;
  }

  .daily-menu {
    align-items: flex-start;
    flex-direction: column;
  }

  .menu-layout {
    gap: 48px;
    grid-template-columns: 1fr;
  }

  .sidebar {
    display: grid;
    gap: 32px;
    grid-template-columns: 1fr 1fr;
  }

  .allergens {
    margin-top: 0;
  }

  .footer-content {
    grid-template-columns: 1fr 1fr;
  }

  .footer-brand {
    grid-column: 1 / -1;
  }
}

@media (max-width: 620px) {
  .content-width {
    padding-left: 20px;
    padding-right: 20px;
  }

  .header {
    height: 68px;
    padding: 0 20px;
  }

  .header-booking {
    font-size: 12px;
    padding: 8px 12px;
  }

  .hero {
    padding: 132px 0 64px;
  }

  .hero p {
    font-size: 16px;
  }

  .daily-menu {
    gap: 28px;
    padding: 28px 20px;
  }

  .daily-menu-options {
    flex-direction: column;
    gap: 14px;
    width: 100%;
  }

  .daily-option {
    min-width: 0;
  }

  .menu-layout {
    padding-bottom: 64px;
    padding-top: 64px;
  }

  .sidebar {
    grid-template-columns: 1fr;
  }

  .section-heading h2 {
    font-size: 38px;
  }

  .dish {
    gap: 8px;
  }

  .dish-main>p {
    font-size: 13px;
  }

  .menu-actions {
    align-items: stretch;
    flex-direction: column;
  }

  .primary-action,
  .secondary-action {
    text-align: center;
  }

  .footer-content {
    grid-template-columns: 1fr;
  }

  .footer-brand {
    grid-column: auto;
  }

  .footer-bottom {
    align-items: flex-start;
    flex-direction: column;
    gap: 16px;
  }

  .footer-bottom div {
    flex-direction: column;
    gap: 8px;
  }
}
</style>