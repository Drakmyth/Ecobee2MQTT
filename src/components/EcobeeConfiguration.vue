<script setup lang="ts">
</script>

<template>
    <div class="ecobee-config">
        <h2>Ecobee Configuration</h2>
        <form>
            <label for="apikey">API Key:</label>
            <input type="text" id="apikey" name="apikey" /><br />
            <button>Request PIN</button><br />
            <span>PIN: </span>
            <span>ABC123</span><br />
            <span>Time Remaining: </span>
            <span>9:32</span><br />
            <button>Complete Authorization</button>
        </form>
    </div>
</template>

<style>
</style>
