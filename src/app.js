const express = require('express');
const ProductManager = require('./ProductManager');

const app = express();
const port = 8080;
const productManager = new ProductManager();

app.get('/', async (req, res) => {
  res.send(`
      <html>
        <head>
          <style>
            body {
              font-family: 'Arial', sans-serif;
              font-size:  20px;
              background-color: black;
              text-align: center;
              padding: 50px;
            }
            h1 {
              color: #0c466c;
            }
            a{
              color: #D0E0F2;
              text-decoration: none;
              background-color: #05659d;
              border-radius: 1rem;
              padding: 10px;
            }
          </style>
        </head>
        <body>
          <h1>Bienvenidos a nuestra Tienda</h1>
          <a href="/products">VER  PRODUCTOS</a>
        </body>
      </html>
    `);
});

app.get('/products', async (req, res) => {
  try {
    await productManager.init();
    const allProducts = productManager.getProducts();
    const limit = req.query.limit;
    const products = limit ? allProducts.slice(0, parseInt(limit)) : allProducts;
    const productListHTML = products.map(product => `
        <li>
        <a href="/products/${product.id}">
          <strong>${product.title}</strong></a>
          <p>${product.description}</p>
          <p>Precio: ${product.price}</p>
          <p>code: ${product.code}</p>
          <p>stock: ${product.stock}</p>
        </li>
      `).join('');


    res.send(`
        <html>
          <head>
            <style>
              body {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                font-family: sans-serif;
                background-color: black;
                padding: 20px;
              }
              li {
                display: flex;
                flex-direction: column;
                text-align: center;
                list-style-type: none;
                border: 1px solid #ddd;
                margin: 10px;
                padding: 10px;
                background-color: #fff;
                border-radius: 5px;
                width: 270px;
              }
              strong {
                color: #3498db;
              }
              h1 {
                color: white
              }
              a{
                color: #D0E0F2
              }

            </style>
          </head>
          <body>
          <div>
            <h1>Productos</h1>
          </div>
          <div class="products">
            <ul>
              ${productListHTML}
            </ul>
            </div>
          <div>
              <a href="/">Volver a Inicio</a>
          </div>
              </body>
        </html>
      `);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al obtener los productos.' });
  }
});


app.get('/products/:pid', async (req, res) => {
  try {
    await productManager.init();
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);
    if (product) {
      res.send(`
        <html>
          <head>
            <style>
              body {
                background-color:black;
                font-family: Arial, sans-serif;
                color: white;
              }
              a{
                color:#D0E0F2;
                padding:15px;
              }
              div{
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column
              }
              .card{
                width:30%;
                background-color:#3066b7;
                padding:25px;

              }
            </style>
          </head>
          <body>
            <div>
            <h1>Detalles del Producto</h1>
            </div>
            <div>
            <div class="card">
            <p>ID: ${product.id}</p>
            <p>Nombre: ${product.title}</p>
            <img src="${product.thumbnail}" />
            <p>Precio: $${product.price}.00 ARS</p>
            <p>Codigo: ${product.code}</p>
            
            </div>
            <a href="/">Volver a Inicio</a>
            <a href="/products">ver todos los productos</a>
            </div>
          </body>
        </html>`);

    } else {
      res.status(404).json({ error: `Producto con ID ${pid} no encontrado.` });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Error al obtener el producto.' });
  }
});


app.listen(port, async () => {
  console.log(`Server run in http://localhost:${port}`);
  await productManager.init();
});