// import { ref } from 'vue'
import { useLocalStorage } from '@vueuse/core'


// export const host = ref('')
export const host = useLocalStorage('host', '')