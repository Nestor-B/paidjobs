<script setup>
import { ref, watchEffect, computed } from 'vue';
import { auth, onAuthStateChanged } from '../firebase/config'
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'
import { URL_FRONTEND } from '../assets/utils';

const router = useRouter()
const isLogged = ref(false)
const isValidEmail = ref(false)
const price = ref('1.00')
const email = ref('sb-uxxdg15885974@personal.example.com')
const description = ref('')
const attributes = ref({})
const isSubmit = ref(false)
const showLoadingFile = ref(false)
const percentage = ref(10)
const email_firebase = ref('')

onAuthStateChanged(auth, (user) => {
    if (user) {
        isLogged.value = true
        email_firebase.value = user.email
    } else {
        isLogged.value = false
    }
})

const submit = () => {
    showLoadingFile.value = true
    isSubmit.value = true
    let FILE = document.querySelectorAll('input[type=file]')[0].files[0]
    const formData = new FormData()
    formData.append('ID', Date.now())
    formData.append('_email', email_firebase.value)
    formData.append('_email_paypal', email.value)
    formData.append('_price', price.value)
    formData.append('_filename', FILE.name)
    formData.append('_date', FILE.lastModified)
    formData.append('_size', FILE.size)
    formData.append('_type', FILE.type)
    formData.append('_description', description.value)
    formData.append('file', FILE)

    fetch(`${URL_FRONTEND}upload.php`, {
        method: 'POST',
        body: formData
    }).then((response) => {
        let reader = response.body.getReader()
        let bytesReceived = 0
        reader.read().then(function processResult(result) {
            if (result.done) {
                isSubmit.value = false
                // ----------
                let JH = {
                    ID: formData.get('ID'),
                    _email_paypal: formData.get('_email_paypal'),
                    _price: formData.get('_price'),
                    _filename: formData.get('_filename'),
                    _date: formData.get('_date'),
                    _size: formData.get('_size'),
                    _description: formData.get('_description')
                }
                if( !localStorage.getItem('history') ) {
                    localStorage.setItem('history', JSON.stringify(JH))
                }else{
                    let lista = []
                    let history = JSON.parse(localStorage.getItem('history'))
                    lista.push( JH, history )
                    localStorage.setItem('history', JSON.stringify( lista ))
                }
                // ----------
                setTimeout(e => {
                    percentage.value = 0
                    showLoadingFile.value = false
                    Swal.fire({
                        icon: 'success',
                        title: 'Archivo almacenado',
                        text: '¿Le gustaría ir al link del archivo?',
                        confirmButtonText: 'Ir al link',
                        showCancelButton: true,
                        confirmButtonColor: '#0d6efd'
                    }).then((result) => {
                        if( result.isConfirmed ) {
                            router.push({ name: 'file', params: { id: formData.get('ID') } })
                        }
                    })
                }, 2000)
                return
            }
            bytesReceived += result.value.length
            percentage.value = parseInt(bytesReceived / FILE.size * 100)
            // console.log(percentage.value)
            return reader.read().then(processResult)
        });
    }).catch(e => {
        alert( JSON.stringify(e) )
    })
}

const fileSelected = (event) => {
    const file = event.target.files[0]
    if( file.size >= 7000000 ) {
        Swal.fire({
            icon: 'warning',
            title: 'Tamaño no permitido!',
            html: `
                <div>
                    <div>El archivo sobre pasa el peso permitido.</div>
                    <small>Intente con un archivo de menos de 7 Megabytes.</small>
                </div>
            `,
            confirmButtonColor: '#044f9b'
        })
        return
    }
    if (/(zip|7z|rar)/.test(file.type)) {
        const { lastModified, lastModifiedDate, name, size, type } = file
        attributes.value = { lastModified, lastModifiedDate, name, size, type }
    } else {
        alert('Tipo de archivo no permitido!')
    }
}

watchEffect(() => {
    if (/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email.value)) {
        isValidEmail.value = true
    } else {
        isValidEmail.value = false
    }
})

const changePrice = (event) => {
    if (price.value) {
        let [entero, decimal] = event.target.value.split('.')
        decimal ? (price.value = `${entero}.${decimal.slice(0, 2)}`) : (price.value = `${entero}.00`)
    } else {
        price.value = '1.00'
    }
}

const DateFormater = (e) => {
    return `${(new Date(e))}`.slice(0, 24)
}

function formatBytes(bytes, decimals = 2) {
    if (!+bytes) return '0 Bytes'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']

    const i = Math.floor(Math.log(bytes) / Math.log(k))

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}

const perfil = () => {
    if( email_firebase.value ) router.push({name: 'perfil'})
    else { router.push({name: 'login'}) }
}

const validarEmailPaypal = (event) => {
    let email = event.target.value
    fetch(`${URL_FRONTEND}reporte.php`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "verificarReporte=true&email=" + email
    }).then(e => e.json())
    .then(e => {
        e.total >= "3" && Swal.fire( {
            icon: 'warning',
            title: 'Email bloqueado!!',
            text: 'Este email ha sido reportado en uso de estafa.',
            showConfirmButton: false
        } )
    })
}

const C = computed(() => {
    return "--value:" + percentage.value
})
</script>

