export enum PURE_FILE_TYPE {
  Unknown,
  '7-Zip',
  AVI,
  BAT,
  'Adobe Illustrator',
  BMP,
  CSS,
  Conf,
  EOT,
  'MS-Word 2007',
  'MS-Word 2003',
  'MS-Excel 2007',
  'MS-PPT 2003',
  HTM,
  HTML,
  ICO,
  INI,
  Jar,
  Java,
  JPEG,
  JPG,
  JavaScript,
  MarkDown,
  MP3,
  MP4,
  MP5,
  MPGE,
  PDF,
  PL,
  PNG,
  PPT,
  'Adobe Photoshop',
  Python,
  RAR,
  RM,
  Shell,
  SVG,
  TTF,
  TAR,
  Text,
  WOFF,
  XML,
  YML,
  YAML,
  ZIP,
  Binary
}

export const filename_map = {
  '': '',
  '7z': PURE_FILE_TYPE["7-Zip"],
  'avi': PURE_FILE_TYPE.AVI,
  'bat': PURE_FILE_TYPE.BAT,
  'ai': PURE_FILE_TYPE["Adobe Illustrator"],
  'bmp': PURE_FILE_TYPE.BMP,
  'css': PURE_FILE_TYPE.CSS,
  'jss': PURE_FILE_TYPE.CSS,
  'wxss': PURE_FILE_TYPE.CSS,
  'scss': PURE_FILE_TYPE.CSS,
  'sass': PURE_FILE_TYPE.CSS,
  'less': PURE_FILE_TYPE.CSS,
  'stylus': PURE_FILE_TYPE.CSS,
  'styl': PURE_FILE_TYPE.CSS,
  'conf': PURE_FILE_TYPE.Conf,
  'config': PURE_FILE_TYPE.Conf,
  'eot': PURE_FILE_TYPE.EOT,
  'docx': PURE_FILE_TYPE["MS-Word 2007"],
  'doc': PURE_FILE_TYPE["MS-Word 2003"],
  'htm': PURE_FILE_TYPE.HTM,
  'html': PURE_FILE_TYPE.HTML,
  'xhtml': PURE_FILE_TYPE.HTML,
  'pug': PURE_FILE_TYPE.HTML,
  'ejs': PURE_FILE_TYPE.HTML,
  'hbs': PURE_FILE_TYPE.HTML,
  'php': PURE_FILE_TYPE.HTML,
  'asp': PURE_FILE_TYPE.HTML,
  'jsp': PURE_FILE_TYPE.HTML,
  'ico': PURE_FILE_TYPE.ICO,
  'icon': PURE_FILE_TYPE.ICO,
  'jar': PURE_FILE_TYPE.Jar,
  'war': PURE_FILE_TYPE.Jar,
  'java': PURE_FILE_TYPE.Java,
  'class': PURE_FILE_TYPE.Java,
  'jpeg': PURE_FILE_TYPE.JPEG,
  'jpg': PURE_FILE_TYPE.JPG,
  'js': PURE_FILE_TYPE.JavaScript,
  'jsx': PURE_FILE_TYPE.JavaScript,
  'coffee': PURE_FILE_TYPE.JavaScript,
  'ts': PURE_FILE_TYPE.JavaScript,
  'tsx': PURE_FILE_TYPE.JavaScript,
  'res': PURE_FILE_TYPE.JavaScript,
  'md': PURE_FILE_TYPE.MarkDown,
  'mdx': PURE_FILE_TYPE.MarkDown,
  'markdown': PURE_FILE_TYPE.MarkDown,
  'mp3': PURE_FILE_TYPE.MP3,
  'mp4': PURE_FILE_TYPE.MP4,
  'mp5': PURE_FILE_TYPE.MP5,
  'mpge': PURE_FILE_TYPE.MPGE,
  'mp2': PURE_FILE_TYPE.MPGE,
  'pdf': PURE_FILE_TYPE.PDF,
  'pl': PURE_FILE_TYPE.PL,
  'png': PURE_FILE_TYPE.PNG,
  'pngx': PURE_FILE_TYPE.PNG,
  'ppt': PURE_FILE_TYPE["MS-PPT 2003"],
  'pptx': PURE_FILE_TYPE["MS-PPT 2003"],
  'psd': PURE_FILE_TYPE["Adobe Photoshop"],
  'psb': PURE_FILE_TYPE["Adobe Photoshop"],
  'py': PURE_FILE_TYPE.Python,
  'pyd': PURE_FILE_TYPE.Python,
  'pyc': PURE_FILE_TYPE.Python,
  'rar': PURE_FILE_TYPE.RAR,
  'rm': PURE_FILE_TYPE.RM,
  'sh': PURE_FILE_TYPE.Shell,
  'ps1': PURE_FILE_TYPE.Shell,
  'svg': PURE_FILE_TYPE.SVG,
  'ttf': PURE_FILE_TYPE.TTF,
  'tar': PURE_FILE_TYPE.TAR,
  'txt': PURE_FILE_TYPE.Text,
  'text': PURE_FILE_TYPE.Text,
  'xls': PURE_FILE_TYPE["MS-Excel 2007"],
  'xlsx': PURE_FILE_TYPE["MS-Excel 2007"],
  'woff': PURE_FILE_TYPE.WOFF,
  'xml': PURE_FILE_TYPE.XML,
  'xaml': PURE_FILE_TYPE.XML,
  'yml': PURE_FILE_TYPE.YML,
  'yaml': PURE_FILE_TYPE.YAML,
  'zip': PURE_FILE_TYPE.ZIP,
  'bin': PURE_FILE_TYPE.Binary,
  'exe': PURE_FILE_TYPE.Binary,
  'dll': PURE_FILE_TYPE.Binary,
  'msi': PURE_FILE_TYPE.Binary,
  'so': PURE_FILE_TYPE.Binary,
  'msix': PURE_FILE_TYPE.Binary
}

