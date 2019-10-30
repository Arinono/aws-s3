import upload from './routes/upload'
import deleteObject from './routes/object/delete'
import deleteObjects from './routes/objects/delete'
import copyObject from './routes/object/copy'
import createBucket from './routes/bucket/create'
import deleteBucket from './routes/bucket/delete'

export interface IArg {
  in: string
  required: boolean
  type: string
}

export interface IRoute {
  method: string
  contentType: string
  help: string
  args: Array<IArg>
  fn: Function
}

const bucket = {
  'bucket': { 
    in: 'body',
    required: true,
    type: 'string'
  }
}

const key = {
  'key': {
    in: 'body',
    required: true,
    type: 'string'
  }
}

const objects = {
  'objects': {
    in: 'body',
    required: true,
    type: 'map'
  }
}

export default {
  'upload': {
    method: 'post',
    help: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#upload-property',
    contentType: 'multipart/form-data',
    args: {
      'file': {
        in: 'file',
        required: true,
        type: 'any'
      },
      'options': {
        in: 'body',
        required: false,
        type: 'map'
      },
      ...bucket,
      ...key
    },
    fn: upload
  },
  'deleteObject': {
    method: 'delete',
    help: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property',
    contentType: 'application/json',
    args: {
      ...bucket,
      ...key
    },
    fn: deleteObject
  },
  'copyObject': {
    method: 'post',
    help: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#copyObject-property',
    contentType: 'application/json',
    args: {
      ...bucket,
      ...key,
      copySource: {
        type: 'string',
        in: 'body',
        required: true
      }
    },
    fn: copyObject
  },
  'createBucket': {
    help: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property',
    method: 'post',
    contentType: 'application/json',
    args: {
      ...bucket,
      locationConstraint: {
        required: false,
        type: 'string',
        in: 'body'
      }
    },
    fn: createBucket
  },
  'deleteBucket' : {
    help: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteBucket-property',
    method: 'delete',
    contentType: 'application/json',
    args: {
      ...bucket
    },
    fn: deleteBucket
  },
  'deleteObjects': {
    method: 'delete',
    help: 'https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#deleteObject-property',
    contentType: 'application/json',
    args: {
      ...bucket,
      ...objects
    },
    fn: deleteObjects
  },
  'health': {
    method: 'get',
    fn: ((client: any, req: any, res: any) => res.status(200).send('OK'))
  }
}