<template></template>

<script setup>
import { onMounted } from "@vue/runtime-core";
import jiananMap from "./lib/map.js";

onMounted(() => {
  new jiananMap().init();
});

// This starter template is using Vue 3 experimental <script setup> SFCs
// Check out https://github.com/vuejs/rfcs/blob/script-setup-2/active-rfcs/0000-script-setup.md
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
