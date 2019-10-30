import S3 = require('aws-sdk/clients/s3')
import { checkArgs } from '../../utils'

export default (client: S3, req: any, res: any) => {
  const errors = checkArgs('deleteObjects', req)
  let objs = []
  for (const key in req.body.objects) {
    if (req.body.objects.hasOwnProperty(key)) {
      const element = req.body.objects[key];
      objs.push({Key: element})
    }
  }
  if (errors.length > 0) {
    res.status(500).send(JSON.stringify(errors))
    return
  } else {
    client.deleteObjects({
      Bucket: req.body.bucket,
      Delete: {
        Objects: [ ...objs ]
      }
    }, (err, data) => {
      if (err) {
        res.status(500).send(err)
      } else {
        console.log(data)
        res.send(data)
      }
    })
  }
}