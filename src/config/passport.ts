import { Request, Response, NextFunction } from "express"
import passport from "passport"
import { User } from "../models/User"
/** Basic Auth */
// import { BasicStrategy } from "passport-http"
/** Passport - JWT */
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
dotenv.config()

const notAuthorizedJson = { status: 401, message: "Não autorizado" }

/** Basic Auth */
// passport.use(
//   new BasicStrategy(async (email, password, done) => {
//     if (email && password) {
//       const user = await User.findOne({
//         where: { email, password },
//       })
//       if (user) {
//         return done(null, user)
//       }
//     }
//     return done(notAuthorizedJson, false)
//   })
// )

/** Passport - JWT */
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET_KEY as string,
}

passport.use(
  new JWTStrategy(options, async (payload, done) => {
    const user = await User.findByPk(payload.id)
    if (user) {
      return done(null, user)
    } else {
      return done(notAuthorizedJson, false)
    }
  })
)

export const generateToken = (data: object) => {
  return jwt.sign(data, process.env.JWT_SECRET_KEY as string)
}

export const privateRoute = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /** Basic Auth */
  // passport.authenticate("basic", (err, user) => {
  /** Passport - JWT */
  passport.authenticate("jwt", (err, user) => {
    req.user = user
    return user ? next() : next(notAuthorizedJson)
  })(req, res, next)
}

export default passport
