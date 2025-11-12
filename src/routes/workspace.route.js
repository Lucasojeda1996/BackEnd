import express from 'express'
import WorkspacesRepository from '../repositories/workspace.repository.js'
import { validarId } from '../utils/validations.utils.js'
import { ServerError } from '../utils/customError.utils.js'
import WorkspaceController from '../controllers/workspace.controller.js'
import authMiddleware from '../middleware/auth.middleware.js'

const workspace_router = express.Router()

// Obtener todos los workspaces
workspace_router.get('/',authMiddleware,WorkspaceController.getAll)

// Obtener workspace por ID
workspace_router.get('/:id',authMiddleware,WorkspaceController.getById)

// Crear workspace
workspace_router.post('/',authMiddleware,WorkspaceController.post)

//Crear los controladores para crear mensajes y obtener mensajes
//Siempre que se cree o obtenga la lista el servidor debera responder con la lista de mensajes

export default workspace_router