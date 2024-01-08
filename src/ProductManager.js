const fs = require('fs/promises');

class ProductManager {
  constructor() {
    this.path = "./productos.json";
    this.idCounter = 0;
    this.products = [];
  }

  async init() {
    try {
      const data = await fs.readFile(this.path, 'utf-8');
      this.products = JSON.parse(data);
      this.idCounter = Math.max(...this.products.map((product) => product.id), 0);
    } catch (error) {
      this.products = [];
    }
  }

  generateProductId() {
    return ++this.idCounter;
  }

  async saveProductsToFile() {
    try {
      await fs.writeFile(this.path, JSON.stringify(this.products, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      if (!this.products.some((p) => p.code === code)) {
        const newProduct = {
          id: this.generateProductId(),
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
        };
        this.products.push(newProduct);
        await this.saveProductsToFile();

        console.log(`Se ha agregado el producto: ${title} con éxito`);
      } else {
        console.log(`El código: ${code} se encuentra duplicado, verificar y reemplazar por favor`);
      }
    } catch (error) {
      console.error('Error no se pudo guardar el producto:', error.message);
    }
  }
  async updateProduct(id, updatedProduct) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {

        Object.assign(this.products[index], updatedProduct);


        await this.saveProductsToFile();

        console.log(`Producto con ID ${id} actualizado con éxito`);
      } else {
        console.log(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo actualizar el producto:', error.message);
    }
  }
  async deleteProduct(id) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {
        this.products.splice(index, 1); 

        await this.saveProductsToFile();

        console.log(`Producto con ID ${id} eliminado con éxito`);
      } else {
        console.log(`Producto con ID ${id} no encontrado`);
      }
    } catch (error) {
      console.error('Error no se pudo borrar el producto:', error.message);
    }
  }

  getProducts() {
    return this.products;
  }

  async getProductById(id) {
    const okProduct = this.products.find((product) => product.id === id);
    return okProduct || null;
    
  }
}

module.exports = ProductManager