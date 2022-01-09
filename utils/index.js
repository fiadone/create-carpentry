const cp = require('child_process')
const fs = require('fs')
const path = require('path')

module.exports.cloneRepo = function(url, dest, omit = [], branch) {
  return new Promise((resolve, reject) => {
    const command = `git clone ${url} --depth 1 ${dest}${branch ? ` --branch ${branch}` : ''}`
    
    cp.exec(command, (err, stdout, stderr) => {
      if (err) {
        reject(err)
        return
      }
      
      ['.git', ...omit].forEach(entry => {
        fs.rmSync(path.join(dest, entry), {
          recursive: true,
          force: true
        })
      })

      resolve({ stdout, stderr })
    })
  })
}

module.exports.updatePackageJson = function(root, data = {}) {
  const packagePath = path.resolve(root, 'package.json')
  const package = Object.assign(require(packagePath), data)

  return fs.promises.writeFile(packagePath, JSON.stringify(package, null, 2))
}

module.exports.getPackageManagerInfo = function() {
  const userAgent = process.env.npm_config_user_agent

  if (!userAgent) return {}

  const [name, version] = userAgent.split(' ')[0].split('/')

  return { name, version }
}