// Mapa de juegos disponibles heredados del archivo game.js
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
    'outlast': Outlast
};

function getGameData(id) {
    if (gamesMap[id]) {
        return new gamesMap[id]().data;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar juegos si no existen
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

    if (!localStorage.getItem('ownedGames')) {
        localStorage.setItem('ownedGames', JSON.stringify(defaultOwnedGames));
    }

    if (!localStorage.getItem('recentlyPurchasedGames')) {
        localStorage.setItem('recentlyPurchasedGames', JSON.stringify([]));
    }

    const ownedIds = JSON.parse(localStorage.getItem('ownedGames')) || [];
    const recentIds = JSON.parse(localStorage.getItem('recentlyPurchasedGames')) || [];

    const recienContainer = document.getElementById('recien-adquiridos-container');
    const todosContainer = document.getElementById('todos-juegos-container');

    // 1. Renderizar Recién Adquiridos
    if (recienContainer) {
        recienContainer.innerHTML = '';
        if (recentIds.length === 0) {
            recienContainer.innerHTML = `
                <div class="biblioteca-vacia-mensaje">
                    <i class="fa-solid fa-clock-rotate-left"></i>
                    <p>No tienes adquisiciones recientes en esta sesión. ¡Tus nuevas compras aparecerán aquí!</p>
                </div>
            `;
        } else {
            recentIds.forEach(id => {
                const gameData = getGameData(id);
                if (gameData) {
                    renderLibraryCard(gameData, recienContainer);
                }
            });
        }
    }

    // 2. Renderizar Todos tus Juegos
    if (todosContainer) {
        todosContainer.innerHTML = '';
        if (ownedIds.length === 0) {
            todosContainer.innerHTML = `
                <div class="biblioteca-vacia-mensaje">
                    <i class="fa-solid fa-gamepad"></i>
                    <p>No tienes juegos en tu biblioteca. ¡Visita la Tienda para empezar tu colección!</p>
                    <a href="../index.html" class="btn-ir-tienda">Ir a la Tienda</a>
                </div>
            `;
        } else {
            ownedIds.forEach(id => {
                const gameData = getGameData(id);
                if (gameData) {
                    renderLibraryCard(gameData, todosContainer);
                }
            });
        }
    }
});

function renderLibraryCard(gameData, container) {
    const card = document.createElement('div');
    card.className = 'tarjeta-juego tarjeta-biblioteca';
    
    card.innerHTML = `
        <a href="juegopag.html?game=${gameData.id}" style="display: flex; flex-direction: column; height: 100%;">
            <div class="imagen-contenedor">
                <img src="${gameData.coverImage}" alt="${gameData.title}">
            </div>
            <div class="info-tarjeta">
                <span class="titulo-juego">${gameData.title}</span>
                <div class="detalles-tarjeta">
                    <span class="categoria-etiqueta">${gameData.category}</span>
                    <span class="btn-jugar-biblioteca"><i class="fa-solid fa-play"></i> JUGAR</span>
                </div>
            </div>
        </a>
    `;
    container.appendChild(card);
}
