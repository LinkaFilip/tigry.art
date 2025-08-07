class RotatingCard extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });

    this.shadow.innerHTML = `
      <style>
        .card {
          padding: 0px;
          width: 300px;
          height: 400px;
          perspective: 1000px;
          display: flex;
          align-content: center;
        }

        .inner {
          width: 100%;
          height: 100%;
          position: relative;
          transform-style: preserve-3d;
          transition: transform 0.5s;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        @keyframes spin {
          from { transform: rotateY(0deg); }
          to   { transform: rotateY(360deg); }
        }

        .card:hover .inner {
          animation: spin 4s linear infinite;
        }

        .rotate-always {
          animation: spin 4s linear infinite !important;
        }

        .face {
          position: absolute;
          width: 80%;
          height: 80%;
          backface-visibility: hidden;
          overflow: hidden;
          background-size: cover;
          background-position: center;
        }

        .back {
          transform: rotateY(180deg);
        }
      </style>

      <div class="card">
        <div class="inner">
          <div class="face front"></div>
          <div class="face back"></div>
        </div>
      </div>
    `;
  }

connectedCallback() {
  const frontFace = this.shadowRoot.querySelector('.front');
  const backFace = this.shadowRoot.querySelector('.back');
  const inner = this.shadowRoot.querySelector('.inner');
  const frontUrl = this.getAttribute('front-img') || '';
  const backUrl = this.getAttribute('back-img') || '';

  frontFace.style.backgroundImage = `url('${frontUrl}')`;
  backFace.style.backgroundImage = `url('${backUrl}')`;
  backFace.style.background = "white";

  const observer = new IntersectionObserver(
    (entries) => {
      if (window.innerWidth > 1000) return;

      for (const entry of entries) {
        const card = entry.target;
        const inner = card.shadowRoot.querySelector('.inner');

        if (entry.isIntersecting) {
          document.querySelectorAll('rotating-card').forEach(el => {
            if (el !== card) {
              el.shadowRoot.querySelector('.inner')?.classList.remove('rotate-always');
            }
          });

          // Přidáme rotaci této jediné kartě
          inner.classList.add('rotate-always');
        } else {
          inner.classList.remove('rotate-always');
        }
      }
    },
    {
      root: null,
      threshold: 0.6, // musí být alespoň 60 % vidět
    }
  );

  observer.observe(this);
}
}

customElements.define('rotating-card', RotatingCard);
