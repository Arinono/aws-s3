import upload from './routes/upload'
import deleteObject from './routes/delete'

export interface IArg {
  in: string
  required: boolean
  type: string
}

export interface IRoute {
  method: string
  contentType: string
  args: Array<IArg>
  fn: Function
}

export default {
  'upload': {
    method: 'post',
    contentType: 'multipart/form-data',
    args: {
      'file': {
        in: 'file',
        required: true,
        type: 'any'
      },
      'bucket': { 
        in: 'body',
        required: true,
        type: 'string'
      },
      'key': {
        in: 'body',
        required: true,
        type: 'string'
      },
      'options': {
        in: 'body',
        required: false,
        type: 'map'
      }
    },
    fn: upload
  },
  'deleteObject': {
    method: 'delete',
    contentType: 'application/json',
    args: {
      'bucket': { 
        in: 'body',
        required: true,
        type: 'string'
      },
      'key': {
        in: 'body',
        required: true,
        type: 'string'
      }
    },
    fn: deleteObject
  },
  'health': {
    method: 'get',
    fn: ((client: any, req: any, res: any) => res.status(200).send('OK'))
  }
}