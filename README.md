# 宁皓网 Node.js 课程代码

打开命令行，Windows 上下载安装 Cmder 作为命令行工具，macOs 用户使用系统自带的终端（Terminal）。然后在命令行下面执行下面这些步骤。

## 1. 克隆仓库

```
git clone git@github.com:ninghao/ninghao-sandbox-v2.git
```
## 2. 切换分支

不同的课程的代码，可能会在不同的分支上。把项目克隆到本地以后可以切换到跟课程对应的分支上。比如：

```
cd ninghao-sandbox-v2
git branch -a
git checkout -b wxpay remotes/origin/wxpay
```

`wxpay`，这个分支上包含的是微信支付课程中的扫码支付课程用的代码。

## 3. 安装与运行
先确定您的操作系统上，在全局范围已经安装了 `@adonisjs/cli` 这个包。然后执行下面这些命令：

```
npm install
cp .env.example .env
adonis key:generate
adonis serve --dev
```

如果提示没有找到 `adonis` 命令，您需要先去安装一下。

```
npm install @adonisjs/cli --global
```
