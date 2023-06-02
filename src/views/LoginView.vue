<script setup>
import { RouterView, useRouter, useRoute } from 'vue-router'
import { auth, signInWithEmailAndPassword, onAuthStateChanged } from '../firebase/config'
import { onMounted, ref } from 'vue';

const router = useRouter()
const showLoading = ref(true)

onMounted(() => {
    setTimeout(e => showLoading.value = false, 1000)
})

onAuthStateChanged(auth, (user) => {
    if (user) {
        setTimeout(e => router.push({ name: 'home' }), 100)
    } else { }
})

const login = () => {
    signInWithEmailAndPassword(auth, 'luiscanario7@gmail.com', '5766566')
        .then((userCredential) => {
            const user = userCredential.user;
            router.push({ name: "home" })
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorCode)
        });
}
</script>
<template>
    <div v-if="showLoading" class="vh-100 d-flex align-items-center justify-content-center">
        <span>Cargando</span>
    </div>
    <div v-else class="vh-100 bg-light d-flex align-items-center justify-content-center">

        <div class="bg-white p-4 form">
            <router-link :to="'/'" class="btn border">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <h2 class="my-4">Iniciar Sesión</h2>
            <div class="form-group">
                <div class="border px-3 p-1 d-flex align-items-center border rounded">
                    <i class="bi bi-person"></i>
                    <input type="text" class="form-control border-0" placeholder="Correo" />
                </div>
            </div>
            <div class="form-group my-3">
                <div class="border px-3 p-1 d-flex align-items-center border rounded">
                    <i class="bi bi-key"></i>
                    <input type="password" class="form-control border-0" placeholder="Correo" />
                </div>
            </div>
            <div class="my-3 d-flex justify-content-end">
                <router-link to="/login" class="text-decoration-none">
                    <small>¿Olvidaste tu contraseña?</small>
                </router-link>
            </div>
            <div class="form-group my-3">
                <button class="btn btn-lg btn-primary w-100" @click.prevent="login">Entrar</button>
            </div>
            <div class="my-3 d-flex justify-content-center align-items-center ">
                <span>¿Eres nuevo?</span>
                <router-link to="/register" class="mx-1 text-decoration-none">
                    Registrate aquí
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.form {
    min-width: 380px;
}

input {
    outline: 0px solid transparent !important;
    border: 0px solid transparent !important;
    box-shadow: 0 0 0 transparent !important;
}

i {
    font-size: 19px;
}
</style>