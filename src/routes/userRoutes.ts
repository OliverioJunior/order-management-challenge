import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { validate } from "../middlewares/validate";
import { loginSchema, registerSchema } from "../validators/authValidator";
import { AuthService } from "../services/authService";
import { TokenService } from "../services/tokenService";

const router = Router();
const authController = new AuthController(new AuthService(), new TokenService());
router.post('/', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);


export default router;
