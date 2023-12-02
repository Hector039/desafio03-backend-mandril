import express from "express";
import { ProductManager } from "../ProductManager.js";

const app = express();
const PORT = 8080;

const productManager = new ProductManager();

app.get("/", (req, res) => {
    res.send("Servidor con express.");
});

app.get("/products", async (req, res) => {
    const { limit } = req.query;
    try {
        let temporalProducts = await productManager.getProducts();

        if (limit) {
            let limitProducts = temporalProducts.filter((data, index) => index < limit);
            res.json({
                msg: "Lista de productos limitados con query",
                data: limitProducts,
                limit: limit,
                total: limitProducts.length
            });
        } else {
            res.json({
                msg: "Lista de todos los productos",
                data: temporalProducts,
                total: temporalProducts.length
            })
        }

    } catch (error) {
        console.log(error.name);
    }
});

app.get("/products/:pid", async (req, res) => {
    const { pid } = req.params;
    let productById = await productManager.getProductById(parseInt(pid))

    if (productById) {
        res.json({
            msg: "Se encontró el producto",
            data: productById
        })
    } else {
        res.json({
            msg: "El producto no existe, intente con otro ID."
        })
    }
})

app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost: ${PORT}`);
});