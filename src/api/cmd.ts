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

function isResult<D>(res: Response, json: any): json is D {
  return res.status === 200
}

function isNotFount(res: Response, json: any): json is NotFound {
  return res.status === 404
}

function isValidError(res: Response, json: any): json is ValidError {
  return res.status === 422
}

export async function get<D>(cmd: string, path: string) {
  const res = await fetch(joinCmd(cmd) + '/' + path, {
    method: 'GET'
  })
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

export function post(cmd: string, path: string, data: Record<string, any>) {
  const u = new URLSearchParams(data)
  return fetch(joinCmd(cmd) + '/' + path, {
    method: 'POST',
    body: u.toString(),
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(res => {
    return res.json()
  }).catch(res => {
    err(cmd, 'post error')
  })
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

export async function download(path: string, filename: string) {
  const a = document.createElement('a')
  a.href = joinCmd('file') + '/' + path
  a.download = filename
  a.click()
}