import S3 = require('aws-sdk/clients/s3')
import { checkArgs } from '../utils'

export default (client: S3, req: any, res: any) => {
  const errors = checkArgs('upload', req)
  if (errors.length > 0) {
    res.status(500).send(JSON.stringify(errors))
    return
  } else {
    client.upload({
      Bucket: req.body.bucket,
      Key: req.body.key,
      Body: req.file.buffer
    }, {...req.body.options}, (err, data) => {
      if (err) {
        res.status(500).send(err)
      } else {
        console.log(data)
        res.send(data)
      }
    })
  }
}