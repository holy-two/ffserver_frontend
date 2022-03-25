import type { PURE_FILE_TYPE } from "./data/fileTypeMap";

export interface IItem {
  name: string;
  modify: string;
  created: string;
}

export interface FolderItem extends IItem {
  type: "folder";
}
export interface FileItem extends IItem {
  type: "file";
  fileType: PURE_FILE_TYPE;
  size: string;
  download: string;
}

export type Item = FileItem | FolderItem;