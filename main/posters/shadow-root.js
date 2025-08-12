class RotatingCard extends HTMLElement {
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: 'open' });
    const nonce = window.__nonce__ || '';

    const baseStyle = document.createElement('style');
    if(nonce){baseStyle.setAttribute('nonce', nonce);
      }
    baseStyle.textContent = `
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
    `;
    this.shadow.appendChild(baseStyle);

    // HTML struktura
    const wrapper = document.createElement('div');
    wrapper.classList.add('card');
    wrapper.innerHTML = `
      <div class="inner">
        <div class="face front"></div>
        <div class="face back"></div>
      </div>
    `;
    this.shadow.appendChild(wrapper);
  }

  connectedCallback() {
    const frontUrl = this.getAttribute('front-img') || '';
    const backUrl = this.getAttribute('back-img') || '';
    const nonce = window.__nonce__ || '';
    const imgStyle = document.createElement('style');
    if (nonce) imgStyle.setAttribute('nonce', nonce);
    imgStyle.textContent = `
      .front { background-image: url('${frontUrl}'); }
      .back { background-image: url('${backUrl}'); background: white; }
    `;
    this.shadow.appendChild(imgStyle);

    // Rotace při viditelnosti na mobilu
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
            inner.classList.add('rotate-always');
          } else {
            inner.classList.remove('rotate-always');
          }
        }
      },
      { root: null, threshold: 0.6 }
    );

    observer.observe(this);
  }
}

customElements.define('rotating-card', RotatingCard);
