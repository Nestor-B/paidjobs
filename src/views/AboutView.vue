<script setup>
    import { auth, onAuthStateChanged } from '../firebase/config';
    import { useRouter } from 'vue-router';

    const router = useRouter()
    onAuthStateChanged(auth, (user) => { 
        if ( user ) { } else {
            setTimeout( e => router.push({name: 'login'}), 500)
        }
    })
</script>

<template>
    <div class="about">
        <h1>This is an about page</h1>
    </div>
</template>

<style>
@media (min-width: 1024px) {
    .about {
        min-height: 100vh;
        display: flex;
        align-items: center;
    }
}
</style>
