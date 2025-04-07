console.log("Popup script running!");

document.addEventListener('DOMContentLoaded', () => {
    const messageDiv = document.getElementById('message');
    if (messageDiv) {
        messageDiv.textContent = 'This content is from the popup script!';
    }
});

