document.addEventListener("DOMContentLoaded", async () => {
const deliveryRadios = document.querySelectorAll('input[name="deliveryMethod"]');
const packetaButton = document.getElementById("packeta-button");
  const SHIPPING_COST = {
    AU: 4400, AT: 1480, BE: 1630, CA: 3700, CZ: 530, DK: 1944, FI: 2630, FR: 1944,
    DE: 1200, HK: 4400, IE: 2150, IL: 4400, IT: 1944, JP: 4400, MY: 4400, NL: 1627,
    NZ: 4275, NO: 4300, PL: 1025, PT: 2152, SG: 4400, KR: 4400, ES: 2360, SE: 2632,
    CH: 4260, AE: 4275, GB: 2920, US: 3661,
  };

  const stripe = Stripe("pk_test_51LpXXlEqK4P4Y8FRSczm8KCIMxVjzLerGMsgdEK3HeICDVhbkk94wahUTxP7BcNIMXIzmf8fSWn5GddCAVXQlBrO00WN9j5yNb");
  const elements = stripe.elements();

  const selectElement = document.getElementById("Select0");
  const payButton = document.getElementById("pay-button");
  const subtotalDisplay = document.getElementById("subtotal-price");
  const shippingDisplay = document.getElementById("shipping-price");
  const totalDisplay = document.getElementById("total-price");
  const shippingSummary = document.getElementById("shipping-summary");



packetaButton.addEventListener("click", (e) => {
  e.preventDefault();

  Packeta.Widget.pick({}, function (point) {
    if (point) {
      const type = point.pickup_point_type || point.type;

      let shippingMethod = "packeta";
      let shippingFee = 0;
      const countryCode = point.country.toLowerCase();
      localStorage.setItem("countryCode", countryCode);

      if (type === "zbox") {
        shippingMethod = "zbox";
      } else if (type === "external" || point.name.toLowerCase().includes("večerní")) {
        shippingMethod = "evening";
      }

      if (countryCode === "cz") {
        if (shippingMethod === "zbox") shippingFee = 300;
        else if (shippingMethod === "evening") shippingFee = 550;
        else shippingFee = 300;
      } else if (countryCode === "sk") {
        if (shippingMethod === "zbox") shippingFee = 300;
        else if (shippingMethod === "evening") shippingFee = 600;
        else shippingFee = 400;
      }

      localStorage.setItem("selectedBranchId", point.id);
      localStorage.setItem("selectedBranchName", point.name);
      localStorage.setItem("shippingMethod", shippingMethod);
      localStorage.setItem("shippingFee", shippingFee);    
      localStorage.setItem("selectedBranchStreet", point.street);
      localStorage.setItem("selectedBranchCity", point.city);
      localStorage.setItem("selectedBranchZip", point.zip);
      localStorage.setItem("selectedBranchType", point.type);
      localStorage.setItem("selectedBranchLongitude", point.longitude);
      localStorage.setItem("selectedBranchLatitude", point.latitude);
         
    let shipping = 0;
    const selectedRadio = document.querySelector('input[name="deliveryMethod"]:checked');
    if (selectedRadio && selectedRadio.value === "packeta") {
      shipping = Number(localStorage.getItem("shippingFee")) || 0;
    } else {
      shipping = SHIPPING_COST[getSelectedCountry()] || 0;
    }
      if(point.name){
        shippingDisplay.textContent = `€ ${(shipping / 100).toFixed(2)}`;
      }
      if(!point.name){
        shippingDisplay.textContent = "Enter shipping details";
      }
      packetaButton.innerText = `${point.name}`;
      updateUI();
    }
  });
});
function updateUI() {
  const selectedRadio = document.querySelector('input[name="deliveryMethod"]:checked');
  const selectedValue = selectedRadio?.value;

  if (selectedValue === "packeta") {
    packetaButton.style.display = "inline-block";

    const selectedBranchId = localStorage.getItem("selectedBranchId");
    const selectedBranchName = localStorage.getItem("selectedBranchName");
    packetaButton.innerText = selectedBranchId ? selectedBranchName : "Vybrat výdejní místo";
    payButton.disabled = !selectedBranchId;
    
    payButton.disabled = !localStorage.getItem("selectedBranchId");
    payButton.style.margin = "0px 0px 0px 0px";
    const shownElement = document.querySelector(".jHvVd");
    shownElement.style.display = "none";
    const all = document.querySelectorAll("._1fragem32._1fragemms.gfFXW");
    const space = all[1];
    if (space) {
      space.style.display = "none";
    }
    shippingDisplay.textContent = "Enter the shipping details";
  } else {
    packetaButton.style.display = "none";
    localStorage.removeItem("selectedBranchId");
    localStorage.removeItem("selectedBranchName");
    localStorage.removeItem("shippingMethod");
    localStorage.removeItem("shippingFee");
    payButton.disabled = false;
    payButton.style.margin = "0px 0px 0px 0px";
    const element = document.querySelector("._1fragemui._1fragemq6._1fragemqc._1fragemqo._1fragemqi._1fragem32._1fragemg9._1fragemi2._1fragemeg._1fragemjv._1fragemms");
    const shownElement = document.querySelector(".jHvVd");
    shownElement.style.display = "block";
    element.style.borderRadius = "8px";
    element.style.border = "1px solid black";
    const all = document.querySelectorAll("._1fragem32._1fragemms.gfFXW");
    const space = all[1];
    if (space) {
      space.style.display = "block";
    }
  }  
  updatePrices();
}
deliveryRadios.forEach(radio => {
  radio.addEventListener("change", () => {
      document.querySelectorAll('.delivery-option').forEach(label => {
        label.classList.remove('active');
      });
      radio.closest('label').classList.add('active');
    localStorage.setItem("shippingMethod", radio.value);
    updateUI();
  });
});
  const getCartFromCookie = () => {
    const cartCookie = document.cookie.split("; ").find(row => row.startsWith("cart="));
    return cartCookie ? JSON.parse(decodeURIComponent(cartCookie.split("=")[1])) : [];
  };

  const calculateSubtotal = () => {
    const cart = getCartFromCookie();
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const getSelectedCountry = () => selectElement.value;
  const getSelectedShipping = () => SHIPPING_COST[getSelectedCountry()] || 0;


  const promoInput = document.getElementById("ReductionsInput0");


const updatePrices = () => {
  const subtotal = calculateSubtotal();    
  const selectedRadio = document.querySelector('input[name="deliveryMethod"]:checked');

  if (selectedRadio) {
    localStorage.setItem("shippingMethod", selectedRadio.value);
  }

  const deliveryMethod = selectedRadio?.value || localStorage.getItem("shippingMethod");
  const country = localStorage.getItem("countryCode");
  const selectedBranchId = localStorage.getItem("selectedBranchId");
  const shippingFee = parseInt(localStorage.getItem("shippingFee"), 10) || 0;
  let shipping = 0;
  if (["packeta", "zbox", "evening"].includes(deliveryMethod)) {
    shipping = shippingFee;
  } else {
    shipping = getSelectedShipping();
  }

  const totalBeforeDiscount = subtotal + shipping / 100;
  
  const code = promoInput.value.trim().toUpperCase();
  const discountPercent = code === "TEST10" ? 10 : 0;
  const discountAmount = totalBeforeDiscount * (discountPercent / 100);
  const totalAfterDiscount = totalBeforeDiscount - discountAmount;
  const needsBranch = ["packeta", "zbox", "evening"].includes(deliveryMethod) && !selectedBranchId;

  if (needsBranch) {
    shippingDisplay.textContent = "Vyberte výdejní místo";
    subtotalDisplay.textContent = `€ ${subtotal.toFixed(2)}`;
    totalDisplay.textContent = `–`;
    shippingSummary.textContent = `–`;
    return;
  }
  subtotalDisplay.textContent = `€ ${subtotal.toFixed(2)}`;
  totalDisplay.textContent = `€ ${totalAfterDiscount.toFixed(2)}`;
  shippingDisplay.textContent = `${(shipping / 100).toFixed(2)} €`;

  const selectedCountryText = selectElement.options[selectElement.selectedIndex]?.text || country;
  shippingSummary.textContent = `Shipping to ${selectedCountryText} – € ${(getSelectedShipping() / 100).toFixed(2)}`;
  
  if (!country || !deliveryMethod) {
    console.warn("Chybí země nebo způsob dopravy!");
  }
  updateMobileContainer();
};
const containerIfMobile = document.querySelector("._19gi7yt0._19gi7yt12._19gi7yt1a._19gi7yt1l");

  const updateMobileContainer = () => {
  const subtotal = calculateSubtotal();
  let shipping = 0;
  const selectedRadio = document.querySelector('input[name="deliveryMethod"]:checked');
  if (selectedRadio && selectedRadio.value === "packeta") {
    shipping = Number(localStorage.getItem("shippingFee")) || 0;
  } else {
    shipping = SHIPPING_COST[getSelectedCountry()] || 0;
  }
  shippingDisplay.textContent = `€ ${(shipping / 100).toFixed(2)}`;
  containerIfMobile.textContent = `EUR ${ (subtotal + shipping / 100).toFixed(2) }`;
};
promoInput.addEventListener("input", updatePrices);

  const renderProductFromCart = () => {
    const cart = getCartFromCookie();
    const container = document.querySelector("._1ip0g651._1ip0g650._1fragemms._1fragem41._1fragem5a._1fragem73");
    container.innerHTML = "";


    cart.forEach(item => {
      const itemDiv = document.createElement('section');
      itemDiv.className = '_1fragem32 _1fragemms uniqueChild_uniqueChildTemplate_Az6bO8';
      itemDiv.innerHTML = `
        <div class="_1mjy8kn6 _1fragemms _16s97g73k" style="--_16s97g73f: 40vh;">
          <div tabindex="0" role="group" scrollbehaviour="chain" class="_1mjy8kn1 _1mjy8kn0 _1fragemms _1fragempm _1fragem2x _1fragemdm _16s97g73k _1mjy8kn4 _1mjy8kn2 _1fragemku _1frageml9 vyybB" style="--_16s97g73f: 40vh; overflow: hidden;">
            <div class="_6zbcq522 _1fragemth">
              <h3 id="ResourceList0" class="n8k95w1 n8k95w0 _1fragemms n8k95w4 n8k95wg">${item.name}</h3>
            </div>
            <div role="table" aria-labelledby="ResourceList0" class="_6zbcq56 _6zbcq55 _1fragem3c _1fragemou _6zbcq5o _6zbcq5c _1fragem50 _6zbcq516">
              <div role="rowgroup" class="_6zbcq54 _6zbcq53 _1fragem3c _1fragemou _6zbcq51d _6zbcq51c _1fragemth">
                <div role="row" class="_6zbcq51f _6zbcq51e _1fragem3c _1fragemni _1fragempm _1fragem6t">
                  <div role="columnheader" class="_6zbcq522 _1fragemth">Product image</div>
                  <div role="columnheader" class="_6zbcq522 _1fragemth">Description</div>
                  <div role="columnheader" class="_6zbcq522 _1fragemth">Quantity</div>
                  <div role="columnheader" class="_6zbcq522 _1fragemth">Price</div>
                </div>
              </div>
              <div role="rowgroup" class="_6zbcq54 _6zbcq53 _1fragem3c _1fragemou">
                <div role="row" class="_6zbcq51i _6zbcq51h _1fragem3c _1fragem2x _6zbcq51l _6zbcq510 _6zbcq51k">
                  <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51t _6zbcq51q _1fragem8w _6zbcq51o">
                    <div class="_1fragem32 _1fragemms _16s97g74b" style="--_16s97g746: 6.4rem;">
                      <div class="_5uqybw0 _1fragemms _1fragem3c _1fragem8h">
                        <div class="_5uqybw1 _1fragem3c _1fragemlt _1fragemp0 _1fragemu _1fragemnm _1fragem50 _1fragem6t _1fragem8h">
                          <div class="_1m6j2n34 _1m6j2n33 _1fragemms _1fragemui _1m6j2n3a _1m6j2n39 _1m6j2n35" style="--_1m6j2n30: 1;">
                            <picture>
                              <img src="${item.image}" style="width: 100%; height: 100%; object-fit: contain;" alt="${item.name}">
                            </picture>
                            <div class="_1m6j2n3m _1m6j2n3l _1fragemmi">
                              <div class="_99ss3s1 _99ss3s0 _1fragemni _1fragem87 _1fragempn _99ss3s6 _99ss3s2 _1fragem3c _99ss3sh _99ss3sc _99ss3sa _1fragemjb _1fragemhi _99ss3su _99ss3sp _1fragemq8 _1fragemqe _1fragemqq _1fragemqk">
                                <span class="_99ss3sw _1fragemth">Quantity</span>
                                <span>${item.quantity}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51u _6zbcq51r _1fragem87 _6zbcq51p _6zbcq51n _1fragemno _6zbcq51x _6zbcq51w _1fragemox _16s97g741" style="--_16s97g73w: 6.4rem;">
                    <div class="_1fragem32 _1fragemms dDm6x">
                      <p class="_1tx8jg70 _1fragemms _1tx8jg7c _1tx8jg7b _1fragemp3 _1tx8jg715 _1tx8jg71d _1tx8jg71f">${item.name}</p>
                      <p class="_1fragem12">${item.description || ''}</p>
                    </div>
                  </div>
                  <div role="cell" class="_6zbcq521 _6zbcq520 _1fragem3c _1fragemou _6zbcq51w _6zbcq51t _1fragemno _6zbcq51a _6zbcq519 _1fragemox" style="--_16s97g73w: 6.4rem;">
                    <span style="display: flex; justify-content: flex-end;">€ ${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      `;
      container.appendChild(itemDiv);
    });
  }; 
  selectElement.addEventListener("change", updatePrices);
  const createPaymentRequest = () => {
    const paymentRequest = stripe.paymentRequest({
      country: getSelectedCountry(),
      currency: "eur",
      total: {
        label: "Celková cena",
        amount: (calculateSubtotal() + getSelectedShipping() / 100) * 100,
      },
      promoCode: promoInput.value.trim() ,
      requestPayerName: true,
      requestPayerEmail: true,
    });

    const prButton = elements.create("paymentRequestButton", {
      paymentRequest,
      style: {
        paymentRequestButton: {
          type: "default",
          theme: "dark",
          height: "44px",
        },
      },
    });

    paymentRequest.canMakePayment().then(result => {
      if (result) {
        prButton.mount("#payment_request_button");
      } else {
        document.getElementById("payment_request_button").style.display = "none";
      }
    });
  };
  const style = {
    base: {
      fontSize: "16px",
      color: "#000000",
      "::placeholder": { color: "#aaa" },
    },
    invalid: { color: "#e5424d" },
  };
  const cardNumber = elements.create("cardNumber", { style });
  const cardExpiry = elements.create("cardExpiry", { style });
  const cardCvc = elements.create("cardCvc", { style });
  cardNumber.mount("#card-number-element");
  cardExpiry.mount("#card-expiry-element");
  cardCvc.mount("#card-cvc-element");
  renderProductFromCart();
  updatePrices();
  createPaymentRequest();
  selectElement.addEventListener("change", () => {
    updatePrices();
  });

containerIfMobile.textContent = `EUR ${((calculateSubtotal() + getSelectedShipping() / 100)).toFixed(2)}`;
  payButton.addEventListener("click", async () => {
    payButton.disabled = true;
    payButton.textContent = "Processing...";

    const cart = getCartFromCookie();
    if (!cart.length) {
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "";
      errorMessage.textContent = "Cart is empty";
      payButton.disabled = false;
      payButton.textContent = "Pay now";
      return;
    }
    const country = getSelectedCountry();
    
function applyDiscount(price) {
  const code = promoInput.value.trim().toUpperCase();
  if (code === "TEST10") {
    return price * 0.9;
  }
  return price;
}



  const promoCode = promoInput.value.trim().toUpperCase();
  const deliveryMethod = document.querySelector('input[name="deliveryMethod"]:checked').value;
  const shippingFee = localStorage.getItem("shippingFee");

  const selectedBranchId = localStorage.getItem("selectedBranchId");
  const selectedBranchName = localStorage.getItem("selectedBranchName");
  const selectedBranchStreet = localStorage.getItem("selectedBranchStreet");
  const selectedBranchCity = localStorage.getItem("selectedBranchCity");
  const selectedBranchZip = localStorage.getItem("selectedBranchZip");
  const selectedBranchType = localStorage.getItem("selectedBranchType");
  const selectedBranchLongitude = localStorage.getItem("selectedBranchLongitude");
  const selectedBranchLatitude = localStorage.getItem("selectedBranchLatitude");
  if (deliveryMethod === "packeta" && !selectedBranchId) {
    payButton.disabled = false;
    payButton.textContent = "Pay now";
    return;
  }

    const response = await fetch("/.netlify/functions/create-payment-intent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart,
        country: country,
        getSelectedCountry: getSelectedCountry(),
        promoCode: promoCode,
        deliveryMethod: deliveryMethod,
        shippingFee: shippingFee,
        packetaBranchId: selectedBranchId,
        packetaBranchName: selectedBranchName,
        packetaBranchStreet: selectedBranchStreet,
        packetaBranchCity: selectedBranchCity,
        packetaBranchZip: selectedBranchZip,
        packetaBranchType: selectedBranchType,
        selectedBranchLongitude: selectedBranchLongitude,
        selectedBranchLatitude: selectedBranchLatitude,
      }),
    })

    const data = await response.json();
    if (!data.clientSecret) {      
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "";
      errorMessage.textContent = "Error when creating a payment";
      payButton.disabled = false;
      payButton.textContent = "Pay now";
      return;
    }

    const email = document.getElementById("email").value;
    const firstName = document.getElementById("TextField0").value;
    const lastName = document.getElementById("TextField1").value;
    const address1 = document.getElementById("TextField2").value;
    const postalCode = document.getElementById("TextField4").value;
    const city = document.getElementById("TextField5").value;
    const phone = document.getElementById("TextField6").value;

    const { error, paymentIntent } = await stripe.confirmCardPayment(data.clientSecret, {
      payment_method: {
        card: cardNumber,
        billing_details: {
          name: `${firstName} ${lastName}`,
          email,
          phone,
          address: {
            line1: address1,
            postal_code: postalCode,
            city,
            country,
          },
        },
      },
      shipping: {
        name: `${firstName} ${lastName}`,
        address: {
          line1: address1,
          postal_code: postalCode,
          city,
          country,
        },
      },
    });

    if (error) {      
      const errorMessage = document.getElementById("error-message");
      errorMessage.textContent = "";
      errorMessage.textContent = error.message;
      payButton.disabled = false;
      payButton.textContent = "Pay now";
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      document.cookie = "cart=; Max-Age=0; path=/";
      location.href = "/posters/?success=true";
    }
  });
updatePrices();
});

