document.addEventListener('DOMContentLoaded', function() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const logoLink = document.querySelector('.logo');
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const header = document.querySelector('.header');
    const prayerForm = document.getElementById('prayerForm');

    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');

        const spans = navToggle.querySelectorAll('span');
        spans[0].style.transform = navMenu.classList.contains('active')
            ? 'rotate(45deg) translateY(8px)'
            : 'none';
        spans[1].style.opacity = navMenu.classList.contains('active')
            ? '0'
            : '1';
        spans[2].style.transform = navMenu.classList.contains('active')
            ? 'rotate(-45deg) translateY(-8px)'
            : 'none';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });

    function smoothScroll(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');

        if (targetId === '#inicio') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        } else {
            const targetSection = document.querySelector(targetId);
            const headerHeight = header.offsetHeight;
            const targetPosition = targetSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', smoothScroll);
    });

    if (logoLink) {
        logoLink.addEventListener('click', smoothScroll);
    }

    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.background = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        }

        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('show');
        } else {
            scrollToTopBtn.classList.remove('show');
        }
    });

    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll('.service-card, .ministry-card, .value-item');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    prayerForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const whatsapp = document.getElementById('whatsapp').value;
        const prayer = document.getElementById('prayer').value.trim();

        // Validate WhatsApp number
        const whatsappNumbers = whatsapp.replace(/\D/g, '');

        // Check if all fields are filled
        if (!name || !whatsapp || !prayer) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            return;
        }

        // Validate WhatsApp format using Brazilian phone validation
        const phoneValidation = isValidBrazilianPhone(whatsappNumbers);
        if (!phoneValidation.valid) {
            alert(`Número de WhatsApp inválido!\n\n${phoneValidation.message}\n\nExemplo válido: (98) 98100-4176`);
            document.getElementById('whatsapp').focus();
            document.getElementById('whatsapp').style.borderColor = '#ff6b6b';
            showValidationMessage(document.getElementById('whatsapp'), phoneValidation.message);
            return;
        }

        // Format message for WhatsApp
        const message = `*PEDIDO DE ORAÇÃO*\n\n*Nome:* ${name}\n*WhatsApp:* ${whatsapp}\n\n*Pedido:* ${prayer}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);

        // WhatsApp API URL
        const whatsappURL = `https://wa.me/5598981004176?text=${encodedMessage}`;

        // Show success feedback
        const submitBtn = this.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Redirecionando para WhatsApp...';
        submitBtn.style.background = '#4caf50';

        // Open WhatsApp after a brief delay
        setTimeout(() => {
            window.open(whatsappURL, '_blank');
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
            this.reset();
            // Reset border colors
            document.getElementById('whatsapp').style.borderColor = '';
            removeValidationMessage(document.getElementById('whatsapp'));
        }, 1000);
    });

    // Function to validate Brazilian phone number
    function isValidBrazilianPhone(number) {
        const cleaned = number.replace(/\D/g, '');

        // Must have 11 digits
        if (cleaned.length !== 11) return false;

        // Extract parts
        const ddd = cleaned.substring(0, 2);
        const firstDigit = cleaned.charAt(2);
        const phoneNumber = cleaned.substring(2);

        // Valid Brazilian DDDs
        const validDDDs = [
            '11', '12', '13', '14', '15', '16', '17', '18', '19', // São Paulo
            '21', '22', '24', // Rio de Janeiro
            '27', '28', // Espírito Santo
            '31', '32', '33', '34', '35', '37', '38', // Minas Gerais
            '41', '42', '43', '44', '45', '46', // Paraná
            '47', '48', '49', // Santa Catarina
            '51', '53', '54', '55', // Rio Grande do Sul
            '61', // Distrito Federal
            '62', '64', // Goiás
            '63', // Tocantins
            '65', '66', // Mato Grosso
            '67', // Mato Grosso do Sul
            '68', // Acre
            '69', // Rondônia
            '71', '73', '74', '75', '77', // Bahia
            '79', // Sergipe
            '81', '87', // Pernambuco
            '82', // Alagoas
            '83', // Paraíba
            '84', // Rio Grande do Norte
            '85', '88', // Ceará
            '86', '89', // Piauí
            '91', '93', '94', // Pará
            '92', '97', // Amazonas
            '95', // Roraima
            '96', // Amapá
            '98', '99' // Maranhão
        ];

        // Check if DDD is valid
        if (!validDDDs.includes(ddd)) {
            return { valid: false, message: 'DDD inválido' };
        }

        // Mobile numbers must start with 9
        if (firstDigit !== '9') {
            return { valid: false, message: 'Número de celular deve começar com 9' };
        }

        // Second digit of mobile must be 6-9
        const secondDigit = cleaned.charAt(3);
        if (!['6', '7', '8', '9'].includes(secondDigit)) {
            return { valid: false, message: 'Número de celular inválido' };
        }

        // Check for repeated patterns (like 99999-9999)
        const lastDigits = cleaned.substring(3);
        if (/^(\d)\1{7,}$/.test(lastDigits)) {
            return { valid: false, message: 'Número inválido (sequência repetida)' };
        }

        return { valid: true, message: 'Número válido' };
    }

    // Mask and validation for WhatsApp field
    const whatsappField = document.getElementById('whatsapp');
    if (whatsappField) {
        whatsappField.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            let formatted = '';

            // Limit to 11 digits
            value = value.substring(0, 11);

            if (value.length > 0) {
                formatted = '(' + value.substring(0, 2);
            }
            if (value.length >= 3) {
                formatted += ') ' + value.substring(2, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 11);
            }

            e.target.value = formatted;

            // Real-time validation feedback
            if (value.length === 11) {
                const validation = isValidBrazilianPhone(value);
                if (validation.valid) {
                    e.target.style.borderColor = '#4caf50';
                    e.target.setCustomValidity('');
                    removeValidationMessage(e.target);
                } else {
                    e.target.style.borderColor = '#ff6b6b';
                    e.target.setCustomValidity(validation.message);
                    showValidationMessage(e.target, validation.message);
                }
            } else if (value.length > 0) {
                e.target.style.borderColor = '#ff6b6b';
                e.target.setCustomValidity('Digite o número completo com DDD');
            } else {
                e.target.style.borderColor = '';
                e.target.setCustomValidity('');
                removeValidationMessage(e.target);
            }
        });

        // Validate on blur
        whatsappField.addEventListener('blur', function(e) {
            const value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                const validation = isValidBrazilianPhone(value);
                if (!validation.valid) {
                    e.target.style.borderColor = '#ff6b6b';
                    showValidationMessage(e.target, validation.message || 'Número de WhatsApp inválido');
                } else {
                    e.target.style.borderColor = '#4caf50';
                    removeValidationMessage(e.target);
                }
            }
        });
    }

    // Function to show validation message
    function showValidationMessage(element, message) {
        removeValidationMessage(element);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'validation-error';
        errorDiv.textContent = message;
        errorDiv.style.color = '#ff6b6b';
        errorDiv.style.fontSize = '0.85rem';
        errorDiv.style.marginTop = '5px';
        element.parentElement.appendChild(errorDiv);
    }

    // Function to remove validation message
    function removeValidationMessage(element) {
        const existingError = element.parentElement.querySelector('.validation-error');
        if (existingError) {
            existingError.remove();
        }
    }

    const heroScroll = document.querySelector('.hero-scroll');
    if (heroScroll) {
        heroScroll.addEventListener('click', function() {
            const aboutSection = document.getElementById('sobre');
            const headerHeight = header.offsetHeight;
            const targetPosition = aboutSection.offsetTop - headerHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    }

    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.innerHTML = `&copy; ${currentYear} Igreja Batista Nacional Filadélfia. Todos os direitos reservados.`;
    }

    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    const ministryCards = document.querySelectorAll('.ministry-card');
    ministryCards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
    });

    function parallaxEffect() {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    }

    window.addEventListener('scroll', parallaxEffect);

    const counters = [
        { element: null, target: 500, label: 'Membros', duration: 2000 },
        { element: null, target: 15, label: 'Anos de História', duration: 2000 },
        { element: null, target: 10, label: 'Ministérios', duration: 2000 }
    ];

    function animateCounter(element, target, duration) {
        let current = 0;
        const increment = target / (duration / 16);
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(current);
            }
        }, 16);
    }

    const lazyImages = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });

    lazyImages.forEach(img => imageObserver.observe(img));

    function handleResize() {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            document.body.classList.add('mobile');
        } else {
            document.body.classList.remove('mobile');
            navMenu.classList.remove('active');
        }
    }

    window.addEventListener('resize', handleResize);
    handleResize();

    const touchStartX = { value: 0 };
    const touchEndX = { value: 0 };

    document.addEventListener('touchstart', e => {
        touchStartX.value = e.changedTouches[0].screenX;
    });

    document.addEventListener('touchend', e => {
        touchEndX.value = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchEndX.value - touchStartX.value;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }
        }
    }
});