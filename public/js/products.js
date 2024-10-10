const addToCart = (productId, productName) => {
  // TODO 9.2
  // use addProductToCart(), available already from /public/js/utils.js
  // /public/js/utils.js also includes createNotification() function
  addProductToCart(productId);
  createNotification(`Added ${productName} to cart!`, 'notifications-container');
};

console.log("testi");

(async() => {
  //TODO 9.2 
  // - get the 'products-container' element
  // - get the 'product-template' element
  // - use getJSON(url) to get the available products
  // - for each of the products:
  //    * clone the template
  //    * add product information to the template clone
  //    * remember to add an event listener for the button's 'click' event, and call addToCart() in the event listener's callback
  // - remember to add the products to the the page

  const productsContainer = document.querySelector('#products-container');
  console.log(productsContainer)
  const productTemplate = document.querySelector('#product-template');

  try {
    const products = await getJSON('/api/products');
    console.log(products)

    if (products.length === 0) {
      const p = document.createElement('p');
      p.textContent = 'No products';
      productsContainer.append(p);
    } else {
      products.forEach(product => {
        const { _id: id, name, description, price } = product;
        const productContainer = productTemplate.content.cloneNode(true);

        productContainer.querySelector('h3').id = `name-${id}`;
        productContainer.querySelector('h3').textContent = name;
        productContainer.querySelector('p.product-description').id = `description-${id}`;
        productContainer.querySelector('p.product-description').textContent = description;
        productContainer.querySelector('p.product-price').id = `price-${id}`;
        productContainer.querySelector('p.product-price').textContent = price;
        productContainer.querySelector('button').id = `add-to-cart-${id}`;
        productContainer.querySelector('button').addEventListener('click', () => addToCart(id, name));

        productsContainer.append(productContainer);
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