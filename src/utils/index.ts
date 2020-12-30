import { PixelRatio, Dimensions, Platform } from 'react-native';

export let screenWidth = Dimensions.get('window').width;
export let screenHeight = Dimensions.get('window').height;
export let pixelRatio = PixelRatio.get();
//px转换成dp
//以iphone6为基准,如果以其他尺寸为基准的话,请修改下面的defaultWidth和defaultHeight为对应尺寸即可. 以下为1倍图时
const defaultWidth = 375;
// const defaultHeight = 667;

//缩放比例
const _scaleWidth = screenWidth / defaultWidth;

// iPhoneX
const X_WIDTH = 375;
const X_HEIGHT = 812;

/**
 * 屏幕适配,缩放size , 默认根据宽度适配，纵向也可以使用此方法
 * 横向的尺寸直接使用此方法
 * 如：width ,paddingHorizontal ,paddingLeft ,paddingRight ,marginHorizontal ,marginLeft ,marginRight
 * @param size 设计图的尺寸
 * @returns {number}
 */
export function rpx(size: number): number {
  return size * _scaleWidth;
}

/**
 * 判断是否为iphoneX
 * @returns {boolean}
 */
export function isIphoneX(): boolean {
  return (
    Platform.OS === 'ios' &&
    ((screenHeight === X_HEIGHT && screenWidth === X_WIDTH) || (screenHeight === X_WIDTH && screenWidth === X_HEIGHT))
  );
}
