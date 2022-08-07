<template>
    <div class="ecobee-config">
        <h2>Ecobee Configuration</h2>
        <form>
            <label for="ecobee-appkey">App Key:</label>
            <input type="text" id="ecobee-appkey" name="ecobee-appkey" v-model="appkey" /><br />
            <div v-if="authStatus !== 'authorized'">
                <button @click.prevent=requestPin>Request PIN</button><br />
                <span>PIN: {{ pin }}</span><br />
            </div>
            <div v-if="authStatus === 'pending'">
                <span v-if="timeremaining > 0">Time Remaining: {{ formatTime(timeremaining) }}</span><br />
                <span v-if="timeremaining <= 0">PIN expired. Please request a new PIN.</span><br />
            </div>
            <div v-if="authStatus === 'authorized'">
                <span>Account Authorized!</span>
                <button @click.prevent=clearAuthorization>Re-Authorize</button>
            </div>
        </form>
    </div>
</template>

<script async setup lang="ts">
import axios from 'axios';
import { Ref, ref } from 'vue';
import { io } from 'socket.io-client';

type AuthStatus = 'none' | 'pending' | 'authorized';

interface Authorization {
    appkey: string;
}

interface AuthorizationCreateResponse {
    pin: string,
    expires_in: number;
}

const appkey = ref('');
const pin = ref('');
const timeremaining = ref(0);
let timer: number;
let authStatus: Ref<AuthStatus> = ref('none');

const socket = io('ws://localhost:3001');

socket.on('authorized', (arg) => {
    authStatus.value = 'authorized';
    clearInterval(timer);
    console.log(arg);
});

const initializeAuthorization = async () => {
    const response = await axios.get<Authorization>('http://localhost:3001/api/authorization');
    if (response.status === 200) {
        appkey.value = response.data.appkey;
        authStatus.value = 'authorized';
    } else {
        appkey.value = '';
        authStatus.value = 'none';
        if (response.status === 404) {
            console.error(`Unknown authorization response: ${response}`);
        }
    }
};

const requestPin = () => {
    clearInterval(timer);

    axios.post<AuthorizationCreateResponse>('http://localhost:3001/api/authorization', {
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

const clearAuthorization = () => {
    axios.delete('http://localhost:3001/api/authorization').then(() => {
        appkey.value = '';
        authStatus.value = 'none';
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

await initializeAuthorization();

</script>

<style>
</style>
