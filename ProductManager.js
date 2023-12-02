import fs from "fs";

class Product {
    constructor(id, title, description, price, thumbnail, code, stock) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

export class ProductManager {
    #path;
    #ultimoId = 0;

    constructor() {
        this.#path = "./archivoProductos.json";
        this.#setUltimoId();
    }

    async addProduct(title, description, price, thumbnail, code, stock) {

        try {

            const productos = await this.getProducts();
            const codeExistente = productos.some(product => product.code === code);

            if (title === undefined || description === undefined || price === undefined || thumbnail === undefined || code === undefined || stock === undefined) {
                console.log("Faltan ingresar campos.");
            } else if (codeExistente) {
                console.log("Codigo Ingresado existente, por favor ingrese uno diferente");
            } else {
                const newProduct = new Product(
                    ++this.#ultimoId,
                    title,
                    description,
                    price,
                    thumbnail,
                    code,
                    stock
                );

                productos.push(newProduct);

                await this.#guardarProductos(productos);

                console.log("Producto creado exitosamente.");
            }

        } catch (error) {
            console.log("Se produjo un error creando el archivo", error.name);
        }
    }

    async getProducts() {
        try {
            if (fs.existsSync(this.#path)) {
                const productos = JSON.parse(await fs.promises.readFile(this.#path, "utf-8"));
                return productos;
            }

            return [];
        } catch (error) {
            console.log("error al leer el archivo", error.name);
        }
    }

    async getProductById(id) {
        try {
            const productos = await this.getProducts();
            const productoById = productos.find(producto => producto.id === id);

            if (productoById === undefined) {
                console.log("Producto no encontrado, intente con otro ID.");
            } else {
                return productoById;
            }

        } catch (error) {
            console.log("Error al leer el archivo", error.name);
        }
    }

    async updateProduct(id, campo, nuevoValor) {//actulizamos precio del producto, con ID y el precio nuevo
        try {
            const productos = await this.getProducts();
            const productoIndice = productos.findIndex(product => product.id === id);

            if (productoIndice < 0) {
                console.log("No se encontró el ID:", id)
            } else {
                productos[productoIndice][campo] = nuevoValor;

                await this.#guardarProductos(productos);

                console.log("Se actualizó el campo correctamente del producto ID:", id);
            }



        } catch (error) {
            console.log("Error al buscar arhivo.", error.name);
        }
    }

    async deleteProduct(id) {
        try {
            let productos = await this.getProducts();
            const estaEnProductos = productos.some(product => product.id === id);

            if (estaEnProductos === false) {
                console.log("No se encontró el ID:", id);
            } else {
                productos = productos.filter(product => product.id !== id);
                await this.#guardarProductos(productos);

                console.log("Se eliminó el producto de id:", id);
            }

        } catch (error) {
            console.log("Error al buscar arhivo.", error.name)
        }
    }

    async #setUltimoId() {
        try {
            const productos = await this.getProducts();

            if (productos.length < 1) {
                this.#ultimoId = 0;
                return;
            }

            this.#ultimoId = productos[productos.length - 1].id;

        } catch (error) {
            console.log(error);
        }
    }

    async #guardarProductos(productos) {
        try {
            await fs.promises.writeFile(this.#path, JSON.stringify(productos));
        } catch (error) {
            console.log(error);
        }
    }

}

