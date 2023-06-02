<script setup>
import { ref, onMounted } from 'vue';

const Ventas = ref([])
const Compras = ref([])

onMounted(() => {
    let dataVentas = JSON.parse(localStorage.getItem('history'))
    let dataCompras = JSON.parse(localStorage.getItem('compras'))

    if (dataVentas && dataVentas.ID && !Array.isArray(dataVentas)) {
        Ventas.value = [dataVentas]
    } else {
        Ventas.value = dataVentas
    }

    if (dataCompras && dataCompras.id_file && !Array.isArray(dataCompras)) {
        Compras.value = [dataCompras]
    } else {
        Compras.value = dataCompras
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
</script>

<template>
    <div class="container-fluid bg-light min-vh-100">
        <div class="container">
            <h2 class="py-5">History Local</h2>
            
            <div class="wrapper">
                <h4>Shopping list</h4>
                <p v-if="Compras">
                <details v-for="item, index of Compras" :key="index">
                    <summary>
                        <b>{{ item.file_name }}</b>
                    </summary>
                    <div class="table-responsive bg-white p-3 my-2">
                        <table class="table p-3">
                            <thead class="thead-dark">
                                <tr>
                                    <th scope="col">ID</th>
                                    <th scope="col">Order ID</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">PayPal</th>
                                    <th scope="col">Price</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="text-truncate">
                                        <router-link :to="'/file/' + item.id_file">{{ item.id_file }}</router-link>
                                    </td>
                                    <td class="text-truncate"> <a :title="item.orderID">{{ item.orderID }}</a> </td>
                                    <td class="text-truncate">{{ item.file_name }}</td>
                                    <td class="text-truncate">{{ item.email_paypal }}</td>
                                    <td class="text-truncate"> $ {{ item.monto }} USD</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </details>
                </p>
                <p v-else>No History</p>
            </div>

            <div class="wrapper my-5">
                <h4>Sale items</h4>
                <p v-if="Ventas">
                <details v-for="item, index of Ventas" :key="index">
                    <summary>
                        <b>{{ item._filename }}</b>
                    </summary>
                    <div class="table-responsive bg-white p-3 my-2">
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
                                        <router-link :to="'/file/' + item.ID">{{ item.ID }}</router-link>
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