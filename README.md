# 微信小程序支付

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
git checkout -b wxpay-wxa remotes/origin/wxpay-wxa
```

`wxpay-wxa`，这个分支上包含的是微信支付课程中的扫码支付课程用的代码。

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

## 4. 配置
微信支付的主配置文件是在 `config/wxpay.js` 这个文件里面，打开这个文件，修改里面的相关的配置。然后你要修改项目根目录下的 `.env` 这个环境变量文件。在这个文件里添加下面这些配置：

```
WXPAY_MCH_ID=1328508902
WXPAY_KEY=3fa1815e38bf4908sse12287eb6a7f92
WXPAY_NOTIFY_URL=https://sandbox.ninghao.net/wxpay/notify
WXA_APP_ID=wxd863a659d2893386
WXA_SECRET=37768931e8a1fe185e9cf93f361259e3
```

等号左边是配置的名字，右边是配置的值，你可把等号右边的东西换成你自己的。

- WXPAY_MCH_ID：微信支付账户的商户 ID
- WXPAY_NOTIFY_URL：微信支付成功以后，在应用里接受支付结果通知的地址
- WXMP_APP_SECRET：公众号开发者密码，需要在公众号后台，开发 - 基本设置 这里去设置开发者密码
- WXA_APP_ID：小程序ID
- WXA_SECRET：小程序密钥

## 5. 小程序
用的小程序项目在 `ninghao-weixin` 这个仓库里，分支是 `wxpay-wxa`。[项目地址](https://github.com/ninghao/ninghao-weixin/tree/wxpay-wxa)
