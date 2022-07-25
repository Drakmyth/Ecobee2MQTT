<script setup lang="ts">
import EcobeeConfiguration from "../components/EcobeeConfiguration.vue";
import MQTTConfiguration from "../components/MQTTConfiguration.vue";
import BridgeConfiguration from "../components/BridgeConfiguration.vue";
</script>

<template>
    <div class="settings">
        <EcobeeConfiguration />
        <MQTTConfiguration />
        <BridgeConfiguration />
    </div>
</template>

<style>
</style>
