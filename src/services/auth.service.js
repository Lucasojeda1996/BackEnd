import transporter from "../config/mailer.config.js";
import UserRepository from "../repositories/user.repository.js";
import { ServerError } from "../utils/customError.utils.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import ENVIRONMENT from "../config/environment.config.js";

class AuthService {
    static async register(name, email, password) {
        const user_found = await UserRepository.getByEmail(email);
        if (user_found) {
            throw new ServerError(400, 'Email ya en uso');
        }

        const password_hashed = await bcrypt.hash(password, 12);
        const user_created = await UserRepository.createUser(name, email, password_hashed);

        const verification_token = jwt.sign({
            email: email,
            user_id: user_created._id
        }, ENVIRONMENT.JWT_SECRET_KEY);

        await transporter.sendMail({
            from: 'lucaskappo22@gmail.com',
            to: email,
            subject: 'Verificación de correo electrónico',
            html: `
                <h1>Hola ${name}</h1>
                <p>Verifica tu correo electrónico:</p>
                <a href='${ENVIRONMENT.URL_API_BACKEND}/api/auth/verify-email/${verification_token}'>Verificar email</a>
            `
        });

        return user_created;
    }

    static async verifyEmail(verification_token) {
        try {
            const payload = jwt.verify(verification_token, ENVIRONMENT.JWT_SECRET_KEY);
            const user = await UserRepository.updateById(payload.user_id, { verified_email: true });
            if (!user) throw new ServerError(404, 'Usuario no encontrado');
            return true;
        } catch (error) {
            if (error instanceof jwt.JsonWebTokenError) {
                throw new ServerError(400, 'Token inválido');
            }
            throw error;
        }
    }

    static async login(email, password) {
        const user = await UserRepository.getByEmail(email);
        if (!user) {
            throw new ServerError(404, 'Email no registrado');
        }

        const is_same_password = await bcrypt.compare(password, user.password);
        if (!is_same_password) {
            throw new ServerError(401, 'Contraseña incorrecta');
        }

        const authorization_token = jwt.sign({
            id: user._id,
            name: user.name,
            email: user.email,
            created_at: user.created_at
        }, ENVIRONMENT.JWT_SECRET_KEY, { expiresIn: '1d' });

        return { authorization_token };
    }
}

export default AuthService;
