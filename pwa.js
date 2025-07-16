// PWA Service Worker Registration
class PWA {
    constructor() {
        this.registerServiceWorker();
        this.setupInstallPrompt();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('sw.js');
                console.log('Service Worker registered successfully:', registration);
            } catch (error) {
                console.log('Service Worker registration failed:', error);
            }
        }
    }

    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent Chrome 67 and earlier from automatically showing the prompt
            e.preventDefault();
            // Stash the event so it can be triggered later
            deferredPrompt = e;
            
            // Show install button or notification
            this.showInstallPrompt();
        });

        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            // Hide the install prompt
            this.hideInstallPrompt();
        });
    }

    showInstallPrompt() {
        // Create install prompt if it doesn't exist
        if (!document.getElementById('install-prompt')) {
            const installPrompt = document.createElement('div');
            installPrompt.id = 'install-prompt';
            installPrompt.className = 'install-prompt';
            installPrompt.innerHTML = `
                <div class="install-content">
                    <p>📱 Install Photo Puzzle for a better experience!</p>
                    <button id="install-btn" class="btn btn-primary">Install App</button>
                    <button id="dismiss-btn" class="btn btn-secondary">Not Now</button>
                </div>
            `;
            
            document.body.appendChild(installPrompt);
            
            // Add event listeners
            document.getElementById('install-btn').addEventListener('click', () => {
                this.installApp();
            });
            
            document.getElementById('dismiss-btn').addEventListener('click', () => {
                this.hideInstallPrompt();
            });
        }
    }

    hideInstallPrompt() {
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.remove();
        }
    }

    async installApp() {
        if (window.deferredPrompt) {
            window.deferredPrompt.prompt();
            const { outcome } = await window.deferredPrompt.userChoice;
            console.log(`User response to the install prompt: ${outcome}`);
            window.deferredPrompt = null;
            this.hideInstallPrompt();
        }
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PWA();
});

// Add CSS for install prompt
const installPromptCSS = `
.install-prompt {
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: white;
    border-radius: 15px;
    padding: 20px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    max-width: 90%;
    animation: slideUp 0.3s ease-out;
}

.install-content {
    text-align: center;
}

.install-content p {
    margin-bottom: 15px;
    font-weight: 500;
}

@keyframes slideUp {
    from {
        transform: translateX(-50%) translateY(100%);
        opacity: 0;
    }
    to {
        transform: translateX(-50%) translateY(0);
        opacity: 1;
    }
}

@media (display-mode: standalone) {
    .install-prompt {
        display: none;
    }
}
`;

// Inject CSS
const style = document.createElement('style');
style.textContent = installPromptCSS;
document.head.appendChild(style); 