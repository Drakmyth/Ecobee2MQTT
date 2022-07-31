<template>
    <div class="ecobee-config">
        <h2>Ecobee Configuration</h2>
        <form>
            <label for="ecobee-apikey">API Key:</label>
            <input type="text" id="ecobee-apikey" name="ecobee-apikey" v-model="apikey" /><br />
            <button @click.prevent=requestPin>Request PIN</button><br />
            <span>PIN: {{pin}}</span><br />
            <span>Time Remaining:</span>
            <span>9:32</span><br />
            <button>Complete Authorization</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const apikey = ref('');
const pin = ref('');

const requestPin = () => {
    axios.get('http://localhost:3001/api/authorize', {
        params: {
            apikey: apikey.value,
        }
    }).then((resp) => {
        console.log(resp.data);
        pin.value = resp.data.ecobeePin;
    }).catch((error) => {
        console.error(error);
    })
};

</script>

<style>
</style>
