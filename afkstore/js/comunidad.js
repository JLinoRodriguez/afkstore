document.addEventListener('DOMContentLoaded', () => {
    // 1. Catálogo de Juegos Disponibles para Reseñas
    const AVAILABLE_GAMES = [
        { id: "god-of-war", title: "God of War Ragnarök" },
        { id: "baldurs-gate-3", title: "Baldur's Gate 3" },
        { id: "resident-evil-9", title: "Resident Evil 9" },
        { id: "subnautica-2", title: "Subnautica 2" },
        { id: "dota-2", title: "Dota 2" },
        { id: "gta-v", title: "Grand Theft Auto V" },
        { id: "monster-hunter-wilds", title: "Monster Hunter Wilds" },
        { id: "fc-26", title: "EA SPORTS FC 26" },
        { id: "outlast", title: "Outlast" },
        { id: "dead-space", title: "Dead Space" }
    ];

    // 2. Juegos en Tendencia (Sidebar)
    const TRENDING_GAMES = [
        { title: "Baldur's Gate 3", rating: "96%", img: "../imgs/baldurs gate 3.jpeg", id: "baldurs-gate-3" },
        { title: "God of War Ragnarök", rating: "92%", img: "../imgs/god-of-war-ragnarok_e91t.jpg", id: "god-of-war" },
        { title: "Resident Evil 9", rating: "88%", img: "../imgs/re9.jpg", id: "resident-evil-9" }
    ];

    // 3. Publicaciones por defecto (Base de Datos inicial)
    const DEFAULT_POSTS = [
        {
            id: "post-1",
            author: "Gaaaa_Gamer99",
            avatar: "https://i.pravatar.cc/150?img=33",
            date: "Hace 2 horas",
            game: "Dota 2",
            rating: 3,
            content: "Mid or feed mano. Me fui AFK porque mi viejita me mandó a comprar pan y mis patas me reportaron. La comunidad es tóxica pero el juego es god.",
            likes: 45,
            likedByUser: false,
            comments: [
                { author: "Kratos_Abancay99", avatar: "https://i.pravatar.cc/150?img=11", content: "Clásico de dotita, jajaja. Reportado por no comprar BKB.", date: "Hace 1 hora" }
            ]
        },
        {
            id: "post-2",
            author: "Lucía_Maga",
            avatar: "https://i.pravatar.cc/150?img=5",
            date: "Hace 5 horas",
            game: "Baldur's Gate 3",
            rating: 5,
            content: "Mucha lectura causa, parece que estoy en la universidad de nuevo, pero está chévere tirarle los dados a los jefes. 10/10 el oso.",
            likes: 120,
            likedByUser: false,
            comments: []
        },
        {
            id: "post-3",
            author: "ZombieSlayer",
            avatar: "https://i.pravatar.cc/150?img=12",
            date: "Ayer",
            game: "Resident Evil 9",
            rating: 4,
            content: "Se me salió el corazón en el primer screamer. Jugué a las 3 AM con audífonos y terminé despertando a todo mi barrio del grito. Recomendadísimo.",
            likes: 89,
            likedByUser: false,
            comments: []
        },
        {
            id: "post-4",
            author: "Buzo_Pro",
            avatar: "https://i.pravatar.cc/150?img=44",
            date: "Ayer",
            game: "Subnautica 2",
            rating: 5,
            content: "Me da una ansiedad brutal el agua oscura. Casi rompo el monitor cuando me salió el bicho gigante por la espalda. Hermoso pero me dejó traumas.",
            likes: 210,
            likedByUser: false,
            comments: []
        }
    ];

    // Variables de Estado
    let posts = JSON.parse(localStorage.getItem('communityPosts')) || DEFAULT_POSTS;
    if (!localStorage.getItem('communityPosts')) {
        localStorage.setItem('communityPosts', JSON.stringify(posts));
    }

    let selectedRating = 0;

    // Elementos del DOM
    const selectJuego = document.getElementById('review-game-select');
    const starsSelector = document.getElementById('submit-stars-selector');
    const reviewTextArea = document.getElementById('review-text-area');
    const btnPublish = document.getElementById('btn-publish-review');
    const muroComunidad = document.getElementById('muro-comunidad');
    const sidebarTrending = document.getElementById('sidebar-trending-games');
    const totalReviewsCount = document.getElementById('total-reviews-count');

    const greetingAlias = document.getElementById('greeting-alias');
    const crearPostAvatar = document.getElementById('crear-post-avatar');

    // 4. Inicializar Datos del Usuario
    function initProfile() {
        const profile = JSON.parse(localStorage.getItem('userProfile')) || {
            alias: "Kratos_Abancay99",
            avatar: "https://i.pravatar.cc/150?img=11"
        };
        if (greetingAlias) greetingAlias.textContent = profile.alias;
        if (crearPostAvatar) crearPostAvatar.src = profile.avatar;
        if (reviewTextArea) {
            reviewTextArea.placeholder = `¿Qué estás jugando, ${profile.alias}? Escribe una reseña...`;
        }
    }

    // 5. Poblar el Select de Juegos
    function initGameSelect() {
        if (!selectJuego) return;
        AVAILABLE_GAMES.forEach(game => {
            const opt = document.createElement('option');
            opt.value = game.title;
            opt.textContent = game.title;
            selectJuego.appendChild(opt);
        });
    }

    // 6. Poblar Sidebar de Tendencias
    function initSidebar() {
        if (!sidebarTrending) return;
        sidebarTrending.innerHTML = '';
        TRENDING_GAMES.forEach(game => {
            sidebarTrending.innerHTML += `
                <a href="juegopag.html?game=${game.id}" class="sidebar-game-card">
                    <img src="${game.img}" alt="${game.title}">
                    <div class="sidebar-game-info">
                        <h4>${game.title}</h4>
                        <span><i class="fa-solid fa-thumbs-up"></i> ${game.rating} positivas</span>
                    </div>
                </a>
            `;
        });
    }

    // 7. Manejo del Selector de Estrellas
    function initStarsSelector() {
        if (!starsSelector) return;
        const stars = starsSelector.querySelectorAll('i');
        
        stars.forEach(star => {
            star.addEventListener('click', (e) => {
                selectedRating = parseInt(e.target.getAttribute('data-rating'));
                updateStarsDisplay(stars, selectedRating);
            });

            star.addEventListener('mouseenter', (e) => {
                const hoverRating = parseInt(e.target.getAttribute('data-rating'));
                updateStarsDisplay(stars, hoverRating);
            });
        });

        starsSelector.addEventListener('mouseleave', () => {
            updateStarsDisplay(stars, selectedRating);
        });
    }

    function updateStarsDisplay(starsElements, rating) {
        starsElements.forEach((star, idx) => {
            if (idx < rating) {
                star.className = 'fa-solid fa-star active';
            } else {
                star.className = 'fa-regular fa-star';
            }
        });
    }

    // 8. Renderizar el Muro de Publicaciones
    function renderFeed() {
        if (!muroComunidad) return;
        muroComunidad.innerHTML = '';
        
        // Actualizar contador total de reseñas
        if (totalReviewsCount) {
            totalReviewsCount.textContent = posts.length;
        }

        posts.forEach(post => {
            // Estrellas HTML
            let starsHTML = '';
            for (let i = 1; i <= 5; i++) {
                if (i <= post.rating) {
                    starsHTML += '<i class="fa-solid fa-star"></i>';
                } else {
                    starsHTML += '<i class="fa-regular fa-star"></i>';
                }
            }

            // Comentarios HTML
            let commentsHTML = '';
            post.comments.forEach(comment => {
                commentsHTML += `
                    <div class="comunidad-comentario-item">
                        <img src="${comment.avatar}" alt="${comment.author}" class="avatar-comentario">
                        <div class="comentario-detalles">
                            <div class="comentario-meta">
                                <strong>${comment.author}</strong>
                                <span>${comment.date}</span>
                            </div>
                            <p>${comment.content}</p>
                        </div>
                    </div>
                `;
            });

            const likeActive = post.likedByUser ? 'active' : '';
            const thumbsIcon = post.likedByUser ? 'fa-solid fa-thumbs-up' : 'fa-regular fa-thumbs-up';

            muroComunidad.innerHTML += `
                <article class="tarjeta-comunidad" id="${post.id}">
                    <div class="header-post">
                        <img src="${post.avatar}" alt="Avatar" class="avatar">
                        <div class="info-usuario-post">
                            <h4>${post.author}</h4>
                            <span>${post.date}</span>
                        </div>
                        <div class="juego-etiqueta">${post.game}</div>
                    </div>
                    
                    <div class="estrellas">
                        ${starsHTML}
                    </div>
                    
                    <p class="post-content-body">${post.content}</p>
                    
                    <div class="interacciones">
                        <span class="btn-like ${likeActive}" data-post-id="${post.id}">
                            <i class="${thumbsIcon}"></i> <span class="likes-count">${post.likes}</span>
                        </span>
                        <span class="btn-comment-toggle" data-post-id="${post.id}">
                            <i class="fa-solid fa-comment"></i> <span>${post.comments.length}</span>
                        </span>
                    </div>

                    <!-- Panel de Comentarios -->
                    <div class="comunidad-comentarios-panel" id="comments-${post.id}" style="display: none;">
                        <div class="lista-comentarios">
                            ${commentsHTML}
                        </div>
                        <div class="comentarios-input-row">
                            <input type="text" placeholder="Escribe un comentario..." class="input-comentario-texto" id="input-text-${post.id}">
                            <button class="boton-perfil btn-send-comment" data-post-id="${post.id}">
                                <i class="fa-solid fa-paper-plane"></i>
                            </button>
                        </div>
                    </div>
                </article>
            `;
        });

        // Enlazar Eventos Dinámicos
        bindPostEvents();
    }

    function bindPostEvents() {
        // Eventos de Like
        const likes = muroComunidad.querySelectorAll('.btn-like');
        likes.forEach(likeBtn => {
            likeBtn.addEventListener('click', (e) => {
                const btn = e.currentTarget;
                const postId = btn.getAttribute('data-post-id');
                toggleLike(postId, btn);
            });
        });

        // Eventos de Desplegar Comentarios
        const commentToggles = muroComunidad.querySelectorAll('.btn-comment-toggle');
        commentToggles.forEach(toggleBtn => {
            toggleBtn.addEventListener('click', (e) => {
                const postId = e.currentTarget.getAttribute('data-post-id');
                const panel = document.getElementById(`comments-${postId}`);
                if (panel) {
                    if (panel.style.display === 'none') {
                        panel.style.display = 'block';
                    } else {
                        panel.style.display = 'none';
                    }
                }
            });
        });

        // Eventos de Enviar Comentario
        const sendCommentBtns = muroComunidad.querySelectorAll('.btn-send-comment');
        sendCommentBtns.forEach(sendBtn => {
            sendBtn.addEventListener('click', (e) => {
                const postId = e.currentTarget.getAttribute('data-post-id');
                submitComment(postId);
            });
        });

        // Permitir enviar comentario con Enter
        const commentInputs = muroComunidad.querySelectorAll('.input-comentario-texto');
        commentInputs.forEach(input => {
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    const postId = e.target.id.replace('input-text-', '');
                    submitComment(postId);
                }
            });
        });
    }

    // 9. Lógica de Likes
    function toggleLike(postId, element) {
        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const post = posts[postIndex];
        if (post.likedByUser) {
            post.likes--;
            post.likedByUser = false;
            element.classList.remove('active');
            element.querySelector('i').className = 'fa-regular fa-thumbs-up';
        } else {
            post.likes++;
            post.likedByUser = true;
            element.classList.add('active');
            element.querySelector('i').className = 'fa-solid fa-thumbs-up';
        }

        element.querySelector('.likes-count').textContent = post.likes;
        localStorage.setItem('communityPosts', JSON.stringify(posts));
    }

    // 10. Lógica de Comentarios
    function submitComment(postId) {
        const input = document.getElementById(`input-text-${postId}`);
        if (!input) return;

        const text = input.value.trim();
        if (!text) return;

        const postIndex = posts.findIndex(p => p.id === postId);
        if (postIndex === -1) return;

        const profile = JSON.parse(localStorage.getItem('userProfile')) || {
            alias: "Kratos_Abancay99",
            avatar: "https://i.pravatar.cc/150?img=11"
        };

        const newComment = {
            author: profile.alias,
            avatar: profile.avatar,
            content: text,
            date: "Hace un momento"
        };

        posts[postIndex].comments.push(newComment);
        localStorage.setItem('communityPosts', JSON.stringify(posts));
        
        // Limpiar input
        input.value = '';

        // Re-renderizar feed y abrir panel de comentarios de esta publicación
        renderFeed();
        const panel = document.getElementById(`comments-${postId}`);
        if (panel) panel.style.display = 'block';
    }

    // 11. Publicar Nueva Reseña
    if (btnPublish) {
        btnPublish.addEventListener('click', () => {
            const game = selectJuego.value;
            const text = reviewTextArea.value.trim();

            if (!game) {
                alert("Por favor, selecciona qué juego estás reseñando.");
                return;
            }

            if (selectedRating === 0) {
                alert("Por favor, selecciona una valoración con estrellas.");
                return;
            }

            if (!text) {
                alert("Escribe una reseña o comentario para poder publicar.");
                return;
            }

            const profile = JSON.parse(localStorage.getItem('userProfile')) || {
                alias: "Kratos_Abancay99",
                avatar: "https://i.pravatar.cc/150?img=11"
            };

            const newPost = {
                id: "post-" + Date.now(),
                author: profile.alias,
                avatar: profile.avatar,
                date: "Hace un momento",
                game: game,
                rating: selectedRating,
                content: text,
                likes: 0,
                likedByUser: false,
                comments: []
            };

            // Añadir al principio del muro
            posts.unshift(newPost);
            localStorage.setItem('communityPosts', JSON.stringify(posts));

            // Resetear el formulario
            selectJuego.value = '';
            selectedRating = 0;
            const stars = starsSelector.querySelectorAll('i');
            updateStarsDisplay(stars, 0);
            reviewTextArea.value = '';

            // Renderizar de nuevo
            renderFeed();
            alert("¡Tu reseña se ha publicado con éxito!");
        });
    }

    // Inicializaciones
    initProfile();
    initGameSelect();
    initSidebar();
    initStarsSelector();
    renderFeed();
});
