import {Router} from "express"
import authRoutes from "./auth.routes.js"
import userRoutes from "./user.routes.js"
import appealsRoutes from "./appeals.routes.js"
import documentsRoutes from "./documents.routes.js"
import updatesRoutes from "./updates.routes.js"

const mainRouter = Router()
mainRouter.use("/auth", authRoutes)
mainRouter.use("/users", userRoutes)
mainRouter.use("/appeals", appealsRoutes)
mainRouter.use("/documents", documentsRoutes)
mainRouter.use("/updates", updatesRoutes)

export default mainRouter