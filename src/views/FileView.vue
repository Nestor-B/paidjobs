<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router';
import { loadScript } from "@paypal/paypal-js"
import { auth, onAuthStateChanged } from '../firebase/config';
import { Autenticacion } from '../paypal'
import { URL_FRONTEND } from '../assets/utils'
import Swal from 'sweetalert2';

const route = useRoute()
const router = useRouter()
const email_firebase = ref('')
const file = ref({})

onAuthStateChanged(auth, (user) => {
    if (user) {
        email_firebase.value = user.email
    } else { }
})

const fileWarning = () => {
    Swal.fire({
        icon: 'error',
        title: 'Archivo no encontrado!!',
        html: `
            <div>
                <p>El archivo posiblemente ha caducado.</p>
                <small>Pongase en contacto con su publicador.</small>
            </div>
        `,
        showConfirmButton: false,
    }).then(() => {
        router.push({ name: 'home' })
    })
}

onMounted(() => {
    if (route.params.id) {
        fetch(`${URL_FRONTEND}file.php?id=${route.params.id}`)
            .then(e => e.json())
            .then(e => {
                if( e._block == 1 ) {
                    fileWarning()
                    return
                }
                file.value = e
            }).catch(e => {
                fileWarning()
            })

        loadScript({ "client-id": "AXf3r2N4vwaJcbcqAFqG8yv-py-KFWkR0uZ--kC_UgKTXdC99l3O8uQSJzJtCv8Ao-QBhyYdl8s1Be-j" })
            .then((paypal) => {
                paypal.Buttons({
                    style: {
                        layout: 'vertical',
                        color: 'gold',
                        shape: 'rect',
                        label: 'pay'
                    },
                    createOrder: function (data, actions) {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: file.value._price
                                }
                            }]
                        });
                    },
                    onApprove: function (data, actions) {
                        Autenticacion(data.orderID, file.value._price, file.value._email_paypal, route.params.id, file.value._filename)
                    },
                    onCancel: function (data) {

                    }
                }).render("#paypal-button-container")
            })
    }
})

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const DateFormater = (e) => {
    return `${(new Date(e))}`.slice(0, 24)
}

const report = () => {
    if (email_firebase.value) {
        fetch(`${URL_FRONTEND}reporte.php`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            },
            body: "reportar=true&denunciante=" + email_firebase.value + "&email=" + file.value._email + "&_email_paypal=" + file.value._email_paypal
        }).then(e => e.text())
            .then(e => {
                alert('Se a enviado el reporte!')
            })
    } else {
        alert('Necesitas tener una cuenta para emitir un reporte!')
    }
}
</script>

<template>
    <div class="container-fluid bg-light p-4 d-flex align-items-center justify-content-center min-vh-100 flex-column">
        <img src="../assets/logo.png" alt="Logo PaidJobs" width="250" class="my-5">
        <div>
            <p class="d-flex justify-content-between align-items-center">
                <b class="lead" style="text-shadow: 0px 1px 1px gray;">$ {{ file._price }} USD</b>
            </p>
            <p id="_download_"></p>
            <div :title="file.type" class="bg-white border rounded p-3">
                <div class="d-flex align-items-center">
                    <div>
                        <i class="bi bi-file-earmark-zip-fill text-primary display-4"></i>
                    </div>
                    <div class="d-flex justify-content-between position-relative">
                        <div class="text-truncate mx-2"
                            style="width: 270px;font-family:Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif;">
                            <b>{{ file._filename }}</b>
                            <span class="p-2 d-block mx-1 position-absolute"
                                style="left: -5px; bottom: -20px;font-size: 12px;"> Caduca en {{ file._limit }} {{ file._limit == 1?'día':'días' }} </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-secondary d-flex justify-content-between px-2 p-2">
                <small>{{ DateFormater(parseInt(file._date)) }}</small>
                <small>{{ formatBytes(file._size) }}</small>
            </div>
            <div style="max-width: 350px;margin: auto;">
                <details>
                    <summary>Description</summary>
                    <div>
                        <p class="text-secondary mt-2 bg-white p-2" v-if="file._description">
                            {{ file._description }}
                        </p>
                        <p v-else class="text-secondary text-center mt-3">
                            No description!
                        </p>
                    </div>
                </details>
            </div>

            <div class="mt-5">
                <div id="paypal-button-container"></div>
            </div>

            <button class="btn text-danger w-100 my-4" @click="report">Reportar como estafa</button>
        </div>
    </div>
</template>

<style scoped></style>