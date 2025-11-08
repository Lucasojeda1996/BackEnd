import AuthService from "../services/auth.service.js";
import { ServerError } from "../utils/customError.utils.js";

class AuthController {
    // Registro
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            console.log(req.body)

            if (!name) throw new ServerError(400, 'Debes enviar un nombre de usuario');
            if (!email || !String(email).toLowerCase().match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)) {
                throw new ServerError(400, 'Debes enviar un email válido');
            }
            if (!password || password.length < 4) {
                throw new ServerError(400, 'La contraseña debe tener al menos 4 caracteres');
            }
        
            await AuthService.register(name, email, password);  
            return res.json({
                ok: true,
                status:200,
                message: 'Usuario registrado correctamente ,',               
                
            });

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // Login
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const { authorization_token } = await AuthService.login(email, password);

            return res.json({
                ok: true,
                message: 'Ingreso con éxito',
                status:200,
                data: {authorization_token:authorization_token}
            });

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            });
        }
    }

    // Verificación de email
    static async verifyEmail(req, res) {
        try {
            const { verification_token } = req.params;
            await AuthService.verifyEmail(verification_token);

            return res.status(200).json({
                ok: true,
                message: 'Correo verificado correctamente'
            });

        } catch (error) {
            console.log(error);
            return res.status(error.status || 500).json({
                ok: false,
                status: error.status || 500,
                message: error.message || 'Error interno del servidor'
            });
        }
    }
}

export default AuthController;
