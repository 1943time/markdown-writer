# Markdown Writer
A simple markdown technical note **[Download](https://github.com/1943time/markdown-writer/releases)**

English | [简体中文](README.zh-CN.md)

![](./help/img.png)

## Introduction
- Using [monaco-editor](https://microsoft.github.io) as the editor, some enhancements have been made on this basis, such as: code completion, link jumping, list indentation, table formatting, etc.
- The renderer uses the [vitepress](https://github.com/vuejs/vitepress) style

## Functions
- Gfm syntax support
- print pdf
- heading map
- emoji
- Advanced Search and File lookup
- Free adjustment of file tree
- History and rollback
- The clipboard file is copied directly to the editor

## Mac can't open app
> Very sorry that in the early stages of the project, the mac code signing has not been done  
> The solution is as follows

step1
```shell
sudo spctl  --master-disable
```
step2
```shell
sudo xattr -r -d com.apple.quarantine /Applications/Md\ Writer.app
```

## Screenshot
![](./help/search.png)
![](./help/images.png)
![](./help/history.png)
![](./help/print.png)
![](./help/nav.png)
