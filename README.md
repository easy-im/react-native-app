# speedy-im

[![star](https://img.shields.io/github/stars/AspenLuoQiang/speedy-im?style=social)](https://github.com/AspenLuoQiang/speedy-im) [![QQ群](https://img.shields.io/badge/QQ%E7%BE%A4-207879913-yellowgreen.svg)](https://jq.qq.com/?_wv=1027&k=9f25XGCW)

[介绍](#介绍) | [DEMO](#DEMO) | [开发](#开发) | [开发计划](#开发计划) | [系统架构](#系统架构) | [联系作者](#联系作者)

## 介绍

基于`react-native` + `typescript` 开发高性能的即时通讯系统。已支持点对点通讯，计划支持群组通讯、上下线等事件消息等众多功能。

## DEMO

[IM.apk](https://im.wangcai.me/__UNI__0CE1D62_1225145406.apk) ，已有基础 UI 以及登陆、点到点聊天等功能。

## 开发

客户端测试账号密码：

账号：13600000003
密码：admin

```shell
# 克隆项目
$ git clone git@gitee.com:kitim/kitim-react-native.git
$ cd kitim-react-native
# 安装客户端依赖，安装完成后使用HBuilder X运行到浏览器即可，请确保此时服务端已正确运行，否则会导致接口无法调用
$ yarn && yarn android
```

## 开发计划

![UI图](https://i.loli.net/2020/05/28/29YadEVhGSqojZU.png)

- [x] [好友列表](#好友列表)
- [x] [对话页](#对话页)
- [x] [通讯录](#通讯录)
- [x] [登录](#登录)
- [x] [注册](#注册)
- [ ] [我的信息](#我的信息)
- [ ] [好友信息](#好友信息)

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
