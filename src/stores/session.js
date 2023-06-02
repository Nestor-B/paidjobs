import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useSession = defineStore('session', () => {
    const token = ref('')
    const isToken = computed(() => token.value)
    function setToken(data) {
        token.value = data
    }

    return { token, isToken, setToken }
})
