class BaseGameCard {
    constructor(gameData) {
        if (new.target === BaseGameCard) {
            throw new TypeError("Cannot construct BaseGameCard instances directly");
        }
        this.data = gameData;
    }

    getPriceHTML() {
        if (this.data.price === "Gratis") {
            return `<span class="precio-regular gratis" style="color: #66c0f4;">Gratis</span>`;
        }
        if (this.data.discount) {
            return `
                <span class="precio-tarjeta-descuento">
                    <span class="pct-badge">${this.data.discount}</span>
                    <span class="val-text">${this.data.price}</span>
                </span>`;
        }
        return `<span class="precio-regular">${this.data.price}</span>`;
    }

    render(container) {
        const card = document.createElement('div');
        card.className = 'tarjeta-juego';
        const cleanCoverImage = this.data.coverImage.replace('../', '');
        const priceHTML = this.getPriceHTML();

        card.innerHTML = `
            <a href="html/juegopag.html?game=${this.data.id}" style="display: flex; flex-direction: column; height: 100%;">
                <div class="imagen-contenedor">
                    <img src="${cleanCoverImage}" alt="${this.data.title}">
                </div>
                <div class="info-tarjeta">
                    <span class="titulo-juego">${this.data.title}</span>
                    <div class="detalles-tarjeta">
                        <span class="categoria-etiqueta">${this.data.category}</span>
                        <span class="precio-tarjeta">${priceHTML}</span>
                    </div>
                </div>
            </a>
        `;
        container.appendChild(card);
    }
}

// Subclases específicas heredando de la clase abstracta
class GodOfWarCard extends BaseGameCard {
    constructor() {
        super(new GodOfWar().data);
    }
}

class BaldursGate3Card extends BaseGameCard {
    constructor() {
        super(new BaldursGate3().data);
    }
}

class ResidentEvil9Card extends BaseGameCard {
    constructor() {
        super(new ResidentEvil9().data);
    }
}

class Subnautica2Card extends BaseGameCard {
    constructor() {
        super(new Subnautica2().data);
    }
}

class Dota2Card extends BaseGameCard {
    constructor() {
        super(new Dota2().data);
    }
}

class GTAVCard extends BaseGameCard {
    constructor() {
        super(new GTAV().data);
    }
}

class MonsterHunterWildsCard extends BaseGameCard {
    constructor() {
        super(new MonsterHunterWilds().data);
    }
}

class CODBlackOps7Card extends BaseGameCard {
    constructor() {
        super(new CODBlackOps7().data);
    }
}

class FC26Card extends BaseGameCard {
    constructor() {
        super(new FC26().data);
    }
}

class ArcRidersCard extends BaseGameCard {
    constructor() {
        super(new ArcRiders().data);
    }
}

class EscapeTheBackroomsCard extends BaseGameCard {
    constructor() {
        super(new EscapeTheBackrooms().data);
    }
}

class DeadByDaylightCard extends BaseGameCard {
    constructor() {
        super(new DeadByDaylight().data);
    }
}

class DeadSpaceCard extends BaseGameCard {
    constructor() {
        super(new DeadSpace().data);
    }
}

class OutlastCard extends BaseGameCard {
    constructor() {
        super(new Outlast().data);
    }
}

class CrimsonCard extends BaseGameCard{
    constructor() {
        super(new CrimsonDesert().data);
    }
}

// Clase para las Secciones de Categorías del Catálogo
class CategorySection {
    constructor(name, iconClass, containerId) {
        this.name = name;
        this.iconClass = iconClass;
        this.containerId = containerId;
        this.cards = [];
    }

    addCard(gameCard) {
        this.cards.push(gameCard);
    }

    render(parentContainer) {
        const section = document.createElement('div');
        section.className = 'categoria-seccion';

        section.innerHTML = `
            <h3 class="categoria-titulo"><i class="${this.iconClass}"></i> ${this.name}</h3>
            <div class="catalogo-juegos" id="${this.containerId}"></div>
        `;
        parentContainer.appendChild(section);

        const gamesGrid = section.querySelector('.catalogo-juegos');
        this.cards.forEach(card => card.render(gamesGrid));
    }
}

// Inicialización del Catálogo Dinámico en index.html
document.addEventListener('DOMContentLoaded', () => {
    const parentContainer = document.getElementById('catalog-categories-container');
    if (!parentContainer) return;

    // Limpiar contenido estático preexistente
    parentContainer.innerHTML = '';

    // 1. Crear las secciones de categorías
    const terrorSec = new CategorySection('Terror', 'fa-solid fa-skull', 'cat-terror');
    const accionSec = new CategorySection('Acción', 'fa-solid fa-burst', 'cat-accion');
    const aventuraSec = new CategorySection('Aventura', 'fa-solid fa-compass', 'cat-aventura');
    const deportesSec = new CategorySection('Deportes', 'fa-solid fa-dumbbell', 'cat-deportes');
    const rpgSec = new CategorySection('')

    // 2. Poblar las categorías con las tarjetas correspondientes
    terrorSec.addCard(new ResidentEvil9Card());
    terrorSec.addCard(new EscapeTheBackroomsCard());
    terrorSec.addCard(new DeadByDaylightCard());
    terrorSec.addCard(new DeadSpaceCard());
    terrorSec.addCard(new OutlastCard());

    accionSec.addCard(new GodOfWarCard());
    accionSec.addCard(new Dota2Card());
    accionSec.addCard(new GTAVCard());
    accionSec.addCard(new CODBlackOps7Card());
    accionSec.addCard(new ArcRidersCard());

    aventuraSec.addCard(new BaldursGate3Card());
    aventuraSec.addCard(new Subnautica2Card());
    aventuraSec.addCard(new MonsterHunterWildsCard());
    aventuraSec.addCard(new CrimsonCard());

    deportesSec.addCard(new FC26Card());

    // 3. Renderizar las secciones de categorías ordenadas en el DOM
    terrorSec.render(parentContainer);
    accionSec.render(parentContainer);
    aventuraSec.render(parentContainer);
    deportesSec.render(parentContainer);
});
