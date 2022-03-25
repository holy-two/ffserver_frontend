export default function parseMorePath(path: string) {
  return path.replaceAll(/\/+/g, '/')
}