<script setup>
import { useRouter } from 'vue-router';
import { onMounted, ref, watchEffect } from 'vue'
import { auth, onAuthStateChanged, signOut } from '../firebase/config';
import { URL_FRONTEND } from '../assets/utils';
import Swal from 'sweetalert2';

const router = useRouter()
const email_firebase = ref('')
const Ventas = ref([])
const Compras = ref([])
const Reportes = ref(0)

onAuthStateChanged(auth, (user) => {
    if (user) {
        email_firebase.value = user.email
    } else {
        router.push({ name: 'home' })
    }
})

watchEffect(() => {
    if (email_firebase.value) {
        queryVentas(email_firebase.value)
    }
})

const queryVentas = (e) => {
    let email = e
    // Reportes
    fetch(`${URL_FRONTEND}reporte.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "consulta=true&email=" + email
    }).then(e => e.json())
        .then(e => {
            Reportes.value = e.total
        })
    // 
    fetch(`${URL_FRONTEND}venta.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "email=" + email.trim()
    }).then(e => e.json())
        .then(e => Ventas.value = e)

    // Compras
    fetch(`${URL_FRONTEND}compra.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "email=" + email.trim()
    }).then(e => e.json())
        .then(e => Compras.value = e)
}

// Convertir a unidad informatica
function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

// Formato fecha
const DateFormater = (e) => {
    return `${(new Date(parseInt(e)))}`.slice(0, 24)
}

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

// info reportes

const infoReportes = () => {
    Swal.fire({
        icon: 'info',
        title: 'Sobre reportes',
        html: `
            <div class='py-3'>
                <p class='lead'>
                    Si su cuenta es bloqueada por estafa no podrá usar el actual correo electrónico para vender sus trabajos por medio de esta plataforma y su dirección IP será restringida.
                </p>
            </div>
        `,
        showConfirmButton: false
    })
}
</script>

<template>
    <div class="container-fluid bg-light min-vh-100 p-5 c">
        <div class="">
            <div class="d-flex align-items-center justify-content-between">
                <h2 class="py-2">Perfil y movimientos</h2>
                <span>
                    <button type="button" class="btn position-relative mx-3" @click="infoReportes">
                        Reports
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                            {{ Reportes }}
                            <span class="visually-hidden">unread messages</span>
                        </span>
                    </button>
                    <button class="btn border" @click="salir">
                        <i class="bi bi-box-arrow-right"></i>
                        <small class="mx-2">Salir</small>
                    </button>
                </span>
            </div>

            <router-link :to="'/'" class="btn">
                <i class="bi bi-house-door-fill"></i>
            </router-link>
            <!--  -->
            <div class="wrapper p-5 bg-white cc">
                <h4>Shopping list</h4>
                <p v-if="Compras">
                <details v-for="item, index of Compras" :key="index">
                    <summary>
                        <b>{{ item._filename }}</b>
                        <small class="bg-info px-2 mx-2">{{ DateFormater(item.hash_id) }}</small>
                    </summary>
                    <div class="table-responsive bg-light p-3 my-2">
                        <table class="table p-3">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">OrderID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">PayPal</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-truncate">
                                        <router-link :to="'/file/' + item.hash_id">{{ item.hash_id }}</router-link>
                                    </td>
                                    <td class="text-truncate">{{ item.orderID }}</td>
                                    <td class="text-truncate">{{ item._filename }}</td>
                                    <td class="text-truncate">{{ item._email_paypal }}</td>
                                    <td class="text-truncate">{{ item._description }}</td>
                                    <td class="text-truncate"> $ {{ item._price }} USD</td>
                                    <td class="text-truncate">{{ formatBytes(item._size) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </details>
                </p>
                <p v-else>No history</p>
            </div>
            <!--  -->

            <div class="wrapper p-5 bg-white my-3 cc">
                <h4>Sale items</h4>
                <p v-if="Ventas">
                <details v-for="item, index of Ventas" :key="index">
                    <summary>
                        <b>{{ item._filename }}</b>
                        <small class="bg-info px-2 mx-2">{{ DateFormater(item.hash_id) }}</small>
                    </summary>
                    <div class="table-responsive bg-light p-3 my-2">
                        <table class="table p-3">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">PayPal</th>
                                    <th scope="col">Description</th>
                                    <th scope="col">Price</th>
                                    <th scope="col">Size</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-truncate">
                                        <router-link :to="'/file/' + item.hash_id">{{ item.hash_id }}</router-link>
                                    </td>
                                    <td class="text-truncate">{{ item._filename }}</td>
                                    <td class="text-truncate">{{ item._email_paypal }}</td>
                                    <td class="text-truncate">{{ item._description }}</td>
                                    <td class="text-truncate"> $ {{ item._price }} USD</td>
                                    <td class="text-truncate">{{ formatBytes(item._size) }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </details>
                </p>
                <p v-else>No history</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@media (max-width: 700px) {
    .c {
        width: 100% !important;
        padding: 10px !important;
    }

    .cc {
        padding: 20px !important;
    }
}
</style>