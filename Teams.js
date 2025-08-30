// Teams-specific JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const playerCards = document.querySelectorAll('.player-card');
    playerCards.forEach(card => {
        card.addEventListener('click', () => {
            // Example: Show modal or navigate
            console.log('Player card clicked:', card.querySelector('.player-caption').textContent);
        });
    });
});