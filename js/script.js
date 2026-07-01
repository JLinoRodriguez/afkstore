document.addEventListener('DOMContentLoaded', () => {
    // Menú responsivo
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.querySelector('header nav');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');

            // Cambiar el icono entre barras y X
            const icon = menuToggle.querySelector('i');
            if (icon) {
                if (navMenu.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
    }



    // ELEMENTOS DE PERFIL GAMER
    const inputFoto = document.getElementById('input-foto');
    const btnSubirFoto = document.getElementById('btn-subir-foto');
    const avatarDisplayPic = document.getElementById('avatar-display-pic');
    const profileAvatarWrapper = document.getElementById('profile-avatar-wrapper');

    const profileForm = document.getElementById('profile-form');
    const profileFullName = document.getElementById('profile-fullname');
    const profileAlias = document.getElementById('profile-alias');
    const profileEmail = document.getElementById('profile-email');
    const profilePassword = document.getElementById('profile-password');
    
    // Elementos de la Cabecera de Vista Previa
    const headerAlias = document.getElementById('header-alias');
    const headerConnectionStatus = document.getElementById('header-connection-status');
    const headerStatusMsg = document.getElementById('header-status-msg');
    const profileBannerContainer = document.getElementById('profile-banner-container');
    const previewTotalReviews = document.getElementById('preview-total-reviews');

    // Inputs del Formulario Público
    const profileConnection = document.getElementById('profile-connection');
    const profileStatusInput = document.getElementById('profile-status-input');
    const profileBannerSelect = document.getElementById('profile-banner-select');

    // Inputs del Formulario Social
    const socialFb = document.getElementById('social-fb');
    const socialTw = document.getElementById('social-tw');
    const socialIg = document.getElementById('social-ig');
    const socialLi = document.getElementById('social-li');

    // 1. Carga inicial del Perfil desde LocalStorage
    function loadProfile() {
        const savedProfile = JSON.parse(localStorage.getItem('userProfile')) || {
            name: "Diego Salas",
            alias: "Kratos_Abancay99",
            email: "fantasmadesparta@gmail.com",
            avatar: "https://i.pravatar.cc/300?img=11",
            connection: "online",
            statusMsg: "Ausente comprando pan...",
            banner: "default",
            social: { fb: "", tw: "", ig: "", li: "" }
        };

        // Rellenar visualmente la cabecera
        if (avatarDisplayPic) avatarDisplayPic.src = savedProfile.avatar;
        if (headerAlias) headerAlias.textContent = savedProfile.alias;
        
        let connText = "En línea";
        if (savedProfile.connection === "playing") connText = "Jugando";
        if (savedProfile.connection === "away") connText = "Ausente";
        if (headerConnectionStatus) headerConnectionStatus.textContent = connText;
        if (headerStatusMsg) headerStatusMsg.textContent = savedProfile.statusMsg;

        if (profileAvatarWrapper) {
            profileAvatarWrapper.className = `perfil-header-avatar-wrapper status-${savedProfile.connection}`;
        }
        if (profileBannerContainer) {
            profileBannerContainer.className = `perfil-cabecera banner-${savedProfile.banner}`;
        }

        // Rellenar los inputs del formulario
        if (profileFullName) profileFullName.value = savedProfile.name || "";
        if (profileAlias) profileAlias.value = savedProfile.alias || "";
        if (profileEmail) profileEmail.value = savedProfile.email || "";
        if (profileConnection) profileConnection.value = savedProfile.connection || "online";
        if (profileStatusInput) profileStatusInput.value = savedProfile.statusMsg || "";
        if (profileBannerSelect) profileBannerSelect.value = savedProfile.banner || "default";
        if (profilePassword) profilePassword.value = savedProfile.password || "********";

        if (savedProfile.social) {
            if (socialFb) socialFb.value = savedProfile.social.fb || "";
            if (socialTw) socialTw.value = savedProfile.social.tw || "";
            if (socialIg) socialIg.value = savedProfile.social.ig || "";
            if (socialLi) socialLi.value = savedProfile.social.li || "";
        }

        // Mostrar número de reseñas creadas por el usuario en comunidad
        updateReviewsCount(savedProfile.alias);
    }

    function updateReviewsCount(aliasName) {
        if (!previewTotalReviews) return;
        const posts = JSON.parse(localStorage.getItem('communityPosts')) || [];
        const count = posts.filter(p => p.author === aliasName).length;
        previewTotalReviews.textContent = count;
    }

    // 2. Subida de foto local (PC) con FileReader y base64
    if (btnSubirFoto && inputFoto && avatarDisplayPic) {
        btnSubirFoto.addEventListener('click', (e) => {
            e.preventDefault();
            inputFoto.click();
        });

        inputFoto.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    avatarDisplayPic.src = event.target.result;
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // 3. Sincronización en vivo (Live Previews)
    if (profileAlias && headerAlias) {
        profileAlias.addEventListener('input', () => {
            headerAlias.textContent = profileAlias.value || "Alias Gamer";
        });
    }

    if (profileStatusInput && headerStatusMsg) {
        profileStatusInput.addEventListener('input', () => {
            headerStatusMsg.textContent = profileStatusInput.value || "";
        });
    }

    if (profileConnection && headerConnectionStatus && profileAvatarWrapper) {
        profileConnection.addEventListener('change', () => {
            const val = profileConnection.value;
            profileAvatarWrapper.className = `perfil-header-avatar-wrapper status-${val}`;
            
            let connText = "En línea";
            if (val === "playing") connText = "Jugando";
            if (val === "away") connText = "Ausente";
            headerConnectionStatus.textContent = connText;
        });
    }

    if (profileBannerSelect && profileBannerContainer) {
        profileBannerSelect.addEventListener('change', () => {
            const val = profileBannerSelect.value;
            profileBannerContainer.className = `perfil-cabecera banner-${val}`;
        });
    }

    // 4. Sistema de Pestañas (Tab switcher)
    const tabButtons = document.querySelectorAll('.tab-perfil-btn');
    const sections = document.querySelectorAll('.form-section-content');

    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-target');
            sections.forEach(sec => {
                if (sec.id === targetId) {
                    sec.style.display = 'block';
                    sec.classList.add('active');
                } else {
                    sec.style.display = 'none';
                    sec.classList.remove('active');
                }
            });
        });
    });

    // 5. Guardar cambios en el Perfil Gamer
    let isEditing = false;
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = profileForm.querySelector('.btn-save-profile-changes');

            if (!isEditing) {
                // Desbloquear campos para editar
                const inputs = profileForm.querySelectorAll('input, select');
                inputs.forEach(input => {
                    if (input.id !== 'profile-password') {
                        input.disabled = false;
                    }
                });
                if (btnSubirFoto) btnSubirFoto.disabled = false;
                const btnCambiarContrasena = document.getElementById('btn-cambiar-contrasena');
                if (btnCambiarContrasena) btnCambiarContrasena.disabled = false;

                isEditing = true;
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Guardar Cambios';
                }
            } else {
                // Guardar cambios
                const aliasVal = profileAlias ? profileAlias.value.trim() : "";
                if (!aliasVal) {
                    alert("Por favor, ingresa un alias de jugador.");
                    return;
                }

                const updatedProfile = {
                    name: profileFullName ? profileFullName.value.trim() : "",
                    alias: aliasVal,
                    email: profileEmail ? profileEmail.value.trim() : "",
                    avatar: avatarDisplayPic ? avatarDisplayPic.src : "https://i.pravatar.cc/300?img=11",
                    connection: profileConnection ? profileConnection.value : "online",
                    statusMsg: profileStatusInput ? profileStatusInput.value.trim() : "",
                    banner: profileBannerSelect ? profileBannerSelect.value : "default",
                    password: profilePassword ? profilePassword.value : "********",
                    social: {
                        fb: socialFb ? socialFb.value.trim() : "",
                        tw: socialTw ? socialTw.value.trim() : "",
                        ig: socialIg ? socialIg.value.trim() : "",
                        li: socialLi ? socialLi.value.trim() : ""
                    }
                };

                // Guardar en LocalStorage
                localStorage.setItem('userProfile', JSON.stringify(updatedProfile));

                // Actualizar contador visual de reseñas
                updateReviewsCount(aliasVal);

                // Bloquear campos de nuevo
                const inputs = profileForm.querySelectorAll('input, select');
                inputs.forEach(input => {
                    input.disabled = true;
                });
                if (btnSubirFoto) btnSubirFoto.disabled = true;
                const btnCambiarContrasena = document.getElementById('btn-cambiar-contrasena');
                if (btnCambiarContrasena) btnCambiarContrasena.disabled = true;

                isEditing = false;
                if (submitBtn) {
                    submitBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i> Actualizar';
                }

                alert("¡Tu Perfil Gamer de AFK Store ha sido guardado y sincronizado!");
            }
        });
    }

    // Toggle visibilidad de contraseña (soporta múltiples inputs)
    const togglePasswordButtons = document.querySelectorAll('.toggle-password-btn');
    togglePasswordButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const container = btn.closest('.password-input-container');
            if (container) {
                const input = container.querySelector('input');
                const icon = btn.querySelector('i');
                if (input && icon) {
                    const isPassword = input.getAttribute('type') === 'password';
                    input.setAttribute('type', isPassword ? 'text' : 'password');
                    icon.className = isPassword ? 'fa-solid fa-eye-slash' : 'fa-solid fa-eye';
                }
            }
        });
    });

    // Control de la Ventana Emergente (Modal Cambiar Contraseña)
    const modalCambiarContrasena = document.getElementById('modal-cambiar-contrasena');
    const btnCambiarContrasena = document.getElementById('btn-cambiar-contrasena');
    const btnCerrarModal = document.getElementById('btn-cerrar-modal');
    const btnModalAceptar = document.getElementById('btn-modal-aceptar');
    
    const modalNewPassword = document.getElementById('modal-new-password');
    const modalConfirmPassword = document.getElementById('modal-confirm-password');

    if (btnCambiarContrasena && modalCambiarContrasena) {
        // Abrir modal
        btnCambiarContrasena.addEventListener('click', () => {
            if (modalNewPassword) modalNewPassword.value = '';
            if (modalConfirmPassword) modalConfirmPassword.value = '';
            if (btnModalAceptar) btnModalAceptar.disabled = true;
            modalCambiarContrasena.style.display = 'flex';
        });
    }

    if (btnCerrarModal && modalCambiarContrasena) {
        // Cerrar modal al hacer clic en la X
        btnCerrarModal.addEventListener('click', () => {
            modalCambiarContrasena.style.display = 'none';
        });
    }

    // Validación en tiempo real de contraseñas idénticas
    function validateModalPasswords() {
        if (modalNewPassword && modalConfirmPassword && btnModalAceptar) {
            const passVal = modalNewPassword.value;
            const confirmVal = modalConfirmPassword.value;
            
            // Habilitar botón de aceptar solo si coinciden y no están vacías
            if (passVal && confirmVal && passVal === confirmVal) {
                btnModalAceptar.disabled = false;
            } else {
                btnModalAceptar.disabled = true;
            }
        }
    }

    if (modalNewPassword) {
        modalNewPassword.addEventListener('input', validateModalPasswords);
    }
    if (modalConfirmPassword) {
        modalConfirmPassword.addEventListener('input', validateModalPasswords);
    }

    if (btnModalAceptar && modalCambiarContrasena && profilePassword) {
        // Al hacer clic en aceptar, se actualiza el input contraseña principal y se cierra el modal
        btnModalAceptar.addEventListener('click', () => {
            profilePassword.value = modalNewPassword.value;
            modalCambiarContrasena.style.display = 'none';
        });
    }

    // Carga inicial
    loadProfile();
});
