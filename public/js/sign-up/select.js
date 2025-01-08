const studentButton = document.getElementById('student-button');
const businessButton = document.getElementById('business-button');

studentButton.addEventListener('click', () => {
    location.href = '/auth/sign-up/form?ut=student';
});

businessButton.addEventListener('click', () => {
    location.href = '/auth/sign-up/form?ut=business';
});