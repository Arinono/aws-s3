import routes from './routes'

export const checkArgs = (route: string, req: any) => {
  let errors = []
  for (const key in routes[route].args) {
    if (routes[route].args.hasOwnProperty(key)) {
      const arg = routes[route].args[key];
      if (arg.required) {
        if (arg.in === 'file') {
          if (!req.file) {
            errors.push(`Missing property required ${key} in ${arg.in}`)
          }
        } else {
          if (!req[arg.in][key]) {
            errors.push(`Missing property required ${key} in ${arg.in}`)
          }
        }
      }
    }
  }
  console.log(errors)
  return errors
}