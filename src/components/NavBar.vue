<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <nav class="navbar">
        <span class="navbar-title">Ecobee2MQTT</span>
        <ul>
            <li>
                <RouterLink to="/">Devices</RouterLink>
            </li>
            <li>
                <RouterLink to="/settings">Settings</RouterLink>
            </li>
        </ul>
    </nav>
</template>

<style>
.navbar {
    display: flex;
    flex-direction: row;
}

.navbar .navbar-title {
    align-self: center;
}

.navbar ul {
    list-style-type: none;
    display: flex;
    flex-direction: row;
    --nav-gap: 12px;
    margin: 0 var(--nav-gap);
    padding: 0;
    column-gap: var(--nav-gap);
}

.navbar a {
    padding: 0.5rem;
    display: block;
}
</style>
