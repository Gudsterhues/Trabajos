document.addEventListener('DOMContentLoaded', function() {
    const menuButton = document.getElementById('menuDesplegable');
    const menuLista = document.getElementById('menuLista');
    
    // Alternar menú al hacer clic en el botón
    menuButton.addEventListener('click', function() {
        menuLista.classList.toggle('active');
    });
    
    // Cerrar menú al hacer clic fuera de él
    document.addEventListener('click', function(event) {
        if (!menuButton.contains(event.target) && !menuLista.contains(event.target)) {
            menuLista.classList.remove('active');
        }
    });
    
    // Cerrar menú al seleccionar una opción (en móviles)
    const menuLinks = document.querySelectorAll('.menu-lista a');
    menuLinks.forEach(link => {
        link.addEventListener('click', function() {
            menuLista.classList.remove('active');
            
            // Desplazamiento suave a la sección
            const targetId = this.getAttribute('href');
            if (targetId.startsWith('#')) {
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Cerrar menú al presionar la tecla Escape
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            menuLista.classList.remove('active');
        }
    });
});