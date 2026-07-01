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

// Cargar la información del juego basándose en su ID
function getGameData(id) {
    if (gamesMap[id]) {
        return new gamesMap[id]().data;
    }
    return null;
}

document.addEventListener('DOMContentLoaded', () => {
    // Referencias de las vistas de los estados
    const listView = document.getElementById('cart-list-view');
    const paymentView = document.getElementById('cart-payment-view');
    const successView = document.getElementById('cart-success-view');

    // Contenedores del estado 1 (Listado)
    const itemsList = document.getElementById('cart-items-list');
    const summaryBlock = document.getElementById('cart-summary-block');
    const emptyView = document.getElementById('cart-empty-view');
    const totalAmountSpan = document.getElementById('cart-total-amount');

    // Botones generales
    const btnGoToCheckout = document.getElementById('btn-go-to-checkout');
    const btnBackToList = document.getElementById('btn-back-to-list');
    const btnSubmitPayment = document.getElementById('btn-submit-payment');

    // Inputs del formulario de pago
    const paymentForm = document.getElementById('payment-form');
    const inputName = document.getElementById('card-name');
    const inputNumber = document.getElementById('card-number');
    const inputExpiry = document.getElementById('card-expiry');
    const inputCvv = document.getElementById('card-cvv');

    // Cargar y renderizar los productos del carrito
    function renderCart() {
        const cartIds = JSON.parse(localStorage.getItem('cart')) || [];
        itemsList.innerHTML = '';

        if (cartIds.length === 0) {
            // Mostrar vista de carrito vacío
            itemsList.style.display = 'none';
            summaryBlock.style.display = 'none';
            emptyView.style.display = 'flex';
            return;
        }

        itemsList.style.display = 'flex';
        summaryBlock.style.display = 'block';
        emptyView.style.display = 'none';

        let total = 0;

        cartIds.forEach(id => {
            const game = getGameData(id);
            if (!game) return;

            // Calcular precio numérico para el acumulador
            let priceVal = 0;
            if (game.price !== "Gratis") {
                const cleanPriceStr = game.price.replace('S/.', '').trim();
                priceVal = parseFloat(cleanPriceStr) || 0;
            }
            total += priceVal;

            // Generar item HTML
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';

            itemDiv.innerHTML = `
                <div class="cart-item-info">
                    <img src="${game.coverImage}" alt="${game.title}" class="cart-item-img">
                    <div class="cart-item-details">
                        <span class="cart-item-title">${game.title}</span>
                        <span class="cart-item-category">${game.category}</span>
                    </div>
                </div>
                <div class="cart-item-action">
                    <span class="cart-item-price">${game.price === 'Gratis' ? 'Gratis' : game.price}</span>
                    <button class="btn-remove-item" data-id="${id}" title="Eliminar del carrito">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            `;

            itemsList.appendChild(itemDiv);
        });

        // Actualizar el monto acumulado total formateado a 2 decimales
        totalAmountSpan.textContent = `S/. ${total.toFixed(2)}`;

        // Enlazar los botones de remoción en el listado
        const removeButtons = itemsList.querySelectorAll('.btn-remove-item');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const gameIdToRemove = btn.getAttribute('data-id');
                removeCartItem(gameIdToRemove);
            });
        });
    }

    // Remover elemento del carrito en localStorage
    function removeCartItem(id) {
        let cartIds = JSON.parse(localStorage.getItem('cart')) || [];
        cartIds = cartIds.filter(item => item !== id);
        localStorage.setItem('cart', JSON.stringify(cartIds));
        renderCart();
    }

    // Formatear automáticamente inputs de tarjeta
    if (inputNumber) {
        inputNumber.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            // Formatear agrupando de a 4 dígitos
            let formatted = val.match(/.{1,4}/g);
            e.target.value = formatted ? formatted.join(' ') : '';
            validateForm();
        });
    }

    if (inputExpiry) {
        inputExpiry.addEventListener('input', (e) => {
            let val = e.target.value.replace(/\D/g, '');
            if (val.length > 2) {
                e.target.value = val.substring(0, 2) + '/' + val.substring(2, 4);
            } else {
                e.target.value = val;
            }
            validateForm();
        });
    }

    if (inputCvv) {
        inputCvv.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/\D/g, '');
            validateForm();
        });
    }

    if (inputName) {
        inputName.addEventListener('input', validateForm);
    }

    // Validar el formulario en tiempo real para habilitar botón pagar
    function validateForm() {
        const nameVal = inputName.value.trim();
        const numberVal = inputNumber.value.replace(/\s/g, '');
        const expiryVal = inputExpiry.value.trim();
        const cvvVal = inputCvv.value.trim();

        // Criterio de validación
        const isNameValid = nameVal.length >= 4;
        const isNumberValid = numberVal.length >= 15 && numberVal.length <= 16;
        const isExpiryValid = expiryVal.length === 5 && expiryVal.includes('/');
        const isCvvValid = cvvVal.length >= 3 && cvvVal.length <= 4;

        if (isNameValid && isNumberValid && isExpiryValid && isCvvValid) {
            btnSubmitPayment.disabled = false;
            btnSubmitPayment.classList.remove('disabled');
        } else {
            btnSubmitPayment.disabled = true;
            btnSubmitPayment.classList.add('disabled');
        }
    }

    // Transiciones entre pantallas
    if (btnGoToCheckout) {
        btnGoToCheckout.addEventListener('click', () => {
            listView.style.display = 'none';
            paymentView.style.display = 'block';
            paymentForm.reset();
            validateForm(); // Asegura el estado deshabilitado inicial
        });
    }

    if (btnBackToList) {
        btnBackToList.addEventListener('click', () => {
            paymentView.style.display = 'none';
            listView.style.display = 'block';
        });
    }

    // Acción de Pagar
    if (btnSubmitPayment) {
        btnSubmitPayment.addEventListener('click', (e) => {
            e.preventDefault();

            // Deshabilitar botón para evitar dobles clics
            btnSubmitPayment.disabled = true;
            btnSubmitPayment.classList.add('disabled');

            // Guardar juegos recién adquiridos en biblioteca
            const cartIds = JSON.parse(localStorage.getItem('cart')) || [];
            if (cartIds.length > 0) {
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
                let ownedGames = JSON.parse(localStorage.getItem('ownedGames')) || defaultOwnedGames;
                
                // Añadir juegos que no estuvieran ya en la biblioteca
                cartIds.forEach(id => {
                    if (!ownedGames.includes(id)) {
                        ownedGames.push(id);
                    }
                });

                localStorage.setItem('ownedGames', JSON.stringify(ownedGames));
                localStorage.setItem('recentlyPurchasedGames', JSON.stringify(cartIds));
            }

            // Limpiar carrito de compras
            localStorage.removeItem('cart');

            // Ocultar formulario de pago y mostrar vista de éxito con checkmark animado
            paymentView.style.display = 'none';
            successView.style.display = 'flex';
        });
    }

    // Carga inicial
    renderCart();
});
