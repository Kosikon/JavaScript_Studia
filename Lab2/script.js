document.addEventListener("DOMContentLoaded", () => {
    let currentIndex = 0;
    let isPaused = false;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const nextButton = document.getElementById('next');
    const prevButton = document.getElementById('prev');
    const dotsContainer = document.querySelector('.dots');
    let autoSlideInterval;

    const createDots = () => {
        slides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                goToSlide(index);
                restartAutoSlide();
            });
            dotsContainer.appendChild(dot);
        });
    };

    const updateDots = () => {
        document.querySelectorAll('.dots .dot').forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    const goToSlide = (index) => {
        slides.forEach((slide, i) => {
            slide.style.transform = `translateX(${100 * (i - index)}%)`;
        });
        currentIndex = index;
        updateDots();
    };

    const autoSlide = () => {
        if (!isPaused) {
            goToSlide((currentIndex + 1) % totalSlides);
        }
    };

    const togglePause = () => {
        isPaused = !isPaused;
        if (!isPaused) {
            restartAutoSlide();
        }
    };

    const restartAutoSlide = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(autoSlide, 3000); // Co 3 sekundy
    };

    nextButton.addEventListener('click', () => {
        goToSlide((currentIndex + 1) % totalSlides);
        restartAutoSlide();
    });

    prevButton.addEventListener('click', () => {
        goToSlide((currentIndex - 1 + totalSlides) % totalSlides);
        restartAutoSlide();
    });

    // Możesz dodać przycisk pauzy lub obsługiwać pauzę na kliknięcie slajdu, np.:
    // document.getElementById('slider').addEventListener('click', togglePause);

    createDots();
    goToSlide(0); // Ustawia początkowy slajd
    restartAutoSlide(); // Rozpoczęcie automatycznego przewijania
});
