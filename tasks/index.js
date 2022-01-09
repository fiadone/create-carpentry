const fs = require('fs')
const path = require('path')
const prompts = require('prompts')
const { cloneRepo, updatePackageJson } = require('../utils')
const { boilerplateUrl, boilerplateVersion, defaultProjectName } = require('../config.json')

const cwd = process.cwd()

module.exports.ensureProjectConfig = async function(targetDir) {
  let projectDir = targetDir ? path.join(cwd, targetDir) : ''
  let projectName = path.basename(projectDir)

  const answers = await prompts(
    [
      {
        type: !projectName ? 'text' : null,
        name: 'projectName',
        message: 'Project name:',
        initial: defaultProjectName,
        onState: ({ value }) => {
          projectName = value.trim() || defaultProjectName
          projectDir = path.join(cwd, projectName)
        }
      },
      {
        type: () => fs.existsSync(projectDir) ? 'confirm' : null,
        name: 'overwrite',
        message: 'The target directory is not empty. Remove existing files and continue?'
      }
    ],
    {
      onCancel: () => {
        throw new Error('Operation cancelled')
      }
    }
  )

  if (answers.hasOwnProperty('overwrite')) {
    if (!answers.overwrite) {
      throw new Error('Operation cancelled')
    }
    
    fs.rmSync(projectDir, {
      recursive: true,
      force: true
    })
  }

  return {
    projectName,
    projectDir,
    relativeProjectDir: path.relative(cwd, projectDir)
  }
}

module.exports.scaffoldProject = async function({ projectDir, projectName }) {  
  await cloneRepo(boilerplateUrl, projectDir, ['package-lock.json'], boilerplateVersion)
  await updatePackageJson(projectDir, { name: projectName })
}