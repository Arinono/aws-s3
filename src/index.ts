import * as S3 from 'aws-sdk/clients/s3'
import * as express from 'express'
import * as bodyparser from 'body-parser'
import * as multer from 'multer'
import * as _ from 'underscore'

import routes, { IRoute, IArg } from './routes'

export default class Service {
  private client: S3
  private app: any
  private router: any

  constructor () {
    process.stdout.write(`Starting S3 client with \nAWS_ACCESS_KEY_ID=${process.env.AWS_ACCESS_KEY_ID} \nAWS_SECRET_ACCESS_KEY=${process.env.AWS_SECRET_ACCESS_KEY}\n`)
    this.client = new S3({
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
      }
    })
    this.app = express()
    this.router = express.Router()

    this.initPlugins()
    this.initCORS()
    this.loadRoutes()

    this.app.use(this.router)

    process.stdout.write('App listening on port 5000\n')
    this.app.listen(5000)
  }

  private initPlugins() {
    this.app.use(bodyparser.json())
    this.app.use(bodyparser.urlencoded({ extended: true }))
  }

  private initCORS () {
    this.app.use((req: any, res: any, next: any) => {
      res.header('Access-Control-Allow-Origin', '*')
      res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      )
      next()
    })
  }

  private loadRoutes() {
    for (const kRoute in routes) {
      if (routes.hasOwnProperty(kRoute)) {
        const r: IRoute = routes[kRoute]
        switch (r.method) {
          case 'post':
            const arg = _.find(r.args, (a: IArg) => a.in === 'file')
            if (arg) {
              this.router.post(`/${kRoute}`, multer().single('file'), (req: any, res: any) => r.fn(this.client, req, res))
            } else {
              this.router.post(`/${kRoute}`, (req: any, res: any) => r.fn(this.client, req, res))
            }
            break
          case 'get':
            this.router.get(`/${kRoute}`, (req: any, res: any) => r.fn(this.client, req, res))
            break
          case 'delete':
            this.router.delete(`/${kRoute}`, (req: any, res: any) => r.fn(this.client, req, res))
            break
        }
      }
    }
  }
}

new Service()