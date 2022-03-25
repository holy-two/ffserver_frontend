# FFServer Frontend
一个本地文件服务器的前端部分，本质目的是为了解决当你不想下载QQ，微信等国产软件，但是又想跟电脑交换文件的情况，将后端部分启动后访问即可访问

后端部分：[nanarino/ffserver](https://github.com/nanarino/ffserver)

## 启动
```bash
yarn dev
```

## 效果截图

![image-20220325154322667](https://raw.githubusercontent.com/mowtwo/pic-go/main/markdown/image-20220325154322667.png)

## TODO

### 前端

- [x] 读取文件列表
  - [x] 显示文件详细信息
  - [ ] 文件排序
  - [ ] 文件多选操作
- [x] 上传文件/新建文件夹
- [x] 移动文件/重命名
- [x] 删除文件
- [ ] 二维码下载/分享
- [ ] 自定义弹窗
- [ ] 路径导航需要实现过长折叠

### 后端

- [x] 读取文件列表
- [x] 上传文件
- [x] 移动文件/重命名
- [x] 删除文件