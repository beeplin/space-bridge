module.exports = { convertImport }

function convertImport(code) {
  const codeMatch = code
    .trim()
    .replace(/"/gu, "'")
    .match(/^import(.*?)from\s*'(.*?)'$/u)
  if (!codeMatch) throw new Error('import declaration parsing error')
  const [, string, path] = codeMatch
  const stringMatch = string.trim().match(/^(.*?)\{(.*?)\}(.*?)$/u)
  const [, match1, named, match2] = stringMatch ?? [null, string, '', '']
  const unnamed = `${match1} ${match2}`.split(',').map((s) => s.trim())
  const allName = {
    local: unnamed
      .find((s) => s.includes('*'))
      ?.split(' as ')?.[1]
      ?.trim(),
    imported: '*',
  }
  const defaultName = {
    local: unnamed.find((s) => s && !s.includes('*')),
    imported: 'default',
  }
  const namedName = named.split(',').map((part) => {
    const [imported, local = imported] = part.split(' as ').map((n) => n.trim())
    return imported ? { local, imported } : null
  })
  return {
    path,
    names: [allName, defaultName, ...namedName].filter((i) => i?.local),
  }
}