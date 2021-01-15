# KitIM

[![QQ群](https://img.shields.io/badge/QQ%E7%BE%A4-207879913-yellowgreen.svg)](https://jq.qq.com/?_wv=1027&k=9f25XGCW)

[介绍](#介绍) | [DEMO](#DEMO) | [开发](#开发) | [开发计划](#开发计划) | [系统架构](#系统架构) | [联系作者](#联系作者)

## 介绍

基于`react-native` + `typescript` 开发高性能的即时通讯系统。已完成基础 UI 开发，已支持点到点通讯，计划支持群聊天，上下线等事件通知。

**本项目仅限交流学习，不可用于商业。**

## DEMO

请于 [releases](https://gitee.com/kitim/kitim-react-native/releases) 下载对应 apk。

## 开发

```shell
# 克隆项目
$ git clone git@gitee.com:kitim/kitim-react-native.git
$ cd kitim-react-native
$ yarn && yarn android
```

## 开发计划

### UI 开发

![UI图](https://i.loli.net/2020/05/28/29YadEVhGSqojZU.png)

- [x] [好友列表](#好友列表)
- [x] [对话页](#对话页)
- [x] [通讯录](#通讯录)
- [x] [登录](#登录)
- [x] [注册](#注册)
- [x] [我的信息](#我的信息)
- [x] [搜索好友](#搜索好友)
- [ ] [添加好友](#添加好友)
- [ ] [好友信息](#好友信息)

### 功能开发

- [x] [登录](#登录)
- [x] [注册](#注册)
- [x] [好友列表](#好友列表)
- [x] [私聊](#私聊)
- [x] [通讯录](#通讯录)
- [x] [我的信息](#我的信息)
- [x] [搜索好友](#搜索好友)
- [x] [消息本地存储与恢复](#消息本地存储与恢复)
- [x] [聊天页键盘处理](#聊天页键盘处理)

### 遗留 BUG

- [ ] [消息页点击左侧键盘闪动问题](#消息页点击左侧键盘闪动问题)
- [ ] [搜索页回退无动画问题](#搜索页回退无动画问题)
- [ ] [IOS 无启动图](#IOS无启动图)
- [ ] [安卓启动图未适配异形屏](#安卓启动图未适配异形屏)
- [ ] [通知好友 新好友请求](#通知好友新好友请求)
- [ ] [通知用户 好友请求通过](#通知用户 好友请求通过)

## 系统架构

系统使用`react-native`开发，可以同时开发安卓端与 IOS 端，同时使用以下第三库开发。

UI 库：@ant-design/react-native  
路由库：@react-navigation/native  
数据管理：redux、redux-thunk  
本地存储：realm

## 联系作者

- [qq 群](https://jq.qq.com/?_wv=1027&k=9f25XGCW)
- 公众号，欢迎关注，不定时更新

![前端方程式](https://i.loli.net/2020/05/28/CNcjhm17d9zfvkQ.jpg)

### 捐助与支持

如果您觉得我们的开源软件对你有所帮助，请帮作者点一个免费的 Star, 或者扫下方二维码打赏我们一杯咖啡。

<img src="https://images.gitee.com/uploads/images/2021/0105/120317_1bea64c8_592960.png" width="300" height="300" align="bottom" />