interface Icon { icon: string; color?: string }

export const fileicon_map: Record<string, Icon> = {
  [PURE_FILE_TYPE['Unknown']]: {
    icon: 'file-unknown'
  },
  [PURE_FILE_TYPE['7-Zip']]: {
    icon: 'file-7z'
  },
  [PURE_FILE_TYPE['AVI']]: {
    icon: 'file-avi'
  },
  [PURE_FILE_TYPE['BAT']]: {
    icon: 'file-bat'
  },
  [PURE_FILE_TYPE['Adobe Illustrator']]: {
    icon: 'file-ai'
  },
  [PURE_FILE_TYPE['BMP']]: {
    icon: 'file-bmp',
    color: 'rgb(47,166,154)'
  },
  [PURE_FILE_TYPE['CSS']]: {
    icon: 'file-css',
    color: 'rgb(72,166,242)'
  },
  [PURE_FILE_TYPE['Conf']]: {
    icon: 'file-conf'
  },
  [PURE_FILE_TYPE['EOT']]: {
    icon: 'file-eot'
  },
  [PURE_FILE_TYPE['MS-Word 2007']]: {
    icon: 'file-docx',
    color: 'rgb(11,88,153)'
  },
  [PURE_FILE_TYPE['MS-Word 2003']]: {
    icon: 'file-doc',
    color: 'rgb(11,88,153)'
  },
  [PURE_FILE_TYPE['MS-Excel 2007']]: {
    icon: 'file-xlsx',
    color: 'rgb(11,88,153)'
  },
  [PURE_FILE_TYPE['MS-PPT 2003']]: {
    icon: 'file-ppt',
    color: 'rgb(11,88,153)'
  },
  [PURE_FILE_TYPE['HTM']]: {
    icon: 'file-htm'
  },
  [PURE_FILE_TYPE['HTML']]: {
    icon: 'file-html'
  },
  [PURE_FILE_TYPE['ICO']]: {
    icon: 'file-ico'
  },
  [PURE_FILE_TYPE['INI']]: {
    icon: 'file-ini'
  },
  [PURE_FILE_TYPE['Jar']]: {
    icon: 'file-jar'
  },
  [PURE_FILE_TYPE['Java']]: {
    icon: 'file-java',
    color: 'rgb(241,63,60)'
  },
  [PURE_FILE_TYPE['JPEG']]: {
    icon: 'file-jepg',
    color: 'rgb(47,166,154)'
  },
  [PURE_FILE_TYPE['JPG']]: {
    icon: 'file-jpg',
    color: 'rgb(47,166,154)'
  },
  [PURE_FILE_TYPE['JavaScript']]: {
    icon: 'file-javascript',
    color: 'rgb(22,137,206)'
  },
  [PURE_FILE_TYPE['MarkDown']]: {
    icon: 'file-markdown'
  },
  [PURE_FILE_TYPE['MP3']]: {
    icon: 'file-mp3'
  },
  [PURE_FILE_TYPE['MP4']]: {
    icon: 'file-mp4'
  },
  [PURE_FILE_TYPE['MP5']]: {
    icon: 'file-mp5'
  },
  [PURE_FILE_TYPE['MPGE']]: {
    icon: 'file-mpge'
  },
  [PURE_FILE_TYPE['PDF']]: {
    icon: 'file-pdf'
  },
  [PURE_FILE_TYPE['PL']]: {
    icon: 'file-pl'
  },
  [PURE_FILE_TYPE['PNG']]: {
    icon: 'file-png',
    color: 'rgb(47,166,154)'
  },
  [PURE_FILE_TYPE['PPT']]: {
    icon: 'file-ppt'
  },
  [PURE_FILE_TYPE['Adobe Photoshop']]: {
    icon: 'file-psd',
    color: 'rgb(47,166,154)'
  },
  [PURE_FILE_TYPE['Python']]: {
    icon: 'file-python',
    color: 'rgb(252,215,71)'
  },
  [PURE_FILE_TYPE['RAR']]: {
    icon: 'file-rar'
  },
  [PURE_FILE_TYPE['RM']]: {
    icon: 'file-rm'
  },
  [PURE_FILE_TYPE['Shell']]: {
    icon: 'file-sh'
  },
  [PURE_FILE_TYPE['SVG']]: {
    icon: 'file-svg'
  },
  [PURE_FILE_TYPE['TTF']]: {
    icon: 'file-ttf'
  },
  [PURE_FILE_TYPE['TAR']]: {
    icon: 'file-tar'
  },
  [PURE_FILE_TYPE['Text']]: {
    icon: 'file-text'
  },
  [PURE_FILE_TYPE['WOFF']]: {
    icon: 'file-woff',
  },
  [PURE_FILE_TYPE['XML']]: {
    icon: 'file-xml'
  },
  [PURE_FILE_TYPE['YML']]: {
    icon: 'file-yml'
  },
  [PURE_FILE_TYPE['YAML']]: {
    icon: 'file-yaml'
  },
  [PURE_FILE_TYPE['ZIP']]: {
    icon: 'file-zip'
  },
  [PURE_FILE_TYPE['Binary']]: {
    icon: 'file-bin'
  }
}

export const defaultIcon: Icon = {
  icon: 'file-unknown'
}

export const defaultType = PURE_FILE_TYPE.Unknown