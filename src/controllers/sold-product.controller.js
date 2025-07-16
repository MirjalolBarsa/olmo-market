import SoldProduct from "../models/sold-product.model.js";
import { resSuccess, handleError } from "../helpers/error-success.js";
import { createSoldProductValidator, updateSoldProductValidator } from "../validations/sold-product.validation.js";


export class SoldProductController{
    async createSoldProduct(req,res){
        try {
            
        } catch (error) {
            return handleError(res, error)
        }
    }
}