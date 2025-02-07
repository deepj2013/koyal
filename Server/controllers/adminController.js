import { adminLoginService, adminSignUpService } from "../services/adminServices.js"

export const adminLoginController = async (req, res, next) => {
    try {
        let { userId, password } = req.body

        const result = await adminLoginService(userId, password)

        return res.status(200).json({success: true, result })
    } catch (error) {
        next(error)
    }
}

export const adminSignupController = async (req, res, next) => {
    try {
        let { name, email, password } = req.body

        await adminSignUpService(name, email.toLowerCase(), password)

        return res.status(200).json({ success: true })
    } catch (error) {
        next(error)
    }
}