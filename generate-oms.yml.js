const fs = require('fs')
const yamljs = require('yamljs')
const path = require('path')
const actions = require('./dist/routes').default

const json = {
  oms: 1,
  lifecycle: { startup: { command: ['node', '/app/dist/index.js'] } },
  info: {
    version: require('./package.json').version,
    title: require('./package.json').name,
    description: require('./package.json').description,
    license: { name: 'MIT', url: 'https://opensource.org/licenses/MIT' },
    contact: {
      name: 'Aurelien ARINO',
      url: require('./package.json').repository,
      email: 'aurelien@storyscript.io'
    }
  },
  health: {
    http: {
      path: '/health',
      port: 5000
    }
  }
}
json.actions = {}
for (const key in actions) {
  if (key === 'health')
    continue
  if (actions.hasOwnProperty(key)) {
    const action = actions[key]
    json.actions[key] = {}
    if (action.args) {
      json.actions[key].arguments = {}
      for (const kargs in actions[key].args) {
        if (actions[key].args.hasOwnProperty(kargs)) {
          const arg = actions[key].args[kargs]
          json.actions[key].arguments[kargs] = {
            required: arg.required,
            in: arg.in === 'body' || arg.in === 'file' ? 'requestBody' : arg.in ,
            type: arg.type
          }
        }
      }
    }
    json.actions[key].http = {
      port: 5000,
      method: action.method,
      path: `/${key}`,
      contentType: action.contentType
    }
    json.actions[key].help = action.help
    json.actions[key].output = { type: 'any' }
  }
}

json.environment = {
  'AWS_ACCESS_KEY_ID': {
    type: 'string',
    required: true
  },
  'AWS_SECRET_ACCESS_KEY': {
    type: 'string',
    required: true
  }
}

console.log(yamljs.stringify(json, 5, 2))
fs.writeFileSync(
  path.join(process.cwd(), 'oms.yml'),
  yamljs.stringify(json, 5, 2)
)
fs.writeFileSync(
  path.join(process.cwd(), 'microservice.yml'),
  yamljs.stringify(json, 5, 2)
)