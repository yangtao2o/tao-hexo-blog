---
title: 移动端自适应布局理论知识梳理一二
date: 2021-03-28 09:19:42
tags:
  - CSS
  - SASS
categories:
  - CSS
---

> 移动端涉及到三个视口，分别是：
> Layout Viewport（布局视口）
> Visual Viewport（视觉视口），用户通过屏幕真实看到的区域
> Ideal Viewport (理想视口)，网站页面在移动端展示的理想大小

<!--more-->

## Viewport

首先，何谓视口（Viewport）？

在桌面端，视口指的是在桌面端，指的是浏览器的可视区域；而在移动端较为复杂，它涉及到三个视口，分别是：

- Layout Viewport（布局视口）
- Visual Viewport（视觉视口），用户通过屏幕真实看到的区域
- Ideal Viewport (理想视口)，网站页面在移动端展示的理想大小

[关于移动端适配，你必须要知道的](https://juejin.cn/post/6844903845617729549#heading-13)这篇文章对于视口有非常清楚的讲解。

在浏览器调试移动端时页面上给定的像素大小就是理想视口大小，所以，当页面缩放比例为 100% 时， `理想视口 = 视觉视口`。

那如何使`理想视口 = 视觉视口`呢？

毕竟他们的分辨率差的可太多了，如移动端默认的布局视口是 980px，但是我们在浏览器调试的时候，大部分是 360px、375px、414px，那设计稿的 1px 到底是谁的像素？

要回答这个问题，我们得先了解下像素和分辨率之间的关系！

### 像素和分辨率

像素，一个非常小的小方块，它具有特定的位置和颜色。而屏幕分辨率指一个屏幕具体由多少个像素点组成，如 iPhone 12 分辨率：`2532x1170`。

那么，我们常说分辨率越高，就一定越好吗？

非也，这里我们往往忽略了一个至关重要的条件：是否是同等大小的尺寸设备！

我们拿一张图片来说，在同等尺寸下，分辨率越高，图片越清晰。我们把描述图片质量的单位，就称作是 PPI（Pixel Per Inch)，即每英寸包括的像素数。

### PPI

PPI 是 Pixels Per Inch 缩写，所表示的是每英寸所拥有的像素（Pixel）数目。当屏幕的 PPI 当达到一定数值时，人眼无法分辨不出颗粒感。

PPI 用于描述屏幕的清晰度以及一张图片的质量。如 iPhone 12 的 PPI 高达 460，iPhone 12 mini 更甚，足足 476 ppi，说明 iPhone 12 mini 它每英寸约含有 476 个物理像素点。

那 PPI 是如何计算出来的呢？

首先，我们需要知道，iPhone 12 的尺寸是 6.1 英寸，这个 6.1 英寸是哪里的长度，高还是宽？对喽，是屏幕对角线长度！

其次，PPI 表示的是每英寸所拥有的像素，那 6.1 英寸的 PPI 就是 6.1 英寸所拥的像素。那问题来了，如何计算对角线有多小像素？

其实，这不就是计算直角三角形嚒？`y = √x^2 + y^2`，然后就可以得到对角线 y 的像素。

然后，用对角线的像素数除以屏幕尺寸，就是每寸所拥有的像素数目，即 PPI。完整公式：`PPI = √(x^2 + y^2) / size`

如 iPhone 12 分辨率：`2532x1170`，通过 js 计算下：

```js
// 获取对角线的像素大小
const getDevicePixels = (width, height) =>
  Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2))

// 获取PPI
const getDevicePPI = (width, height, inch) =>
  getDevicePixels(width, height) / inch
getDevicePPI(2532, 1170, 6.1) // 457.25
```

原来如此！这里，我们再简单了解下**Pentile 排列**。

Pentile 排列是现在一些采用 OLED 材质的手机 RGB 子像素的排列方式，主要是通过相邻像素公用子像素的方法来减少子像素的个数，从而达到低分辨率模拟高分辨率的效果。

当然，他也有计算公式，`PPI-pentile = √(2/3(x^2 + y^2)) / size`:

```js
const getDevicePPIPentile = (width, height, inch) =>
  Math.sqrt((2 / 3) * (Math.pow(width, 2) + Math.pow(height, 2))) / inch

getDevicePPIPentile(2532, 1170, 6.1) // 373.35
```

