<template>
    <div class="ecobee-config">
        <h2>Ecobee Configuration</h2>
        <form>
            <label for="ecobee-apikey">API Key:</label>
            <input type="text" id="ecobee-apikey" name="ecobee-apikey" v-model="apikey" /><br />
            <button @click.prevent=requestPin>Request PIN</button><br />
            <span>PIN: {{pin}}</span><br />
            <span>Time Remaining: {{formatTime(timeremaining)}}</span><br />
            <span v-if="timeremaining <= 0">PIN expired. Please request a new PIN.</span><br />
            <button>Complete Authorization</button>
        </form>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { ref } from 'vue';

const apikey = ref('');
const pin = ref('');
const timeremaining = ref(0);
let timer: number;

const requestPin = () => {
    axios.get('http://localhost:3001/api/authorize', {
        params: {
            apikey: apikey.value,
        }
    }).then((resp) => {
        console.log(resp.data);
        pin.value = resp.data.ecobeePin;

        timeremaining.value = resp.data.expires_in;
        timer = setInterval(onTimerTick, 1000);
    }).catch((error) => {
        console.error(error);
    })
};

const onTimerTick = () => {
    timeremaining.value -= 1;
    if (timeremaining.value <= 0) {
        clearInterval(timer);
    }
}

const formatTime = (seconds: number) => {
    return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
}

</script>

<style>
</style>
