import { Request, Response, NextFunction } from "express"
import { User } from "../models/User"
import JWT from "jsonwebtoken"
import dotenv from "dotenv"
import { stringify } from "querystring"

dotenv.config()

export const Auth = {
  private: async (req: Request, res: Response, next: NextFunction) => {
    let success = false
    // Basic Auth
    // success = await basicAuth(req, success)

    //JWT Auth
    if (req.headers.authorization) {
      const [type, token] = req.headers.authorization.split(" ")
      if (type === "Bearer") {
        try {
          JWT.verify(token, process.env.JWT_SECRET_KEY as string)
          success = true
        } catch ({ message }) {
          res.status(403)
          res.json({ error: message })
          return
        }
      }
    }

    if (success) {
      next()
    } else {
      res.status(403)
      res.json({ error: "Usuário não autorizado!" })
    }
  },
}

async function basicAuth(req: Request, success: boolean) {
  if (req.headers.authorization) {
    let hash: string = req.headers.authorization.substring(6)
    let decode: string = Buffer.from(hash, "base64").toString()
    let data: string[] = decode.split(":")
    if (data.length === 2) {
      let user = await User.findOne({
        where: { email: data[0], password: data[1] },
      })

      if (user) {
        success = true
      }
    }
  }
  return success
}
