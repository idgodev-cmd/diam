
// Basic PWA reload script
import { registerSW } from 'virtual:pwa-register'

registerSW({
    immediate: true,
    onNeedRefresh() {
        // Show a prompt to user
        console.log('New content available, click to reload')
    },
    onOfflineReady() {
        console.log('App ready to work offline')
    },
})
