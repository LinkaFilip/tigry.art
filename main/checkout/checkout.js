import { products } from '../../netlify/functions/data/products.js';

const selectedProduct = products.find(p => p.id === 'poster001');

const lineItem = {
  price_data: {
    currency: selectedProduct.currency,
    product_data: {
      name: selectedProduct.name,
      description: selectedProduct.description,
      images: [selectedProduct.image],
    },
    unit_amount: selectedProduct.price,
  },
  quantity: 1
};
