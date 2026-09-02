<template>
    <header class="header">
    <router-link class="brand" to="/accueil" aria-label="La Marine">
    <span class="brand-icon">⚓</span>
    <span>Restaurant Et Bar La Marine</span>
    </router-link>
    <nav class="header-navigation" aria-label="Navigation principale">
    <router-link to="/accueil" :class="{ active: route.path === '/accueil' && !route.hash }">Accueil</router-link>
    <router-link to="/carte" :class="{ active: route.path === '/carte' }">Carte</router-link>
    <router-link to="/reservation" :class="{ active: route.path === '/reservation' }">Réservation</router-link>
    <router-link :to="{ path: '/accueil', hash: '#contact' }" :class="{ active: route.hash === '#contact' }">Contact</router-link>
    </nav>
    <router-link class="header-booking" to="/reservation">Réserver une table</router-link>
    </header>
    </template>
    
    <script setup>
    import { useRoute } from "vue-router";
    
    const route = useRoute();
    </script>
    
    <style scoped>
    .header {
      align-items: center;
      background: rgba(26, 53, 96, 0.95);
      display: flex;
      height: 80px;
      justify-content: space-between;
      left: 0;
      padding: 0 40px;
      position: absolute;
      right: 0;
      top: 0;
      z-index: 10;
    }
    
    .brand,
    .header-booking,
    .header-navigation a {
      text-decoration: none;
    }
    
    .brand {
      align-items: center;
      color: #fff;
      display: inline-flex;
      font-family: "Lora", Georgia, serif;
      font-size: 20px;
      font-weight: 600;
      gap: 10px;
    }
    
    .brand-icon {
      align-items: center;
      background: rgba(201, 150, 58, 0.2);
      border-radius: 50%;
      color: #c9963a;
      display: inline-flex;
      font-size: 19px;
      height: 36px;
      justify-content: center;
      width: 36px;
    }
    
    .header-navigation {
      display: flex;
      gap: 32px;
    }
    
    .header-navigation a {
      color: rgba(255, 255, 255, 0.75);
      font-size: 14px;
      font-weight: 500;
    }
    
    .header-navigation a.active,
    .header-navigation a:hover {
      color: #c9963a;
    }
    
    .header-booking {
      background: #c9963a;
      border-radius: 999px;
      color: #fff;
      font-size: 14px;
      font-weight: 600;
      padding: 10px 20px;
    }
    
    @media (max-width: 800px) {
      .header-navigation {
        display: none;
      }
    }
    </style>
    