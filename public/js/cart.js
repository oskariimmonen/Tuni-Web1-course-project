const addToCart = productId => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // call updateProductAmount(productId) from this file
  console.log("adding to cart in cart.js");
  addProductToCart(productId);
  updateProductAmount(productId);
};

const decreaseCount = productId => {
  // TODO 9.2
  // Decrease the amount of products in the cart, /public/js/utils.js provides decreaseProductCount()
  // Remove product from cart if amount is 0,  /public/js/utils.js provides removeElement = (containerId, elementId
  decreaseProductCount(productId);
  if (getProductCountFromCart(productId) <= 0) {
    let items = document.querySelectorAll('.item-row');
    items.forEach(item => {
      if (item.querySelector('.product-name').id == 'name-'+productId) {
        item.remove();
      }
    })
  }
  updateProductAmount(productId);
};

const updateProductAmount = productId => {
  // TODO 9.2
  // - read the amount of products in the cart, /public/js/utils.js provides getProductCountFromCart(productId)
  // - change the amount of products shown in the right element's innerText
  const productAmountElement = document.querySelector(`#amount-${productId}`);
  productAmountElement.textContent = getProductCountFromCart(productId) + 'x';
};

const placeOrder = async() => {
  // TODO 9.2
  // Get all products from the cart, /public/js/utils.js provides getAllProductsFromCart()
  // show the user a notification: /public/js/utils.js provides createNotification = (message, containerId, isSuccess = true)
  // for each of the products in the cart remove them, /public/js/utils.js provides removeElement(containerId, elementId)
  let productsInCart = getAllProductsFromCart();
  createNotification('Successfully created an order!', 'notifications-container', true);
  document.querySelectorAll('.item-row').forEach(e => e.remove());
  clearCart();

};

(async() => {
  // TODO 9.2
  // - get the 'cart-container' element
  // - use getJSON(url) to get the available products
  // - get all products from cart
  // - get the 'cart-item-template' template
  // - for each item in the cart
  //    * copy the item information to the template
  //    * remember to add event listeners for cart-minus-plus-button cart-minus-plus-button elements. querySelectorAll() can be used to select all elements with each of those classes, then its just up to finding the right index
  // - in the end remember to append the modified cart item to the cart 

  const cartContainer = document.querySelector('#cart-container');
  const cartItemTemplate = document.querySelector('#cart-item-template');
  
  document.querySelector('#place-order-button').addEventListener('click', placeOrder);

  try {
    const availableProducts = await getJSON('/api/products');
    const productsInCart = getAllProductsFromCart();

    console.log(productsInCart);

    if (productsInCart.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No products';
      cartContainer.append(p);
    } else {
      availableProducts.forEach(product => {
        if (getProductCountFromCart(product._id) > 0) {
          const { _id: id, name, description, price } = product;
          const cartItem = cartItemTemplate.content.cloneNode(true);

          cartItem.querySelector('h3').id = `name-${id}`;
          cartItem.querySelector('h3').textContent = name;
          cartItem.querySelector('p.product-price').id = `price-${id}`;
          cartItem.querySelector('p.product-price').textContent = price;
          cartItem.querySelector('p.product-amount').id = `amount-${id}`;
          cartItem.querySelector('p.product-amount').textContent = getProductCountFromCart(id) + 'x';
          const buttons = cartItem.querySelectorAll('button.cart-minus-plus-button');
          buttons[0].id = `plus-${id}`;
          buttons[0].addEventListener('click', () => addToCart(id));
          buttons[1].id = `minus-${id}`;
          buttons[1].addEventListener('click', () => decreaseCount(id));

          cartContainer.append(cartItem);
        }
    });
      
    }
  } catch (error) {
    console.error(error);
    return createNotification(
      'There was an error while fetching products',
      'notifications-container',
      false
    );
  }

})();