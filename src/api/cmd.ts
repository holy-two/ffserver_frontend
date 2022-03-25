const baseUrl = '/api'

function joinCmd(cmd: string) {
  return `${baseUrl}/${cmd}`
}

function err(cmd: string, msg: string) {
  return `api:${cmd}/${msg}`
}

export interface NotFound {
  detail: string
}

export interface ValidError {
  detail: {
    loc: string[]
    msg: string
    type: string
  }[]
}

function isResult<D>(res: Response, _json: any): _json is D {
  return res.status === 200
}

function isNotFount(res: Response, _json: any): _json is NotFound {
  return res.status === 404
}

function isValidError(res: Response, _json: any): _json is ValidError {
  return res.status === 422
}

async function handleResp<D>(res: Response) {
  const json = await res.json()
  if (isResult<D>(res, json)) {
    return json
  } else if (isNotFount(res, json)) {
    throw new Error(json.detail)
  } else if (isValidError(res, json)) {
    throw new Error(JSON.stringify(json.detail))
  } else {
    throw new Error(JSON.stringify(json))
  }
}

export async function get<D>(cmd: string, path: string) {
  const res = await fetch(joinCmd(cmd) + '/' + path, {
    method: 'GET'
  })
  return await handleResp<D>(res)
}

export async function post<D>(cmd: string, path: string, data: Record<string, any>) {
  const fd = new FormData()
  for (const key in data) {
    fd.append(key, data[key])
  }
  const res = await fetch(joinCmd(cmd) + '/' + path, {
    method: 'POST',
    body: fd,
  })
  return await handleResp<D>(res)
}

export async function del<D>(cmd: string, path: string) {
  const res = await fetch(joinCmd(cmd) + '/' + path, {
    method: 'DELETE'
  })
  return await handleResp<D>(res)
}

export async function put<D>(cmd: string, path: string, data: Record<string, any>) {
  const fd = new FormData()
  for (const key in data) {
    fd.append(key, data[key])
  }
  const res = await fetch(joinCmd(cmd) + '/' + path, {
    method: 'PUT',
    body: fd,
  })
  return await handleResp<D>(res)
}
export interface LsResult {
  ctime: string
  mime: string
  mtime: string
  name: string
  size: string
  type: 'file' | 'folder'
}

export async function ls<D extends LsResult[] = LsResult[]>(path: string) {
  try {
    const res = await get<D>('folder', path)
    return res
  } catch (e) {
    throw new Error(err('ls', e))
  }
}

export async function rm_f(path: string, name?: string) {
  try {
    if (confirm(`You want to delete file ${name ? name : path}?`)) {
      await del('file', path)
      return true
    } else {
      return false
    }
  } catch (e) {
    throw new Error(err('rm -f', e))
  }
}

export async function rm_rf(path: string, name?: string) {
  try {
    if (confirm(`You want to delete folder ${name ? name : path}?`)) {
      await del('folder', path)
      return true
    } else {
      return false
    }
  } catch (e) {
    throw new Error(err('rm -rf', e))
  }
}


export async function download(path: string, filename: string) {
  const a = document.createElement('a')
  a.href = joinCmd('file') + '/' + path
  a.download = filename
  a.click()
}

export async function mkdir(path: string) {
  const folder = prompt('new folder name', 'new folder')
  if (!folder) {
    return false
  }
  try {
    await post('folder', path, {
      dirname: folder
    })
    return true
  } catch (e) {
    throw new Error(err('mkdir', e))
  }
}



export function upload(path: string) {
  return new Promise<boolean>((resolve, reject) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.addEventListener('change', async () => {
      const file = input.files[0]
      if (!file) {
        return reject('file select error')
      }
      if (confirm(`Do you want to upload ${file.name}`)) {
        try {
          await post('file', path, {
            file
          })
          resolve(true)
        } catch (e) {
          reject(err('upload', e))
        }
      } else {
        resolve(false)
      }
    })
    input.click()
  })
}

export async function rename(path: string, name: string, type: 'file' | 'folder' = 'file') {
  const new_name = prompt(`replace ${type} name`, name)
  if (!new_name) {
    throw new Error(err('rename', 'new name connot be empty'))
  }
  if (name === new_name) {
    return true
  }
  try {
    await put(type, path, {
      new_path: path.replace(name, new_name)
    })
    return true
  } catch (e) {
    throw new Error(err('rename', e))
  }
}

export async function move(from: string, to: string, type: 'file' | 'folder' = 'file') {
  if (confirm(`you want to move ${type} ${from} to ${to}`)) {
    try {
      await put(type, from, {
        new_path: to
      })
      return true
    } catch (e) {
      throw new Error(err('rename', e))
    }
  } else {
    return false
  }
}