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
            justify-content: center;
            align-content: center;

          }

          .inner {
            width: 100%;
            height: 100%;
            position: relative;
            transform-style: preserve-3d;
            transition: transform 0.5s;

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
            position: relative;
            width: 100%;
            height: 100%;
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