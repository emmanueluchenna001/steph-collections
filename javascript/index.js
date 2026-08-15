const slides = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");

const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

const dots = document.querySelectorAll(".dot");

if (slides && next && prev && dots.length > 0) {

    let index = 0;

    function updateSlider() {

        slides.style.transform = `translateX(-${index * 100}%)`;

        dots.forEach(dot => dot.classList.remove("active"));

        dots[index].classList.add("active");
    }

    next.addEventListener("click", () => {

        index++;

        if (index >= slide.length) {
            index = 0;
        }

        updateSlider();

    });

    prev.addEventListener("click", () => {

        index--;

        if (index < 0) {
            index = slide.length - 1;
        }

        updateSlider();

    });

    dots.forEach((dot, i) => {

        dot.addEventListener("click", () => {

            index = i;
            updateSlider();

        });

    });

    setInterval(() => {

        index++;

        if (index >= slide.length) {
            index = 0;
        }

        updateSlider();

    }, 4000);

}