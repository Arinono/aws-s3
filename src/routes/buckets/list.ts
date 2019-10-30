import { checkArgs } from '../../utils'
import S3 = require('aws-sdk/clients/s3');

export default (client: S3, req: any, res: any) => {
  const errors = checkArgs('listBuckets', req)
  if (errors.length > 0) {
    res.status(500).send(JSON.stringify(errors))
    return
  } else {
    client.listBuckets((err, data) => {
      if (err) {
        res.status(500).send(err)
      } else {
        console.log(data)
        res.send(data)
      }
    })
  }
}