<template>
    <div class="bg-light">

        <div class="fixed-top vh-100 bg-light d-flex justify-content-center align-items-center" style="z-index: 1000000000;"
            v-if="showLoadingFile">
            <div class="d-flex flex-column justify-content-center align-items-center">
                <div role="progressbar" :aria-valuenow="percentage" aria-valuemin="0" aria-valuemax="100" :style="C"></div>
                <p class="p-3">Cargando archivo</p>
            </div>
        </div>

        <div class="fixed-top">
            <div class="d-flex justify-content-end p-4">
                <button class="btn btn-light border rounded-circle mx-3" v-if="!isLogged" @click="router.push({name: 'historylocal'})">
                    <i class="bi bi-clock-history" style="font-size: 23px;"></i>
                </button>
                <button class="btn btn-light border rounded-circle" @click="perfil">
                    <i class="bi bi-person-fill" style="font-size: 23px;"></i>
                </button>
            </div>
        </div>

        <div class="p-2 wrapper-global d-flex justify-content-center align-items-center flex-column min-vh-100 ">
            <div class="mt-5">
                <h2 class="text-center display-4 my-4">Bienvenido!</h2>
                <p class="text-center container">Puedes vender tus archivos o trabajos electrónicos vía
                    PayPal. Simplemente comprime a <a href="https://www.7-zip.org/" target="_blank"
                        rel="noopener noreferrer">zip</a> , 7z o <a href="https://www.winrar.es/descargas" target="_blank"
                        rel="noopener noreferrer">rar</a>, coloca un precio a tu trabajo y comparte el link de venta con
                    quien quiera comprar.</p>
            </div>
            <button class="my-3 btn btn-primary d-flex align-items-center flex-column p-0 border-0 position-relative"
                style="overflow: hidden;">
                <div class="d-flex">
                    <div class="p-2 px-3" style="background: rgba(0,0,0,.2);">
                        <i class="bi bi-file-earmark-zip-fill"></i>
                    </div>
                    <div class="bg- p-2 px-4">
                        {{ attributes.name ? 'Elegir Otro' : 'Subir Archivo' }}
                    </div>
                </div>
                <input type="file" class="position-absolute p-3 w-100" @change="fileSelected" style="opacity: 0;">
            </button>
            <div class="container p-5" v-if="attributes.name">
                <table class="table table-bordered">
                    <thead>
                        <tr>
                            <th scope="col">Name</th>
                            <th scope="col">lastModified</th>
                            <th scope="col">size</th>
                            <th scope="col">type</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td> {{ attributes.name }} </td>
                            <td> {{ DateFormater(attributes.lastModified) }} </td>
                            <td> {{ formatBytes(attributes.size) }} </td>
                            <td> {{ attributes.type }} </td>
                        </tr>
                    </tbody>
                </table>

                <div class="my-5">
                    <div>
                        <h6>Datos adiccionales para la venta</h6>
                    </div>
                    <div class="d-flex rounded align-items-center">

                        <div>
                            <input type="email" class="form-control"
                                :class="[!isValidEmail && email.length > 0 ? 'border  border-danger' : '']"
                                placeholder="Correo PayPal" v-model="email" autocomplete="" @input="validarEmailPaypal" @click="validarEmailPaypal">
                        </div>

                        <div class="d-flex align-items-center mx-3">
                            <input v-model="price" type="number" class="border-0 form-control"
                                style="max-width: 150px;border: 1px solid;box-shadow: 0 0 5px yellow;" min="1" max="5000"
                                step="0.01" @change="changePrice" />
                            <span class="d-inline-block px-0 py-1 rounded-circle bi bi-currency-dollar "
                                style="font-size: 22px;"></span>
                        </div>

                    </div>

                    <textarea class="form-control mt-3" placeholder="Descripcion 0/300 letras" rows="5"
                        v-model="description"></textarea>

                    <div class="d-flex align-items-center">
                        <button
                            class="my-3 btn btn-warning d-flex align-items-center flex-column p-0 border-0 position-relative"
                            style="overflow: hidden;" @click="submit" :disabled="isSubmit || !isValidEmail">
                            <div class="d-flex align-items-center">
                                <div class="p-2 px-3" style="background: rgba(0,0,0,.0);">
                                    <img src="https://i.stack.imgur.com/OTRii.gif" width="30" alt=""
                                        :style="{ opacity: isSubmit ? '1' : '0' }">
                                </div>
                                <div class="bg- p-2 px-4">
                                    Procesar archivo
                                </div>
                                <div class="p-2 px-3" style="background: rgba(0,0,0,.0);width: 60px;">
                                    <!-- <i class="bi bi-file-earmark-zip-fill"></i> -->
                                </div>
                            </div>
                        </button>
                        <small class="mx-3">
                            Los archivos se almacenan de manera personal.
                        </small>
                    </div>

                </div>
                <p class="text-center text-secondary px-3">
                    <small>
                        Si no posees una cuenta para iniciar sesión puedes hacerlo aquí. Si no tienes una sesión iniciada no
                        se
                        crearán registros o movimientos de tus archivos para consultalos luego.
                    </small>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.wrapper-global {
    max-width: 1000px !important;
    margin: auto;
}

tr,
td,
th {
    white-space: nowrap;
    max-width: 40px !important;
    overflow: hidden;
    text-overflow: ellipsis;
}

td {
    background: white;
}
</style>