在线计算屏幕 PPI: [屏幕 PPI 计算器](https://www.itpwd.com/tools/ppicalc.php)

### DPI

DPI(Dot Per Inch)：即每英寸包括的点数。

使用 DPI 来描述图片和屏幕，这时的 DPI 应该和 PPI 是等价的，DPI 最常用的是用于描述打印机，表示打印机每英寸可以打印的点数。

### DP、DPR

一般我们常说的像素是物理像素，即真实的物理单元。如 iPhone 12 分辨率：`2532x1170`。但是我们发现，在浏览器开发移动端时，无论是设计稿还是浏览器此时的像素显示，一般是 360px、375px、414px 等这样的宽度，那如何将 2532px 的元素塞进这 375px 的设备里呢？

首先，这里的 375px 我们称之为设备独立像素(Device Independent Pixels)简称 DIP 或 DP。即告诉不同分辨率的手机，它们在界面上显示元素的大小是多少。

然后，利用设备像素比（device pixel ratio）简称 dpr，即物理像素和设备独立像素的比值，进行一下换算，就可以实现同一套设计稿尺寸，来适配不同分辨率的手机设备。

所以，当页面缩放比例为 100%时，`CSS 像素 = 设备独立像素`，`理想视口 = 视觉视口`。

### Meta viewport

我们可以借助`<meta>`元素的 viewport 来帮助我们设置视口、缩放等，从而让移动端得到更好的展示效果。

```html
<meta
  name="viewport"
  content="width=device-width; initial-scale=1; maximum-scale=1; minimum-scale=1; user-scalable=no;"
/>
```

为了在移动端让页面获得更好的显示效果，我们必须让布局视口、视觉视口都尽可能等于理想视口。

device-width 就等于理想视口的宽度，所以设置`width=device-width`就相当于让布局视口等于理想视口。

由于`initial-scale = 理想视口宽度 / 视觉视口宽度`，所以我们设置`initial-scale=1`; 就相当于让视觉视口等于理想视口。

这时，1 个 CSS 像素就等于 1 个设备独立像素，而且我们也是基于理想视口来进行布局的，所以呈现出来的页面布局在各种设备上都能大致相似。

## 使用 vw 等 viewport 单位实现自适应

### 相对单位

- em 作为 font-size 的单位时，其代表父元素的字体大小，em 作为其他属性单位时，代表自身字体大小
- rem 作用于非根元素时，相对于根元素字体大小；rem 作用于根元素字体大小时，相对于其出初始字体大小
- vw(Viewport's width): 1vw 等于视觉视口的 1%
- vh(Viewport's height) : 1vh 为视觉视口高度的 1%
- vmin : vw 和 vh 中的较小值
- vmax : 选取 vw 和 vh 中的较大值

如果视觉视口为 375px，那么`1vw = 3.75px`，这时 UI 给定一个元素的宽为 75px（设备独立像素），我们只需要将它设置为`75 / 3.75 = 20vw`。
这里的比例关系我们也不用自己换算，我们可以使用 PostCSS 的 `postcss-px-to-viewport` 插件帮我们完成这个过程。

### postcss-px-to-viewport

postcss-px-to-viewport，它将 px 转换成视口单位 vw，vw 本质上还是一种百分比单位，100vw 即等于 100%，即`window.innerWidth`，配置内容如下：

```js
module.exports = {
  plugins: {
    autoprefixer: {}, // 用来给不同的浏览器自动添加相应前缀，如-webkit-，-moz-等等
    'postcss-px-to-viewport': {
      unitToConvert: 'px', // 要转化的单位
      viewportWidth: 750, // UI设计稿的宽度
      unitPrecision: 6, // 转换后的精度，即小数点位数
      propList: ['*'], // 指定转换的css属性的单位，*代表全部css属性的单位都进行转换
      viewportUnit: 'vw', // 指定需要转换成的视窗单位，默认vw
      fontViewportUnit: 'vw', // 指定字体需要转换成的视窗单位，默认vw
      selectorBlackList: ['wrap'], // 指定不转换为视窗单位的类名，
      minPixelValue: 1, // 默认值1，小于或等于1px则不进行转换
      mediaQuery: true, // 是否在媒体查询的css代码中也进行转换，默认false
      replace: true, // 是否转换后直接更换属性值
      exclude: [/node_modules/], // 设置忽略文件，用正则做目录名匹配
      landscape: false // 是否处理横屏情况
    }
  }
}
```

详细内容见这里：[移动端布局之 postcss-px-to-viewport（兼容 vant）](https://www.cnblogs.com/zhangnan35/p/12682925.html)

### postcss-pxtorem

使用 `"postcss-pxtorem": "^5.1.1"`:

package.json:

```json
{
  "postcss": {
    "plugins": {
      "postcss-pxtorem": {
        "rootValue": 100,
        "propList": ["*"]
      }
    }
  }
}
```

scss:

```scss
// 设计稿尺寸，rootValue 是 100
$baseDesign: 375;
html {
  font-size: (100 / $baseDesign) * 100vw;

  @media screen and (orientation: landscape) {
    font-size: (100 / $baseDesign) * 100vh;
  }
  // 注意Px单位不要被转换为rem
  @media screen and (min-width: 769px) {
    max-width: 540px;
    min-height: 100%;
    margin: 0 auto;
    font-size: 110px;
  }
}
```

这样设置之后，通过 scss 编写的 px 单位会被 postcss 自动转换成 px，除了大写的 PX 或者 Px 单位。

### 将已有的 px 转换成 rem

移动端样式建立在 PC 基础上，所以需要避免 PC 的 px 单位转换，那就需要在移动端时，我们使用相对单位 rem，PC 端依旧时 px，使用方法如下：

下载：[PostCSS](https://www.npmjs.com/package/postcss)

```sh
postcss
postcss-pxtorem
```

配置`package.json`，设置 exclude 以排除 pc 目录下的转换功能：

```json
{
  "postcss": {
    "plugins": {
      "autoprefixer": {},
      "postcss-pxtorem": {
        "rootValue": 100,
        "propList": ["*"],
        "selectorBlackList": [],
        "exclude": ["/assets/sass/pc"]
      }
    }
  }
}
```

Sass 设置：

```scss
$baseDesign: 375;

html {
  font-size: (100 / $baseDesign) * 100vw;

  @media screen and (orientation: landscape) {
    font-size: (100 / $baseDesign) * 100vh;
  }
}
```

## 图片响应式

为了保证图片质量，针对不同 DPR 的屏幕，我们需要展示不同分辨率的图片。

所以，需要在`dpr=2`的屏幕上展示两倍图(@2x)，在`dpr=3`的屏幕上展示三倍图(@3x)

### 使用 max-width（图片自适应）

这样设置，既可以保证图片的最大值，又可以随盒子的变化而自适应：

```css
img {
  display: inline-block;
  max-width: 100%;
  height: auto;
}
```

### 使用 srcset

img 元素的 srcset 属性用于浏览器根据宽、高和像素密度来加载相应的图片资源。

属性格式：图片地址 宽度描述 w 像素密度描述 x，多个资源之间用逗号分隔。例如：

```html
<img src="photo.jpg" srcset="photo@2x.jpg 2x, photo@3x.jpg 3x" />
```

### 使用 css image-set

css 属性`image-set()`支持根据用户分辨率适配图像：

```css
body {
  background-image: image-set(
    url(../images/photo.jpg) 1x,
    url(../images/photo@2x.jpg) 2x,
    url(../images/photo@3x.jpg) 3x
  );
}
```

### 使用 media 查询

使用 media 查询判断不同的设备像素比来显示不同精度的图片:

```css
.avatar {
  background-image: url(photo.png);
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .avatar {
    background-image: url(photo@2x.png);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .avatar {
    background-image: url(photo@3x.png);
  }
}
```

### 使用 svg

SVG 的全称是可缩放矢量图（Scalable Vector Graphics）。不同于位图的基于像素，SVG 则是属于对图像的形状描述，所以它本质上是文本文件，体积较小，且不管放大多少倍都不会失真。

## 参考资料

- [前端响应式布局原理与方案（详细版）](https://juejin.im/post/6844903814332432397#heading-7) —— rem + vw 方案
- [关于移动端适配，你必须要知道的](https://juejin.im/post/6844903845617729549) —— 详细介绍，值得反复阅读
- [移动端 H5 解惑-页面适配（二）](https://juejin.im/post/6844903651245293582) —— 早期兼容方式，主要是兼容 PC、移动，现不推荐，但是理论概念值得学习
- [从网易与淘宝的 font-size 思考前端设计稿与工作流](https://www.cnblogs.com/lyzg/p/4877277.html) —— 理解大厂的逻辑，站在大厂的角度想问题
- [移动端布局之 postcss-px-to-viewport（兼容 vant）](https://www.cnblogs.com/zhangnan35/p/12682925.html)
