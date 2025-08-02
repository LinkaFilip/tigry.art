  class RotatingCard extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });

      shadow.innerHTML = `
        <style>
          .card {
            padding: 0px;
            width: 300px;
            height: 400px;
            perspective: 1000px;
            display flex;
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
            from {
              transform: rotateY(0deg);
            }
            to {
              transform: rotateY(360deg);
            }
          }
          .card:hover .inner {
            animation: spin 4s linear infinite;
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

          .front {
          }

          .back {
            transform: rotateY(180deg);
          }
            @media (max-width: 1000px) {
              .rotate {
                animation: spin 2s linear infinite;
              }
            }

            @keyframes spin {
              from { transform: rotate(0deg); }
              to   { transform: rotate(360deg); }
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
      const frontUrl = this.getAttribute('front-img') || '';
      const backUrl = this.getAttribute('back-img') || '';

      frontFace.style.backgroundImage = `url('${frontUrl}')`;
      backFace.style.backgroundImage = `url('${backUrl}')`;
    }
  }

  customElements.define('rotating-card', RotatingCard);