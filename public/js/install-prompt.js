let deferredPrompt;

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/js/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered:', registration);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

window.addEventListener('beforeinstallprompt', (e) => {

    // 이벤트를 막아, 브라우저가 자동으로 설치 권장을 하지 않도록 설정
    e.preventDefault();
    deferredPrompt = e;

    // 설치 권장 버튼 표시 (원하는 UI 요소에 따라 변경)
    const installButton = document.querySelector('#installButton');
    installButton.classList.remove('d-none');

    installButton.addEventListener('click', () => {
        // 유저가 설치 버튼을 눌렀을 때 설치 권장 팝업 트리거
        deferredPrompt.prompt();

        // 유저의 응답 처리
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            deferredPrompt = null;
        });
    });
});
