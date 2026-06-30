class GameSlider {
    constructor(containerId, autoPlayInterval = 6000) {
        this.container = document.getElementById(containerId);
        this.autoPlayInterval = autoPlayInterval;
        this.currentIndex = 0;
        this.timer = null;
        this.slides = [];
        this.dots = [];
        
        // Cargar metadatos desde la base de datos centralizada de game.js
        const gameInstances = [
            new GodOfWar(),
            new BaldursGate3(),
            new ResidentEvil9(),
            new Subnautica2(),
            new Dota2()
        ];
        this.slidesData = gameInstances.map(game => game.data);
    }

    init() {
        if (!this.container) return;

        // 1. Renderizar slider mediano
        this.render();

        // 2. Obtener elementos generados en el DOM
        this.slides = this.container.querySelectorAll('.slide');
        this.dots = this.container.querySelectorAll('.Puntos');

        // 3. Enlazar eventos de botones prev/next
        const btnPrev = this.container.querySelector('.boton-izquierdo');
        const btnNext = this.container.querySelector('.boton-derecho');

        if (btnPrev) {
            btnPrev.addEventListener('click', (e) => {
                e.stopPropagation();
                this.prevSlide();
                this.resetAutoPlay();
            });
        }

        if (btnNext) {
            btnNext.addEventListener('click', (e) => {
                e.stopPropagation();
                this.nextSlide();
                this.resetAutoPlay();
            });
        }

        // 4. Enlazar puntos de navegación
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showSlide(index);
                this.resetAutoPlay();
            });
        });

        // 5. Autoplay control con mouse hover
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.startAutoPlay());

        // 6. Activar diapositiva inicial e iniciar autoplay
        this.showSlide(this.currentIndex);
        this.startAutoPlay();
    }

    render() {
        let html = '<div class="slider-wrapper">';

        this.slidesData.forEach((game, idx) => {
            const isActive = idx === 0 ? 'active' : '';
            const priceHTML = this.getPriceHTML(game);
            const osHTML = this.getOSHTML(game.os);
            const cleanCoverImage = game.coverImage.replace('../', '');
            // Obtener descripción recortada para que sea corta y consistente
            const shortDesc = game.description.length > 140 
                ? game.description.substring(0, 140) + '...' 
                : game.description;

            html += `
                <div class="slide ${isActive}">
                    <a href="html/juegopag.html?game=${game.id}" class="enlace-fondo"></a>
                    <div class="slide-content-medium">
                        <!-- Imagen Principal del Juego -->
                        <div class="slide-image-box">
                            <img src="${cleanCoverImage}" alt="${game.title}">
                        </div>
                        <!-- Detalles del Juego -->
                        <div class="slide-info-box">
                            <span class="slide-category-badge">${game.category}</span>
                            <h2>${game.title}</h2>
                            <p class="slide-description-text">${shortDesc}</p>
                            ${game.sliderTag ? `
                            <div class="slide-badges-row">
                                <span class="slide-tag-badge ${game.sliderTagClass}"><i class="${game.sliderTagIcon}"></i> ${game.sliderTag}</span>
                            </div>` : ''}
                            
                            <div class="slide-footer-row">
                                <!-- Compatibilidad de Sistemas Operativos -->
                                <div class="slide-os-support">
                                    <span class="os-label">Disponible en:</span>
                                    <div class="os-icons">${osHTML}</div>
                                </div>
                                <!-- Precios en Soles -->
                                <div class="slide-pricing-box">
                                    ${priceHTML}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });

        html += '</div>';

        // Agregar botones de navegación
        html += `
            <button class="boton-izquierdo"><i class="fa-solid fa-chevron-left"></i></button>
            <div class="Contenedor-Puntos">
        `;
        this.slidesData.forEach((_, idx) => {
            const isActive = idx === 0 ? 'active' : '';
            html += `<div class="Puntos ${isActive}"></div>`;
        });
        html += `
            </div>
            <button class="boton-derecho"><i class="fa-solid fa-chevron-right"></i></button>
        `;

        this.container.innerHTML = html;
    }

    showSlide(index) {
        if (this.slides.length === 0) return;

        if (index >= this.slides.length) {
            this.currentIndex = 0;
        } else if (index < 0) {
            this.currentIndex = this.slides.length - 1;
        } else {
            this.currentIndex = index;
        }

        this.slides.forEach((slide, idx) => {
            if (idx === this.currentIndex) {
                slide.classList.add('active');
            } else {
                slide.classList.remove('active');
            }
        });

        this.dots.forEach((dot, idx) => {
            if (idx === this.currentIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }

    nextSlide() {
        this.showSlide(this.currentIndex + 1);
    }

    prevSlide() {
        this.showSlide(this.currentIndex - 1);
    }

    startAutoPlay() {
        this.stopAutoPlay();
        this.timer = setInterval(() => {
            this.nextSlide();
        }, this.autoPlayInterval);
    }

    stopAutoPlay() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }

    getOSHTML(osArray) {
        let html = '';
        if (osArray.includes('windows')) {
            html += '<i class="fa-brands fa-windows" title="Windows"></i> ';
        }
        if (osArray.includes('macos')) {
            html += '<i class="fa-brands fa-apple" title="macOS"></i> ';
        }
        if (osArray.includes('linux')) {
            html += '<i class="fa-brands fa-linux" title="Linux"></i> ';
        }
        return html;
    }

    getPriceHTML(game) {
        if (game.price === "Gratis") {
            return `<span class="slide-precio gratis">Gratis</span>`;
        }
        if (game.discount) {
            return `
                <span class="slide-precio descuento">
                    <span class="pct">${game.discount}</span>
                    <span class="val">${game.price}</span>
                </span>
            `;
        }
        return `<span class="slide-precio">${game.price}</span>`;
    }
}

// Inicialización del slider
document.addEventListener('DOMContentLoaded', () => {
    const slider = new GameSlider('featured-slider-container', 6000);
    slider.init();
});
