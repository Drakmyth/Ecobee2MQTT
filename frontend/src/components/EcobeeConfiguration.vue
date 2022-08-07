<template>
    <div class="ecobee-config">
        <h2>Ecobee Configuration</h2>
        <form>
            <label for="ecobee-appkey">App Key:</label>
            <input type="text" id="ecobee-appkey" name="ecobee-appkey" v-model="appkey" /><br />
            <button @click.prevent=requestPin>Request PIN</button><br />
            <span>PIN: {{ pin }}</span><br />
            <div v-if="authStatus === 'pending'">
                <span v-if="timeremaining > 0">Time Remaining: {{ formatTime(timeremaining) }}</span><br />
                <span v-if="timeremaining <= 0">PIN expired. Please request a new PIN.</span><br />
            </div>
            <span v-if="authStatus === 'authorized'">Account Authorized!</span>
        </form>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import { Ref, ref } from 'vue';
import { io } from 'socket.io-client';

type AuthStatus = 'none' | 'pending' | 'authorized';

const appkey = ref('');
const pin = ref('');
const timeremaining = ref(0);
let timer: number;
let authStatus: Ref<AuthStatus> = ref('none');

const socket = io('ws://localhost:3001');

socket.on('authorized', (arg) => {
    authStatus.value = 'authorized';
    console.log(arg);
});

const requestPin = () => {
    axios.post('http://localhost:3001/api/authorization', {
        appkey: appkey.value,
        scope: 'smartWrite'
    }).then(resp => {
        console.log(resp.data);
        pin.value = resp.data.pin;
        authStatus.value = 'pending';
        timeremaining.value = resp.data.expires_in;
        timer = setInterval(onTimerTick, 1000);
    }).catch(error => {
        console.error(error);
    });
};

const onTimerTick = () => {
    timeremaining.value -= 1;
    if (timeremaining.value <= 0) {
        clearInterval(timer);
    }
};

const formatTime = (seconds: number) => {
    return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
};

</script>

<style>
</style>
