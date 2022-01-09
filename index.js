#!/usr/bin/env node

const argv = require('minimist')(process.argv.slice(2))
const { blue, cyan, gray, green, red } = require('kolorist')
const { ensureProjectConfig, scaffoldProject } = require('./tasks')
const { getPackageManagerInfo } = require('./utils')

async function init() {
  try {
    const [targetDir] = argv._
    const config = await ensureProjectConfig(targetDir)

    console.log(blue(`\nScaffolding project in ${cyan(config.projectDir)}...\n`))

    await scaffoldProject(config)

    console.log(`🎉 ${green('All ready!')}\n`)
    console.log('Now let\'s code by running:\n')
    console.log(` cd ${cyan(config.relativeProjectDir)}`)

    const { name: packageManager = 'npm' } = getPackageManagerInfo()

    if (packageManager === 'yarn') {
      console.log(' yarn')
      console.log(' yarn dev')
    } else {
      console.log(` ${packageManager} install`)
      console.log(` ${packageManager} run dev`)
    }
  } catch (err) {
    console.log(red(`\n${err.message || err}\n`))
  }
}

init()