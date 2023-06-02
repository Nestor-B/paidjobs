<script setup>
import { auth, onAuthStateChanged, signOut } from './firebase/config'
import { URL_FRONTEND } from './assets/utils';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const router = useRouter()

onAuthStateChanged(auth, (user) => {
    if (user) {
        verificarReporteEmail(user.email)
    } else {
        
    }
})

const verificarReporteEmail = (e) => {
    let email = e
    fetch(`${URL_FRONTEND}reporte.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "verificarReporteEmail=true&email=" + email
    }).then(e => e.json())
        .then(e => {
            e.total >= "3" && Swal.fire({
                icon: 'warning',
                title: 'Email bloqueado!!',
                text: 'Este email ha sido reportado en uso de estafa.',
                showConfirmButton: false,
            }).then( () => {
                salir()
            })
        })
}

fetch(`${URL_FRONTEND}delete.php`)

// Cerrar session
const salir = () => {
    signOut(auth).then(() => {
        setTimeout(() => {
            router.push({ name: 'home' })
        }, 1000)
    }).catch((error) => {
        alert(error)
    });
}
</script>

<template>
    <RouterView />
</template>

<style scoped></style>
