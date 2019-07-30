class Slider {
  constructor(options) {
    // slider block id
    this.element = options.element || document.getElementById('slider');
    // slide change speed (milliseconds)
    this.speed = options.speed || 500;
    // show side buttons (true or false)
    this.controls = options.controls || false;
    // show pager (true or false)
    this.pager = options.pager || false;
    // select animation ('slick' or 'fade')
    this.animationsType = options.animationsType || 'fade';
    // slider infinite slides (true or false)
    this.infinite = options.infiniteSlides || false;
    // initial slide (1 - max slides)
    this.slideIndex = options.startSlide - 1 || 1;
    // automatic slide change (true or false)
    this.autoPlayer = options.autoPlayer || false;
    // automatic slide change speed (milliseconds)
    this.autoPlayerSpeed = options.autoPlayerSpeed || 5000;

    this.slider = this.element.querySelectorAll('div');
    this.sliderLength = this.slider.length;

    this.init();
  }

  init() {
    this.wrapSliderBlock();
    this.drawPager();
    this.drawControls();
    this.addStyles();
    this.moveTo(this.slideIndex);
    this.autoPlay();
    this.autoPlayBlock();
    this.touchEvents();
  }

  showSlides() {
    this.animationPlay();
    this.pagerUi();
  }

  moveToPrev() {
    this.moveTo(this.slideIndex - 1);
  }

  moveToNext() {
    this.moveTo(this.slideIndex + 1);
  }

  moveTo(n) {
    if (this.infinite) {
      if (n > this.sliderLength - 1) {
        this.slideIndex = 0;
      } else if (n < 0) {
        this.slideIndex = this.sliderLength - 1;
      } else {
        this.slideIndex = n;
      }
    } else if (!this.infinite) {
      if (n > this.sliderLength - 1) {
        this.slideIndex = this.sliderLength - 1;
      } else if (n < 0) {
        this.slideIndex = 0;
      } else {
        this.slideIndex = n;
      }
      this.controlsUi(n);
    }
    this.showSlides(this.slideIndex);
  }

  wrapSliderBlock() {
    this.viewport = document.createElement('div');
    this.viewport.className = 'viewport';
    this.element.parentNode.insertBefore(this.viewport, this.element);
    this.viewport.appendChild(this.element);
  }

  addStyles() {
    this.element.style.width = `calc(100% * ${this.sliderLength})`;
    this.element.style.transition = `${this.speed}ms all`;
    this.element.style.webkitTransition = `${this.speed}ms all`;
    this.element.style.mozTransition = `${this.speed}ms all`;
    for (let i = 0; i < this.sliderLength; i += 1) {
      const child = this.element.children[i];
      child.style.float = 'left';
      child.style.animationDuration = `${this.speed}ms`;
      child.style.webkitAnimationDuration = `${this.speed}ms`;
      child.style.mozAnimationDuration = `${this.speed}ms`;
      child.style.width = `calc(100% / ${this.sliderLength})`;
    }
  }

  drawPager() {
    if (this.pager) {
      this.dotsContainer = document.createElement('div');

      this.dotsContainer.classList.add('buttons_container');
      this.viewport.appendChild(this.dotsContainer);

      for (let i = 0; i < this.sliderLength; i += 1) {
        const dot = document.createElement('button');

        dot.classList.add('dot');
        this.dotsContainer.appendChild(dot);
        dot.addEventListener('click', () => this.moveTo(i));
      }
    }
    this.dots = this.viewport.getElementsByClassName('dot');
  }

  pagerUi() {
    if (this.pager) {
      this.activeDot = this.dotsContainer.querySelector('.active');
      if (this.activeDot) {
        this.activeDot.classList.remove('active');
      }
      this.dots[this.slideIndex].classList.add('active');
    }
  }

  drawControls() {
    if (this.controls) {
      const buttonPrev = document.createElement('button');
      const buttonNext = document.createElement('button');

      buttonPrev.classList.add('prev');
      buttonPrev.innerHTML = '&#10094';
      this.viewport.appendChild(buttonPrev);
      buttonPrev.addEventListener('click', () => this.moveToPrev());

      buttonNext.classList.add('next');
      buttonNext.innerHTML = '&#10095';
      this.viewport.appendChild(buttonNext);
      buttonNext.addEventListener('click', () => this.moveToNext());
    }
    this.next = this.viewport.querySelector('.next');
    this.prev = this.viewport.querySelector('.prev');
  }

  controlsUi(n) {
    this.next.style.display = 'block';
    this.prev.style.display = 'block';
    if (n === this.sliderLength - 1 || n > this.sliderLength - 1) {
      this.next.style.display = 'none';
    }
    if (n === 0 || n < 0) {
      this.prev.style.display = 'none';
    }
  }

  animationPlay() {
    if (this.animationsType === 'fade') {
      for (let i = 0; i < this.sliderLength; i += 1) {
        this.slider[i].style.animationName = 'fade';
        this.slider[i].style.webkitAnimationName = 'fade';
        this.slider[i].style.mozAnimationName = 'fade';
        this.slider[i].style.display = 'none';
      }
      this.slider[this.slideIndex].style.display = 'block';
    }
    if (this.animationsType === 'slick') {
      this.element.style.transform = `translateX(-${this.slideIndex *
        (100 / this.sliderLength)}%)`;
      this.element.style.webkitTransform = `translateX(-${this.slideIndex *
        (100 / this.sliderLength)}%)`;
      this.element.style.mozTransform = `translateX(-${this.slideIndex *
        (100 / this.sliderLength)}%)`;
    }
  }

  touchEvents() {
    let start;
    let end;

    const startFunc = (e) => {
      start = e.changedTouches[0].clientX;
    };

    const endFunc = (e) => {
      end = e.changedTouches[0].clientX;
      if (start + 100 <= end) {
        this.moveToPrev();
      } else if (start - 100 >= end) {
        this.moveToNext();
      }
    };

    this.viewport.addEventListener('touchstart', startFunc);
    this.viewport.addEventListener('touchend', endFunc);
  }

  autoPlay() {
    if (this.autoPlayer) {
      this.interval = setInterval(
        () => this.moveToNext(),
        this.autoPlayerSpeed
      );
    }
  }

  autoPlayBlock() {
    if (this.autoPlayer) {
      this.viewport.addEventListener('mouseenter', () =>
        clearInterval(this.interval)
      );
      this.viewport.addEventListener('mouseleave', () => this.autoPlay());
    }
  }
}

// eslint-disable-next-line no-new
new Slider({
  element: document.getElementById('slider'),
  speed: 1000,
  controls: true,
  pager: true,
  animationsType: 'slick',
  infiniteSlides: true,
  startSlide: 1,
  autoPlayer: false,
  autoPlayerSpeed: 5000,
});
