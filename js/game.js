class GamePage {
    constructor(data) {
        if (new.target === GamePage) {
            throw new TypeError("Cannot construct GamePage instances directly");
        }
        this.data = data;
    }

    getRatingStarsHTML(stars) {
        let starsHTML = '';
        for (let i = 1; i <= 5; i++) {
            if (i <= stars) {
                starsHTML += '<i class="fa-solid fa-star"></i>';
            } else {
                starsHTML += '<i class="fa-regular fa-star"></i>';
            }
        }
        return starsHTML;
    }

    getPriceHTML() {
        if (this.data.price === "Gratis") {
            return `<span class="game-price-tag gratis">Gratis</span>`;
        }
        if (this.data.discount) {
            return `
                <div class="game-price-discount-container">
                    <span class="discount-percentage">${this.data.discount}</span>
                    <div class="discount-prices">
                        <span class="original-price">${this.data.originalPrice}</span>
                        <span class="discount-price">${this.data.price}</span>
                    </div>
                </div>
            `;
        }
        return `<span class="game-price-tag">${this.data.price}</span>`;
    }

    render() {
        const container = document.getElementById('game-content-container');
        if (!container) return;

        // Construir HTML de las reseñas
        let reviewsHTML = '';
        this.data.reviews.forEach(review => {
            reviewsHTML += `
                <div class="tarjeta-reseña">
                    <div class="estrellas">
                        ${this.getRatingStarsHTML(review.rating)}
                    </div>
                    <h3>${review.title}</h3>
                    <p class="reseña">${review.content}</p>
                    <div class="reseñador">
                        <i class="fa-solid fa-circle-user icono-usuario-default"></i>
                        <div class="detalles-reseñador">
                            <span class="nombre">${review.user}</span>
                            <span class="fecha">${review.date}</span>
                        </div>
                    </div>
                </div>
            `;
        });

        // Cambiar título de la página
        document.title = `AFK Store | ${this.data.title}`;

        // Inyectar el diseño premium de dos columnas
        container.innerHTML = `
            <div class="game-page-grid">
                <!-- Columna Principal (Izquierda) -->
                <div class="game-main-column">
                    <!-- Tráiler de Video -->
                    <div class="video-container">
                        <iframe src="${this.data.videoUrl}" title="${this.data.title} Trailer"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowfullscreen>
                        </iframe>
                    </div>

                    <!-- Acerca de este juego -->
                    <section class="about-game-section">
                        <h2>Acerca de este juego</h2>
                        <p class="descripcion">${this.data.description}</p>
                    </section>

                    <!-- Requisitos del Sistema -->
                    <section class="requirements-section">
                        <h2>Requisitos del Sistema</h2>
                        <div class="requirements-grid">
                            <div class="requirements-card">
                                <h3>Mínimos:</h3>
                                <p>${this.data.requirements.min}</p>
                            </div>
                            <div class="requirements-card">
                                <h3>Recomendados:</h3>
                                <p>${this.data.requirements.rec}</p>
                            </div>
                        </div>
                    </section>

                    <!-- Reseñas -->
                    <section class="section-reseñas">
                        <h2>Últimas Reseñas</h2>
                        <div class="reseñas-grid">
                            ${reviewsHTML}
                        </div>
                    </section>
                </div>

                <!-- Columna Lateral (Derecha) -->
                <div class="game-sidebar-column">
                    <!-- Imagen de Portada -->
                    <div class="sidebar-cover-container">
                        <img src="${this.data.coverImage}" alt="${this.data.title}">
                    </div>

                    <!-- Caja de Compra -->
                    <div class="buy-card">
                        <h3>Comprar ${this.data.title}</h3>
                        <div class="buy-card-price-action">
                            ${this.getPriceHTML()}
                            <button class="btn-buy" id="btn-buy-game">
                                <i class="fa-solid fa-cart-plus"></i> Agregar al carrito
                            </button>
                        </div>
                    </div>

                    <!-- Detalles Técnicos -->
                    <div class="technical-details-card">
                        <div class="tech-row">
                            <span class="tech-label">Desarrollador:</span>
                            <span class="tech-value">${this.data.developer}</span>
                        </div>
                        <div class="tech-row">
                            <span class="tech-label">Editor:</span>
                            <span class="tech-value">${this.data.publisher}</span>
                        </div>
                        <div class="tech-row">
                            <span class="tech-label">Fecha de lanzamiento:</span>
                            <span class="tech-value">${this.data.releaseDate}</span>
                        </div>
                        <div class="tech-row flex-column">
                            <span class="tech-label">Categoría:</span>
                            <div class="tech-categories-badges">
                                <span class="badge-cat"><i class="fa-solid fa-tag"></i> ${this.data.category}</span>
                            </div>
                        </div>
                        <div class="tech-row">
                            <span class="tech-label">Valoración:</span>
                            <span class="tech-value rating-highlight">${this.data.rating}% de críticas positivas</span>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Agregar al carrito con persistencia local
        const btnBuy = document.getElementById('btn-buy-game');
        if (btnBuy) {
            btnBuy.addEventListener('click', () => {
                btnBuy.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    btnBuy.style.transform = 'none';
                    
                    // Verificar si ya posee el juego
                    const defaultOwnedGames = [
                        'god-of-war',
                        'baldurs-gate-3',
                        'dota-2',
                        'gta-v',
                        'resident-evil-9',
                        'subnautica-2',
                        'monster-hunter-wilds',
                        'cod-black-ops-7'
                    ];
                    const ownedGames = JSON.parse(localStorage.getItem('ownedGames')) || defaultOwnedGames;
                    if (ownedGames.includes(this.data.id)) {
                        alert(`Ya tienes "${this.data.title}" en tu biblioteca. No puedes volver a comprarlo.`);
                        return;
                    }

                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    if (!cart.includes(this.data.id)) {
                        cart.push(this.data.id);
                        localStorage.setItem('cart', JSON.stringify(cart));
                        alert(`¡${this.data.title} se ha agregado a tu carrito!`);
                    } else {
                        alert(`¡${this.data.title} ya está en tu carrito!`);
                    }
                }, 150);
            });
        }
    }
}

// ==========================================================================
// Subclases de los Juegos del Catálogo
// ==========================================================================

class GodOfWar extends GamePage {
    constructor() {
        super({
            id: "god-of-war",
            title: "God of War Ragnarök",
            category: "Acción",
            sliderTag: "Más vendido",
            sliderTagClass: "best-seller",
            sliderTagIcon: "fa-solid fa-fire",
            os: ["windows"],
            price: "S/. 199.00",
            originalPrice: "S/. 199.00",
            discount: "",
            rating: "92",
            stars: 5,
            coverImage: "../imgs/god-of-war-ragnarok_e91t.jpg",
            videoUrl: "https://www.youtube.com/embed/vtFhDrMIZjE",
            description: "Desde Santa Monica Studio llega la secuela del aclamado por la crítica God of War (2018). Fimbulvetr ya está en camino. Kratos y Atreus deben viajar a cada uno de los nueve reinos en búsqueda de respuestas, mientras que las fuerzas asgardianas se preparan para una batalla profetizada que terminará con el mundo. En el camino explorarán paisajes increíbles y míticos, y se enfrentarán a aterradores enemigos en la forma de dioses nórdicos y monstruos. La amenaza del Ragnarök cada vez está más cerca.",
            developer: "Santa Monica Studio",
            publisher: "PlayStation Publishing",
            releaseDate: "9 Nov 2022",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel i5-4670k / AMD Ryzen 3 1200, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 1060 (6 GB) / AMD RX 570 (4 GB), Almacenamiento: 110 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel i7-7700k / AMD Ryzen 7 2700X, Memoria: 16 GB RAM, Gráficos: NVIDIA RTX 2060 (6 GB) / AMD RX 5700 (8 GB), Almacenamiento: 110 GB espacio disponible."
            },
            reviews: [
                { user: "Carlos_Gamer", rating: 5, title: "Obra maestra indiscutible", content: "Supera al juego de 2018 en todos los aspectos. La historia te atrapa desde el primer minuto y el desarrollo de Kratos y Atreus es increíble. Vale cada centavo.", date: "25 May 2026" },
                { user: "Alex Hunter", rating: 5, title: "Combate muy satisfactorio", content: "Me encanta cómo han mejorado el sistema de combate. Las nuevas armas y habilidades le dan mucha más verticalidad y dinamismo a las peleas. Los jefes son espectaculares.", date: "21 May 2026" },
                { user: "PC_Master12", rating: 4, title: "Excelente optimización", content: "Lo estoy jugando en PC y corre de maravilla. Los gráficos son alucinantes y los paisajes de los Nueve Reinos te dejan sin aliento. Un trabajo impecable en el port.", date: "18 May 2026" }
            ]
        });
    }
}

class BaldursGate3 extends GamePage {
    constructor() {
        super({
            id: "baldurs-gate-3",
            title: "Baldur's Gate 3",
            category: "Aventura",
            sliderTag: "Oferta especial",
            sliderTagClass: "special-offer",
            sliderTagIcon: "fa-solid fa-tags",
            os: ["windows", "macos"],
            price: "S/. 49.75",
            originalPrice: "S/. 199.00",
            discount: "-75%",
            rating: "96",
            stars: 5,
            coverImage: "../imgs/baldurs gate 3.jpeg",
            videoUrl: "https://www.youtube.com/embed/UgTFtD2sHdE",
            description: "Reúne a tu grupo y regresa a los Reinos Olvidados en una historia de compañerismo y traición, sacrificio y supervivencia, y la tentación del poder absoluto. Misteriosas habilidades se despiertan dentro de ti, sembradas por un parásito de azotamentes en tu cerebro. Resiste y vuelve la oscuridad contra sí misma o abraza la corrupción y conviértete en el mal definitivo.",
            developer: "Larian Studios",
            publisher: "Larian Studios",
            releaseDate: "3 Ago 2023",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel i5-4690 / AMD FX-8350, Memoria: 8 GB RAM, Gráficos: Nvidia GTX 970 / RX 480 (4GB+), Almacenamiento: 150 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel i7-8700K / AMD r5 3600, Memoria: 16 GB RAM, Gráficos: Nvidia RTX 2060 Super / RX 5700 XT, Almacenamiento: 150 GB espacio disponible."
            },
            reviews: [
                { user: "DungeonsMaster", rating: 5, title: "Rol puro en su máxima expresión", content: "No he parado de jugar en semanas. La libertad de elección es simplemente absurda. Cada partida se siente única.", date: "10 Jun 2026" },
                { user: "Shadowheart_fan", rating: 5, title: "Personajes increíbles", content: "Las historias de los compañeros están escritas con un detalle asombroso. El oso es un gran compañero.", date: "08 Jun 2026" }
            ]
        });
    }
}

class ResidentEvil9 extends GamePage {
    constructor() {
        super({
            id: "resident-evil-9",
            title: "Resident Evil 9",
            category: "Terror",
            sliderTag: "Novedad",
            sliderTagClass: "new-release",
            sliderTagIcon: "fa-solid fa-bullhorn",
            os: ["windows"],
            price: "S/. 159.20",
            originalPrice: "S/. 199.00",
            discount: "-20%",
            rating: "88",
            stars: 4,
            coverImage: "../imgs/re9.jpg",
            videoUrl: "https://www.youtube.com/embed/8N3c044yy-M",
            description: "Sobrevive a la pesadilla definitiva en la última entrega de la aclamada saga de terror de Capcom. Una misteriosa isla en el sudeste asiático esconde los experimentos biológicos más aterradores jamás concebidos. Sigue la historia en primera persona mientras resuelves puzles, gestionas tus recursos escasos y luchas por mantenerte con vida frente a abominaciones mutantes.",
            developer: "Capcom",
            publisher: "Capcom",
            releaseDate: "15 Ene 2026",
            requirements: {
                min: "SO: Windows 10/11 64-bit, Procesador: Intel Core i5-7500 / AMD Ryzen 3 1200, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 1050 Ti / AMD RX 560, Almacenamiento: 60 GB espacio disponible.",
                rec: "SO: Windows 10/11 64-bit, Procesador: Intel Core i7-8700 / AMD Ryzen 5 3600, Memoria: 16 GB RAM, Gráficos: NVIDIA GTX 1070 / AMD RX 5700, Almacenamiento: 60 GB espacio disponible."
            },
            reviews: [
                { user: "LeonS", rating: 5, title: "El terror está de vuelta", content: "Atmósfera brutal y gráficos excelentes. La tensión no decae en ningún momento y los mutantes te darán pesadillas.", date: "18 Jun 2026" },
                { user: "Chris_Red", rating: 4, title: "Buenísimo port de PC", content: "Muy optimizado, gran cantidad de opciones gráficas y la ambientación de la isla está muy lograda. Recomendado.", date: "12 Jun 2026" }
            ]
        });
    }
}

class Subnautica2 extends GamePage {
    constructor() {
        super({
            id: "subnautica-2",
            title: "Subnautica 2",
            category: "Aventura",
            sliderTag: "Recomendado",
            sliderTagClass: "recommended",
            sliderTagIcon: "fa-solid fa-thumbs-up",
            os: ["windows", "macos"],
            price: "S/. 64.35",
            originalPrice: "S/. 99.00",
            discount: "-35%",
            rating: "90",
            stars: 5,
            coverImage: "../imgs/subnautica 2.jpg",
            videoUrl: "https://www.youtube.com/embed/8EZhCzFaQuw",
            description: "Sumérgete en un nuevo mundo alienígena subacuático y descubre sus misterios ocultos. Explora profundidades inexploradas en solitario o con hasta tres amigos en el modo cooperativo en línea. Fabrica equipo avanzado, construye bases submarinas masivas y enfréntate a las temibles criaturas que acechan en el abismo oscuro.",
            developer: "Unknown Worlds",
            publisher: "KRAFTON",
            releaseDate: "12 Mar 2026",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i3-4130 / AMD FX-4300, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 960 / AMD RX 460, Almacenamiento: 20 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i5-8600 / AMD Ryzen 5 2600, Memoria: 16 GB RAM, Gráficos: NVIDIA GTX 1660 Ti / AMD RX 590, Almacenamiento: 20 GB espacio disponible."
            },
            reviews: [
                { user: "Diver_One", rating: 5, title: "Un viaje submarino espectacular", content: "El multijugador cooperativo funciona de maravilla y las nuevas criaturas son tan fascinantes como aterradoras. Vale cada centavo.", date: "20 Jun 2026" },
                { user: "LeviathanSlayer", rating: 4, title: "Hermoso pero da miedo", content: "La ambientación del agua profunda es increíble. Da una sensación de soledad inmensa y los bichos gigantes te darán taquicardia.", date: "14 Jun 2026" }
            ]
        });
    }
}

class Dota2 extends GamePage {
    constructor() {
        super({
            id: "dota-2",
            title: "Dota 2",
            category: "Acción",
            sliderTag: "Más jugado",
            sliderTagClass: "most-played",
            sliderTagIcon: "fa-solid fa-users",
            os: ["windows", "macos", "linux"],
            price: "Gratis",
            originalPrice: "Gratis",
            discount: "",
            rating: "90",
            stars: 5,
            coverImage: "../imgs/dotita.jpg",
            videoUrl: "https://www.youtube.com/embed/-cSFPIwMEq4",
            description: "Únete a la batalla definitiva en el MOBA más jugado de todos los tiempos. Cada día, millones de jugadores de todo el mundo entran en batalla como uno de los más de cien héroes de Dota en intensos combates 5v5. Y no importa si es su décima hora o su milésima, siempre hay algo nuevo que descubrir en su profundo y cambiante mapa de juego.",
            developer: "Valve",
            publisher: "Valve",
            releaseDate: "9 Jul 2013",
            requirements: {
                min: "SO: Windows 7 o posterior, Procesador: Intel Dual Core o AMD a 2.8 GHz, Memoria: 4 GB RAM, Gráficos: Nvidia GeForce 8600/9600GT / AMD Radeon HD2600/3600, Almacenamiento: 15 GB espacio disponible.",
                rec: "SO: Windows 10 o posterior, Procesador: Intel Core i5 o AMD equivalente, Memoria: 8 GB RAM, Gráficos: Nvidia GeForce GTX 960 / AMD Radeon equivalente, Almacenamiento: 15 GB espacio disponible."
            },
            reviews: [
                { user: "MidOrFeed", rating: 5, title: "El mejor MOBA sin duda", content: "Es difícil y requiere paciencia, pero es el más balanceado y gratificante de todos. Todos los héroes son gratis desde el inicio.", date: "28 Jun 2026" },
                { user: "ToxicRemover", rating: 4, title: "Comunidad difícil pero juego GOD", content: "El juego es increíble, aunque recomiendo jugarlo con amigos para evitar la toxicidad. Las tácticas y estrategias son infinitas.", date: "24 Jun 2026" }
            ]
        });
    }
}

class GTAV extends GamePage {
    constructor() {
        super({
            id: "gta-v",
            title: "Grand Theft Auto V",
            category: "Acción",
            os: ["windows"],
            price: "S/. 59.90",
            originalPrice: "S/. 119.90",
            discount: "-50%",
            rating: "94",
            stars: 5,
            coverImage: "../imgs/GTA V.png",
            videoUrl: "https://www.youtube.com/embed/QkkoHAzjnUs",
            description: "Cuando un joven estafador callejero, un ladrón de bancos retirado y un psicópata aterrorizante se ven involucrados con lo peor del submundo criminal, el gobierno de EE. UU. y la industria del entretenimiento, deben llevar a cabo una serie de atracos peligrosos para sobrevivir en una ciudad implacable.",
            developer: "Rockstar North",
            publisher: "Rockstar Games",
            releaseDate: "17 Sep 2013",
            requirements: {
                min: "SO: Windows 10 64 Bit, Procesador: Intel Core 2 Quad CPU Q6600 @ 2.40GHz / AMD Phenom 9850 Quad-Core @ 2.5GHz, Memoria: 4 GB RAM, Gráficos: NVIDIA 9800 GT 1GB / AMD HD 4870 1GB, Almacenamiento: 72 GB espacio disponible.",
                rec: "SO: Windows 10 64 Bit, Procesador: Intel Core i5 3470 @ 3.2GHz / AMD X8 FX-8350 @ 4GHz, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 660 2GB / AMD HD 7870 2GB, Almacenamiento: 72 GB espacio disponible."
            },
            reviews: [
                { user: "Trevor_Fan", rating: 5, title: "El rey indiscutible", content: "El modo historia es arte puro. Lo he completado 4 veces y no me aburro.", date: "12 May 2026" }
            ]
        });
    }
}

class MonsterHunterWilds extends GamePage {
    constructor() {
        super({
            id: "monster-hunter-wilds",
            title: "Monster Hunter Wilds",
            category: "Aventura",
            os: ["windows"],
            price: "S/. 229.00",
            originalPrice: "S/. 229.00",
            discount: "",
            rating: "91",
            stars: 5,
            coverImage: "../imgs/monster hunter wilds.jpg",
            videoUrl: "https://www.youtube.com/embed/zPwK-h8RHWs",
            description: "La fuerza de la naturaleza es salvaje e implacable, y los entornos cambian drásticamente de un momento a otro. Esta es una historia de monstruos y humanos y sus luchas por vivir en armonía en un mundo de dualidad.",
            developer: "Capcom",
            publisher: "Capcom",
            releaseDate: "28 Feb 2025",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i5-11600K / AMD Ryzen 5 5600X, Memoria: 16 GB RAM, Gráficos: NVIDIA GeForce RTX 2060 / AMD Radeon RX 5600 XT, Almacenamiento: 100 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i7-12700 / AMD Ryzen 7 5800X, Memoria: 16 GB RAM, Gráficos: NVIDIA GeForce RTX 4060 / AMD Radeon RX 7600 XT, Almacenamiento: 100 GB espacio disponible."
            },
            reviews: [
                { user: "HunterX", rating: 5, title: "Increíble gameplay", content: "El combate es súper fluido y el mundo abierto dinámico se siente vivo. Capcom se superó.", date: "15 Jun 2026" }
            ]
        });
    }
}

class CODBlackOps7 extends GamePage {
    constructor() {
        super({
            id: "cod-black-ops-7",
            title: "Call of Duty: Black Ops 7",
            category: "Acción",
            os: ["windows"],
            price: "S/. 279.00",
            originalPrice: "S/. 279.00",
            discount: "",
            rating: "85",
            stars: 4,
            coverImage: "../imgs/Call of Duty Black Ops 7.jpg",
            videoUrl: "https://www.youtube.com/embed/9txkGBj_trg",
            description: "Desarrollado por Treyarch, Black Ops 7 te sumerge en una campaña de espionaje llena de acción en una era de conspiraciones globales y operaciones encubiertas. Disfruta además del mejor multijugador y del regreso del aclamado modo Zombies por rondas.",
            developer: "Treyarch",
            publisher: "Activision",
            releaseDate: "24 Oct 2025",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i5-6600 / AMD Ryzen 5 1400, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 960 / AMD RX 470, Almacenamiento: 120 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i7-8700K / AMD Ryzen 5 3600X, Memoria: 16 GB RAM, Gráficos: NVIDIA RTX 2060 / AMD RX 5700 XT, Almacenamiento: 120 GB espacio disponible."
            },
            reviews: [
                { user: "SniperPro", rating: 4, title: "Campaña espectacular", content: "La campaña de espionaje es de las mejores en años. El multijugador es muy rápido.", date: "10 Jun 2026" }
            ]
        });
    }
}

class FC26 extends GamePage {
    constructor() {
        super({
            id: "fc-26",
            title: "EA SPORTS FC 26",
            category: "Deportes",
            os: ["windows"],
            price: "S/. 87.60",
            originalPrice: "S/. 219.00",
            discount: "-60%",
            rating: "80",
            stars: 4,
            coverImage: "../imgs/FC 26.jpg",
            videoUrl: "https://www.youtube.com/embed/KdKYsbm9WAU",
            description: "EA SPORTS FC 26 te acerca más al juego con el motor HyperMotionV, estilos de juego optimizados por Opta y una experiencia de simulación de fútbol inigualable en todas las competiciones del mundo.",
            developer: "EA Vancouver",
            publisher: "EA Sports",
            releaseDate: "26 Sep 2025",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i5-6600K / AMD Ryzen 5 1600, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 1050 Ti / AMD RX 570, Almacenamiento: 100 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i7-6700 / AMD Ryzen 7 2700X, Memoria: 12 GB RAM, Gráficos: NVIDIA GTX 1660 / AMD RX 5600 XT, Almacenamiento: 100 GB espacio disponible."
            },
            reviews: [
                { user: "GoalScorer", rating: 4, title: "Buena jugabilidad", content: "Las animaciones con HyperMotionV son excelentes, se siente mucho más real el ritmo.", date: "14 Jun 2026" }
            ]
        });
    }
}

class ArcRiders extends GamePage {
    constructor() {
        super({
            id: "arc-riders",
            title: "ARC Raiders",
            category: "Acción",
            os: ["windows"],
            price: "Gratis",
            originalPrice: "Gratis",
            discount: "",
            rating: "87",
            stars: 4,
            coverImage: "../imgs/arc riders.jpg",
            videoUrl: "https://www.youtube.com/embed/U0jK145mxec",
            description: "ARC Raiders es un shooter en tercera persona cooperativo y gratuito en el que tú y tu escuadrón os alistaréis para resistir el embate de ARC, una implacable amenaza mecanizada que desciende del espacio.",
            developer: "Embark Studios",
            publisher: "Embark Studios",
            releaseDate: "12 Nov 2025",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i5-6600K / AMD Ryzen 5 1600, Memoria: 12 GB RAM, Gráficos: NVIDIA GTX 1060 / AMD RX 580, Almacenamiento: 50 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i7-9700K / AMD Ryzen 7 3700X, Memoria: 16 GB RAM, Gráficos: NVIDIA RTX 2060 / AMD RX 5700 XT, Almacenamiento: 50 GB espacio disponible."
            },
            reviews: [
                { user: "SciFiGamer", rating: 5, title: "Gráficos brutales", content: "El motor gráfico es alucinante y la jugabilidad cooperativa contra las máquinas gigantes es súper adictiva.", date: "19 Jun 2026" }
            ]
        });
    }
}

class EscapeTheBackrooms extends GamePage {
    constructor() {
        super({
            id: "escape-the-backrooms",
            title: "Escape the Backrooms",
            category: "Terror",
            os: ["windows"],
            price: "S/. 22.00",
            originalPrice: "S/. 22.00",
            discount: "",
            rating: "86",
            stars: 4,
            coverImage: "../imgs/escape the backrooms.jpg",
            videoUrl: "https://www.youtube.com/embed/6xbnqo48K2c",
            description: "Escape the Backrooms es un juego de exploración de terror cooperativo para 1 a 4 jugadores. Atraviesa espeluznantes niveles de trastiendas mientras evitas entidades y otros peligros para intentar escapar.",
            developer: "Fancy Animations",
            publisher: "Fancy Animations",
            releaseDate: "11 Ago 2022",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i5-2500K / AMD FX-8370, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 970 / AMD Radeon R9 290, Almacenamiento: 10 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i7-4790K / AMD Ryzen 5 1500X, Memoria: 16 GB RAM, Gráficos: NVIDIA GTX 1060 / AMD Radeon RX 580, Almacenamiento: 10 GB espacio disponible."
            },
            reviews: [
                { user: "NoClipExplorer", rating: 5, title: "Muy tenso", content: "Las trastiendas se sienten infinitas y claustrofóbicas. Jugarlo con amigos es divertidísimo y aterrador.", date: "15 Abr 2026" }
            ]
        });
    }
}

class DeadByDaylight extends GamePage {
    constructor() {
        super({
            id: "dead-by-daylight",
            title: "Dead by Daylight",
            category: "Terror",
            os: ["windows"],
            price: "S/. 19.80",
            originalPrice: "S/. 49.50",
            discount: "-60%",
            rating: "81",
            stars: 4,
            coverImage: "../imgs/deadbydaylight.jpg",
            videoUrl: "https://www.youtube.com/embed/JGhIXLO3ul8",
            description: "Dead by Daylight es un juego de terror multijugador (4 contra 1) en el que un jugador asume el rol del asesino despiadado y los otros cuatro juegan como supervivientes que intentan escapar de él para evitar ser capturados y sacrificados.",
            developer: "Behaviour Interactive",
            publisher: "Behaviour Interactive",
            releaseDate: "14 Jun 2016",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i3-4170 / AMD FX-8120, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 460 / AMD HD 6850, Almacenamiento: 50 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i5-8400 / AMD Ryzen 5 1600, Memoria: 8 GB RAM, Gráficos: NVIDIA GTX 1060 / AMD RX 580, Almacenamiento: 50 GB espacio disponible."
            },
            reviews: [
                { user: "SlasherLover", rating: 4, title: "Adictivo e infinito", content: "Llevo más de 1000 horas y sigue divirtiendo. La cantidad de asesinos y supervivientes licenciados es genial.", date: "22 May 2026" }
            ]
        });
    }
}

class DeadSpace extends GamePage {
    constructor() {
        super({
            id: "dead-space",
            title: "Dead Space Remake",
            category: "Terror",
            os: ["windows"],
            price: "S/. 79.60",
            originalPrice: "S/. 199.00",
            discount: "-60%",
            rating: "92",
            stars: 5,
            coverImage: "../imgs/dead space.jpg",
            videoUrl: "https://www.youtube.com/embed/cTDJNZ9cK1w",
            description: "El clásico de terror y supervivencia de ciencia ficción regresa completamente reconstruido desde cero para ofrecer una experiencia más profunda y realista, con fidelidad visual increíble y audio atmosférico espeluznante.",
            developer: "Motive Studio",
            publisher: "Electronic Arts",
            releaseDate: "27 Ene 2023",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Intel Core i5-8600 / AMD Ryzen 5 2600x, Memoria: 16 GB RAM, Gráficos: NVIDIA GTX 1070 / AMD RX 5700, Almacenamiento: 50 GB espacio disponible.",
                rec: "SO: Windows 10 64-bit, Procesador: Intel Core i5-11600K / AMD Ryzen 5 5600X, Memoria: 16 GB RAM, Gráficos: NVIDIA RTX 2070 / AMD RX 6700 XT, Almacenamiento: 50 GB espacio disponible."
            },
            reviews: [
                { user: "Isaac_Clarke", rating: 5, title: "Una obra maestra de remake", content: "La atmósfera es asfixiante, el desmembramiento estratégico se siente increíble y los gráficos son de lo mejor.", date: "02 Jun 2026" }
            ]
        });
    }
}

class Outlast extends GamePage {
    constructor() {
        super({
            id: "outlast",
            title: "Outlast",
            category: "Terror",
            os: ["windows", "macos", "linux"],
            price: "S/. 7.40",
            originalPrice: "S/. 37.00",
            discount: "-80%",
            rating: "96",
            stars: 5,
            coverImage: "../imgs/outlast.jpg",
            videoUrl: "https://www.youtube.com/embed/uKA-IA4locM",
            description: "En las remotas montañas de Colorado, los horrores esperan dentro del hospital psiquiátrico Mount Massive. Un hogar para enfermos mentales abandonado hace tiempo que ha sido reabierto por la rama de investigación de la corporación Murkoff. Actuando bajo una pista anónima, el periodista independiente Miles Upshur irrumpe en el complejo.",
            developer: "Red Barrels",
            publisher: "Red Barrels",
            releaseDate: "4 Sep 2013",
            requirements: {
                min: "SO: Windows XP / Vista / 7 / 8 64-bit, Procesador: Dual Core a 2.2 GHz, Memoria: 2 GB RAM, Gráficos: NVIDIA GeForce 9800 GTX / ATI Radeon HD 3870, Almacenamiento: 5 GB espacio disponible.",
                rec: "SO: Windows Vista / 7 / 8 64-bit, Procesador: Quad Core a 2.8 GHz, Memoria: 3 GB RAM, Gráficos: NVIDIA GTX 460 / ATI Radeon HD 6850, Almacenamiento: 5 GB espacio disponible."
            },
            reviews: [
                { user: "CameraMan", rating: 5, title: "Aterrador de principio a fin", content: "La mecánica de la cámara con visión nocturna y baterías limitadas crea una tensión inigualable. El mejor juego de terror de la historia.", date: "15 Jun 2026" }
            ]
        });
    }
}

class CrimsonDesert extends GamePage {
    constructor(){
        super({
            id: "crimson",
            title: "Crimson Desert",
            category: "Acción",
            os: ["windows", "macos"],
            price: "S/. 249.00",
            originalprice: "S/. 249.00",
            discount: "",
            rating: "89",
            stars: 4,
            coverImage: "../imgs/crimson desert.jpg",
            videoUrl: "https://www.youtube.com/embed/ZdmoGYg8tB0",
            description: "Crimson Desert es un juego de acción y aventura en mundo abierto ambientado en Pywel. Acompaña a Kliff en su viaje para reunir a los Melenas Grises y salvar el continente. Zonas salvajes, ciudades, ruinas antiguas y el misterioso Abismo; forja tu propio camino a través del combate y la exploración.",
            developer: "Pearl Abyss",
            publisher: "Pearl Abyss",
            releaseDate: "19 Mar 2026",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Ryzen 5 2600X / i5-8500, Memoria: 16 GB de RAM, Gráficos: RX 5500 XT / GTX 1060, Almacenamiento: 150 GB de espacio disponible",
                rec: "SO: Windows 10 64-bit, Procesador: Ryzen 5 5600 / i5-11600K, Memoria: 16 GB de RAM, Gráficos: RX 6700 XT / RTX 2080, Almacenamiento: 150 GB de espacio disponible"
            },
            reviews: [
                { user: "Floyd", rating: 5, title: "Complejo al principio pero satisfactorio de aprender", content: "Los controles y las mecanicas del juego al principio son un poco complicadas pero una vez te adaptas encuentras un mundo abierto muy interesante y divertido de explorar.", date: "2 Jun 2026" }
            ]
        });
    }
}

class EstellarBlade extends GamePage {
    constructor(){
        super({
            id: "estelar",
            title: "Estellar Blade",
            category: "Acción",
            os: ["windows"],
            price: "S/. 133.33",
            originalprice: "S/. 199.00",
            discount: "-33%",
            rating: "92",
            stars: 5,
            coverImage: "../imgs/stelar blade.jpg",
            videoUrl: "https://www.youtube.com/embed/DSznLWimMlU",
            description: "Evita la extinción de la raza humana en este juego de acción-aventura postapocalíptico: Stellar Blade™. Disfruta de combates feroces y una historia intrigante mientras resuelves los misterios que llevaron a la caída de la Tierra.",
            developer: "SHIFT UP",
            publisher: "PS",
            releaseDate: "11 Jun 2025",
            requirements: {
                min: "SO: Windows 10 64-bit, Procesador: Ryzen 5 2600X / i5-8500, Memoria: 16 GB de RAM, Gráficos: RX 5500 XT / GTX 1060, Almacenamiento: 150 GB de espacio disponible",
                rec: "SO: Windows 10 64-bit, Procesador: Ryzen 5 5600 / i5-11600K, Memoria: 16 GB de RAM, Gráficos: RX 6700 XT / RTX 2080, Almacenamiento: 150 GB de espacio disponible"
            },
            reviews: [
                { user: "eve", rating: 5, title: "El juego es muy frenetico", content: "El juego es muy divertido y con muchos combos, presenta peleas satisfactorios y bosses desafiantes", date: "20 Jun 2026" }
            ]
        });
    }
}

// ==========================================================================
// Enrutador Dinámico de la Página del Juego
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
    const gamesMap = {
        'god-of-war': GodOfWar,
        'baldurs-gate-3': BaldursGate3,
        'resident-evil-9': ResidentEvil9,
        'subnautica-2': Subnautica2,
        'dota-2': Dota2,
        'gta-v': GTAV,
        'monster-hunter-wilds': MonsterHunterWilds,
        'cod-black-ops-7': CODBlackOps7,
        'fc-26': FC26,
        'arc-riders': ArcRiders,
        'escape-the-backrooms': EscapeTheBackrooms,
        'dead-by-daylight': DeadByDaylight,
        'dead-space': DeadSpace,
        'outlast': Outlast,
        'crimson': CrimsonDesert,
        'estelar': EstellarBlade
    };

    // Leer el parámetro ?game= de la URL
    const params = new URLSearchParams(window.location.search);
    const gameId = params.get('game');

    if (gameId && gamesMap[gameId]) {
        const GameClass = gamesMap[gameId];
        const gameInstance = new GameClass();
        gameInstance.render();
    } else if (document.getElementById('game-content-container')) {
        // Redirección por defecto si estamos en la página pero no hay parámetro válido
        const gameInstance = new GodOfWar();
        gameInstance.render();
    }
});
