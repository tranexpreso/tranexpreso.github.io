document.addEventListener('DOMContentLoaded', () => {
    // 1. Menú Hamburguesa
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    // 2. Animación de Scroll (Fade in)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.card, .section-title, .hero-content').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s ease-out';
        observer.observe(el);
    });

    // 3. Lógica del Formulario hacia WhatsApp (CON PLANTILLA BONITA)
    const contactForm = document.getElementById('whatsapp-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nombre = document.getElementById('nombre').value;
            const telefono = document.getElementById('telefono').value;
            const servicio = document.getElementById('servicio').value;
            const mensaje = document.getElementById('mensaje').value;
            
            const numeroWhatsApp = '5352170105'; 
            
            // Plantilla predefinida usando formato de WhatsApp (*negrita*, saltos de línea %0A)
            const texto = 
                `*🚀 NUEVA SOLICITUD DESDE LA WEB*%0A%0A` +
                `*👤 Nombre:* ${nombre}%0A` +
                `*📞 Teléfono:* ${telefono}%0A` +
                `*🚚 Servicio de interés:* ${servicio}%0A%0A` +
                `*📝 Mensaje:*%0A${mensaje}%0A%0A` +
                `_Mensaje generado automáticamente desde tranexpreso.github.io_`;
            
            window.open(`https://wa.me/${numeroWhatsApp}?text=${texto}`, '_blank');
        });
    }
});