const fs = require('fs/promises');
const path = require('path');
const productsFilePath = path.join(__dirname, '../../assets/productos.json');

class ProductManager {
  constructor(productsFilePath) {
    this.productsPath = productsFilePath;
    this.products = [];
    this.loadProductsFromFile();
  }
    async initialize() {
      try {
        console.log('Iniciando ProductManager...');
        await this.loadProductsFromFile();  
        console.log('ProductManager inicializado correctamente.');
      } catch (error) {
        console.error('Error aca!! al inicializar ProductManager este!:', error.message);
        throw error;
      }
    }

    async addProduct(producto) {
      try {
        // Validar la presencia de todos los campos obligatorios
        const { title, description, price, thumbnail, code, stock } = producto;
        if (title && description && price && thumbnail && code && stock) {
          // Validar si el código del producto ya existe
          const productoExistente = this.products.find(prod => prod.code === code);

          if (productoExistente) {
            console.error('¡El código ya existe!');
          } else {
            // Asignar un ID automático
            const nuevoIdProducto = this.getNextProductId();

            // Agregar el nuevo producto al array
            const nuevoProducto = {
              id: nuevoIdProducto,
              title,
              description,
              price,
              thumbnail,
              code,
              stock,
            };

            this.products.push(nuevoProducto);

            // Guardar el array actualizado en el archivo
            await this.saveProductsToFile();

            console.log('Producto agregado correctamente:', nuevoProducto);
          }
        } else {
          console.error('Todos los campos son obligatorios');
        }
      } catch (error) {
        console.error('Error al agregar producto:', error.message);
      }
    }

  
    
    async getProductById(id) {
      try {
        // Buscar el producto con el ID especificado
        const producto = this.products.find((producto) => producto.id === id);

        if (producto) {
          return producto;
        } else {
          throw new Error("Producto no encontrado.");
        }
      } catch (error) {
        console.error("Error al obtener producto por ID:", error.message);
        throw error;
      }
    }

    async updateProduct(id, camposActualizados) {
      try {
        // Encontrar el índice del producto con el ID 
        const indiceProducto = this.products.findIndex((producto) => producto.id === id);

        if (indiceProducto !== -1) {
          // Actualizar el producto con los campos proporcionados
          this.products[indiceProducto] = { ...this.products[indiceProducto], ...camposActualizados };

          // Guardar el array actualizado en el archivo
          await this.saveProductsToFile();

          console.log("Producto actualizado correctamente.");
        } else {
          throw new Error("Producto no encontrado.");
        }
      } catch (error) {
        console.error("Error al actualizar producto:", error.message);
        throw error;
      }
    }
    
    async deleteProduct(id) {
      try {
        // Filtrar el array para excluir el producto con el ID 
        this.products = this.products.filter((producto) => producto.id !== id);

        // Guardar el array actualizado en el archivo
        await this.saveProductsToFile();

        console.log("Producto eliminado correctamente.");
      } catch (error) {
        console.error("Error al eliminar producto:", error.message);
        throw error;
      }
    }

    getNextProductId() {
      // Obtener el ID más alto y sumar 1
      const idMasAlto = this.products.reduce((maxId, producto) => (producto.id > maxId ? producto.id : maxId), 0);
      return idMasAlto + 1;
    }

    async saveProductsToFile() {
      try {
        if (this.productsPath) {
          // Guardar el array de productos en el archivo
          await fs.writeFile(this.productsPath, JSON.stringify(this.products, null, 2));
          console.log('Productos guardados correctamente.');
        } else {
          console.error('Error: la ruta del archivo de productos no está definida.');
        }
      } catch (error) {
        console.error('Error al guardar productos en el archivo:', error.message);
        throw error;
      }

    }

    async loadProductsFromFile() {
      try {
        if (!this.productsPath) {
          console.error('Error: la ruta del archivo de productos no está definida.');
          return;
        }
    
        const contenidoArchivo = await fs.readFile(this.productsPath, 'utf-8');
        this.products = contenidoArchivo ? JSON.parse(contenidoArchivo) : [];
        
      } catch (error) {
        console.error('Error al cargar productos desde el archivo:', error.message);
        this.products = [];
      }
    }

    

    async getProducts() {
      
      return this.products;
    }
  }
  

  async function main() {
    try {
      const productManager = new ProductManager(productsFilePath);

     
      
      await productManager.initialize();
      
      await productManager.loadProductsFromFile();
        
        await productManager.addProduct({
          title: 'Producto 1',
          description: 'Descripción del Producto 1',
          price: 3000,
          thumbnail: 'imagen1.jpg',
          code: 'P001',
          stock: 50,
        });
    
        await productManager.addProduct({
          title: 'Producto 2',
          description: 'Descripción del Producto 2',
          price: 30050,
          thumbnail: 'imagen2.jpg',
          code: 'P002',
          stock: 50,
        });
        await productManager.addProduct({
          title: 'Producto 1',
          description: 'Descripción del Producto 1',
          price: 3000,
          thumbnail: 'imagen1.jpg',
          code: 'P001',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 2',
          description: 'Descripción del Producto 2',
          price: 30050,
          thumbnail: 'imagen2.jpg',
          code: 'P002',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 3',
          description: 'Descripción del Producto 3',
          price: 3000,
          thumbnail: 'imagen3.jpg',
          code: 'P003',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 4',
          description: 'Descripción del Producto 4',
          price: 3000,
          thumbnail: 'imagen4.jpg',
          code: 'P004',
          stock: 50,
      });
      
      await productManager.addProduct({
          title: 'Producto 5',
          description: 'Descripción del Producto 5',
          price: 35000,
          thumbnail: 'imagen5.jpg',
          code: 'P005',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 6',
          description: 'Descripción del Producto 6',
          price: 37000,
          thumbnail: 'imagen6.jpg',
          code: 'P006',
          stock: 40,
      });
      await productManager.addProduct({
          title: 'Producto 7',
          description: 'Descripción del Producto 7',
          price: 3000,
          thumbnail: 'imagen7.jpg',
          code: 'P007',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 8',
          description: 'Descripción del Producto 8',
          price: 3000,
          thumbnail: 'imagen81.jpg',
          code: 'P008',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 9',
          description: 'Descripción del Producto 9',
          price: 3000,
          thumbnail: 'imagen9.jpg',
          code: 'P009',
          stock: 50,
      });
      await productManager.addProduct({
          title: 'Producto 10',
          description: 'Descripción del Producto 10',
          price: 3000,
          thumbnail: 'imagen10.jpg',
          code: 'P0010',
          stock: 50,
      });
        
        
     
    
    } catch (error) {
      console.error('Error en la función main:', error.message);
    }
  }
    

  main();


  module.exports = ProductManager;
