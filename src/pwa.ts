
// Basic PWA reload script
import { registerSW } from 'virtual:pwa-register'

registerSW({
    immediate: true,
    onNeedRefresh() {
        console.log('New content available, click to reload')
    },
    onOfflineReady() {
        console.log('App ready to work offline')
    },
})

// PWA Install Logic
let deferredPrompt: any;
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    // Dispatch custom event to notify components
    window.dispatchEvent(new CustomEvent('pwa-installable', { detail: e }));
});

// Helper to trigger install
(window as any).triggerPwaInstall = async () => {
    if (!deferredPrompt) return false;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    deferredPrompt = null;
    return outcome === 'accepted';
};
