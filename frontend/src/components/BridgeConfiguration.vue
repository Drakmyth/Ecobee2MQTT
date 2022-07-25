<script setup lang="ts">
</script>

<template>
    <div class="bridge-config">
        <h2>Bridge Configuration</h2>
        <form>
            <input type="checkbox" id="bridge-auth" />
            <label for="bridge-auth">Enable Authentication</label><br />
            <label for="bridge-username">Username:</label>
            <input type="text" id="bridge-username" name="bridge-username" /><br />
            <label for="bridge-password">Password:</label>
            <input type="text" id="bridge-password" name="bridge-password" /><br />
            <input type="checkbox" id="bridge-ssl" />
            <label for="bridge-ssl">Enable HTTPS</label><br />
            <label for="bridge-sslkey">SSL/TLS Key:</label>
            <input type="text" id="bridge-sslkey" name="bridge-sslkey" /><br />
            <label for="bridge-sslcert">SSL/TLS Certificate:</label>
            <input type="text" id="bridge-sslcert" name="bridge-sslcert" />
        </form>
    </div>
</template>

<style>
</style>
