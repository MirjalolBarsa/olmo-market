import { Router } from "express";
import { ProductController } from "../controllers/product.controller.js";

const router = Router();
const controller = new ProductController();

router  
        .post('/', controller.createProduct)
        .get('/', controller.getAllProduct)
        .get('/:id', controller.getProductById)
        .patch('/:id', controller.updateProduct)
        .delete('/:id', controller.removeProduct)

export default router;
