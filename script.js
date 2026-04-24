document.addEventListener('DOMContentLoaded', () => {
    // ---- GALERÍA Y CARGA DE IMÁGENES ----
    const imageUpload = document.getElementById('imageUpload');
    const galleryGrid = document.getElementById('galleryGrid');

    imageUpload.addEventListener('change', (e) => {
        const files = e.target.files;
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (!file.type.startsWith('image/')) continue; // Solo imágenes

            const reader = new FileReader();
            reader.onload = (event) => {
                const imgContainer = document.createElement('div');
                imgContainer.className = 'gallery-item';
                
                const img = document.createElement('img');
                img.src = event.target.result;
                img.alt = 'Nuevo Detalle';
                
                imgContainer.appendChild(img);
                // Añadir al principio de la galería
                galleryGrid.insertBefore(imgContainer, galleryGrid.firstChild);
            };
            reader.readAsDataURL(file);
        }
    });

    // ---- SISTEMA DE RESEÑAS CON ESTRELLAS ----
    const starRating = document.getElementById('starRating');
    const stars = starRating.querySelectorAll('i');
    let currentRating = 0;

    stars.forEach(star => {
        star.addEventListener('click', () => {
            currentRating = parseInt(star.getAttribute('data-rating'));
            updateStars(currentRating);
        });
        
        star.addEventListener('mouseenter', () => {
            const hoverRating = parseInt(star.getAttribute('data-rating'));
            updateStars(hoverRating);
        });
        
        star.addEventListener('mouseleave', () => {
            updateStars(currentRating);
        });
    });

    function updateStars(rating) {
        stars.forEach(star => {
            if (parseInt(star.getAttribute('data-rating')) <= rating) {
                star.classList.add('active');
            } else {
                star.classList.remove('active');
            }
        });
    }

    const submitReviewBtn = document.getElementById('submitReviewBtn');
    const reviewsList = document.getElementById('reviewsList');
    const reviewName = document.getElementById('reviewName');
    const reviewText = document.getElementById('reviewText');

    submitReviewBtn.addEventListener('click', () => {
        if (currentRating === 0) {
            alert("Por favor, selecciona una calificación de estrellas.");
            return;
        }
        if (!reviewName.value.trim() || !reviewText.value.trim()) {
            alert("Por favor, completa tu nombre y la reseña.");
            return;
        }

        const newReview = document.createElement('div');
        newReview.className = 'review-card glass-panel';
        
        // Crear las estrellitas HTML dinámicamente
        let starsHtml = '';
        for(let i=1; i<=5; i++) {
            if(i <= currentRating) {
                starsHtml += '<i class="fas fa-star" style="color:var(--secondary-color)"></i>';
            } else {
                starsHtml += '<i class="fas fa-star" style="color:#ccc"></i>';
            }
        }

        newReview.innerHTML = `
            <div class="stars">${starsHtml}</div>
            <h4>${reviewName.value}</h4>
            <p>"${reviewText.value}"</p>
        `;

        reviewsList.insertBefore(newReview, reviewsList.firstChild);

        // Limpiar formulario y estrellas
        reviewName.value = '';
        reviewText.value = '';
        currentRating = 0;
        updateStars(0);
    });

    // ---- CHAT BOT - RESPUESTA AUTOMÁTICA ----
    const chatHeader = document.getElementById('chatHeader');
    const chatContainer = document.getElementById('chatContainer');
    const chatToggle = document.getElementById('chatToggle');
    
    // Minimizar / Maximizar chat
    chatHeader.addEventListener('click', () => {
        chatContainer.classList.toggle('minimized');
        chatToggle.classList.toggle('fa-chevron-up');
        chatToggle.classList.toggle('fa-chevron-down');
    });

    const chatSend = document.getElementById('chatSend');
    const chatInput = document.getElementById('chatInput');
    const chatBody = document.getElementById('chatBody');

    // Mensaje automático predefinido
    const defaultBotReply = "¡Gracias por escribirnos! En breve un asesor te atenderá personalmente. Para atención inmediata o pedidos 100% personalizados, no dudes en escribir a nuestro WhatsApp directamente al 3205968774.";

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.innerHTML = `<p>${text}</p>`;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function handleChat() {
        const text = chatInput.value.trim();
        if (!text) return;

        // Mostrar mensaje del usuario
        appendMessage('user', text);
        chatInput.value = '';

        // Simular que el bot está escribiendo por 1.5s
        setTimeout(() => {
            appendMessage('bot', "Escribiendo...");
            
            setTimeout(() => {
                // Remover el mensaje de "Escribiendo..."
                chatBody.removeChild(chatBody.lastChild);
                // Mostrar la respuesta automática del bot
                appendMessage('bot', defaultBotReply);
            }, 1000);
            
        }, 500);
    }

    chatSend.addEventListener('click', handleChat);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleChat();
    });
});
