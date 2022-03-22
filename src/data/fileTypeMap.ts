export enum PURE_FILE_TYPE {
  JavaScript = 'JavaScript',
  TypeScript = 'TypeScript',
  Python = 'Python',
  HTML = 'HTML',
  XML = 'XML',
  CSS = 'CSS',
  Image = 'Image',
  AdobePSD = 'Adobe PS',
  AdobeAI = 'Adobe AI',
  MsDoc = 'Microsoft Word',
  MsExcel = 'Microsoft Excel',
  MsPPT = 'Microsoft PPT',
  Audio = 'Audio',
  Video = 'Video',
  Binary = 'Binary',
  Text = 'Plain Text',
  Unknown = 'Unknown',
  SVG = 'SVG'
}

export const filename_map = {
  'js': PURE_FILE_TYPE.JavaScript,
  'jsx': PURE_FILE_TYPE.JavaScript,
  'ts': PURE_FILE_TYPE.TypeScript,
  'tsx': PURE_FILE_TYPE.TypeScript,
  'py': PURE_FILE_TYPE.Python,
  'pyd': PURE_FILE_TYPE.Python,
  'pyc': PURE_FILE_TYPE.Python,
  'html': PURE_FILE_TYPE.HTML,
  'css': PURE_FILE_TYPE.CSS,
  'scss': PURE_FILE_TYPE.CSS,
  'less': PURE_FILE_TYPE.CSS,
  'stylus': PURE_FILE_TYPE.CSS,
  'png': PURE_FILE_TYPE.Image,
  'jpg': PURE_FILE_TYPE.Image,
  'jpeg': PURE_FILE_TYPE.Image,
  'gif': PURE_FILE_TYPE.Image,
  'webp': PURE_FILE_TYPE.Image,
  'pngx': PURE_FILE_TYPE.Image,
  'psd': PURE_FILE_TYPE.AdobePSD,
  'psb': PURE_FILE_TYPE.AdobePSD,
  'ai': PURE_FILE_TYPE.AdobeAI,
  'doc': PURE_FILE_TYPE.MsDoc,
  'docx': PURE_FILE_TYPE.MsDoc,
  'xls': PURE_FILE_TYPE.MsExcel,
  'xlsx': PURE_FILE_TYPE.MsExcel,
  'ppt': PURE_FILE_TYPE.MsPPT,
  'pptx': PURE_FILE_TYPE.MsPPT,
  'mp3': PURE_FILE_TYPE.Audio,
  'mp4': PURE_FILE_TYPE.Video,
  'mov': PURE_FILE_TYPE.Video,
  'svg': PURE_FILE_TYPE.SVG,
  'txt': PURE_FILE_TYPE.Text
}

interface Icon { icon: string; color?: string }

export const fileicon_map: Record<string, Icon> = {
  [PURE_FILE_TYPE.JavaScript]: {
    icon: 'file-js',
    color: 'rgb(238,201,44)'
  },
  [PURE_FILE_TYPE.Python]: {
    icon: 'file-python',
    color: 'rgb(59,117,162)'
  },
  [PURE_FILE_TYPE.Image]: {
    icon: 'file-image'
  },
  [PURE_FILE_TYPE.Text]: {
    icon: 'file-text'
  }
}

export const defaultIcon: Icon = {
  icon: 'file'
}

export const defaultType = PURE_FILE_TYPE.Unknown