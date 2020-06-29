import React, { Component } from 'react';
import { connect } from 'dva';
import { Toast } from 'antd-mobile';
import dayjs from 'dayjs';
import MaskFailCompoent from './components/maskFailCompoent';
import MaskSuccessCompoent from './components/maskSuccessCompoent';
import YsfCompoent from './components/ysfComponent';
import AlipayCompoent from './components/alipayCompoent';
import AlipayScanTransferCompoent from './components/alipayScanTransferCompoent';
import AlipayTransferBank from './components/alipayTransferBank';
import AlipayTransfer from './components/alipayTransfer';
import BankComponent from './components/bankComponent';
import styles from './pay.less';
import { isJudge } from '@/utils/helpers';
@connect(({ global }) => ({
  global,
}))
class Pay extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      orderInfo: {},
      paySuccessFlag: false,
      overdueFlag: false,
      residueSecond: 0,
      countdownHour: '',
      countdownMinute: '0',
      countdownSecond: '00',
    };
  }

  public componentDidMount(): void {
    this.initPage();
  }

  /**
   * 初始化请求订单信息
   */
  private initPage = () => {
    const { dispatch, location }: any = this.props;
    const orderNo = location.query.orderNo;
    if (!orderNo) {
      Toast.fail('无效的订单号', 5);
      return;
    }
    dispatch({
      type: 'global/getSystemSetting',
      callback: (res: any) => {
        if (res.code == 200) {
        }
      },
    });
    dispatch({
      type: 'global/getOrderGatheringCode',
      payload: { orderNo: orderNo },
      callback: (res: any) => {
        const { code, data } = res;
        if (code == 200) {
          const overdueFlag = !dayjs(data.usefulTime).isAfter(dayjs());
          if (data.orderState == '4') {
            this.setState({ ...this.state, orderInfo: data, overdueFlag, paySuccessFlag: true });
            this.toReturnUrl();
            return;
          }
          if (!overdueFlag) {
            const residueSecond = dayjs(data.usefulTime).diff(dayjs(res.timestamp), 'second');
            this.setState({ ...this.state, residueSecond, orderInfo: data }, () => {
              this.countdown();
            });
            this.checkPaySuccess();
            return;
          }
          this.setState({ ...this.state, overdueFlag, orderInfo: data });
        } else {
          Toast.fail(res.msg, 5);
        }
      },
    });
  };

  // 打开 支付宝h5转账 app
  openAlipayh5Transfer = () => {
    window.location.href = 'alipayqr://platformapi/startapp?saId=20000116';
  };

  // 打开 根据url评价打开对应app
  opennerApp = (url: any) => {
    var iFrame;
    var u = navigator.userAgent;
    var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
    var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
    if (isAndroid) {
      //安卓终端使用iframe
      iFrame = document.createElement('iframe');
      iFrame.setAttribute('src', url);
      iFrame.setAttribute('style', 'display:none;');
      iFrame.setAttribute('height', '0px');
      iFrame.setAttribute('width', '0px');
      iFrame.setAttribute('frameborder', '0');
      document.body.appendChild(iFrame);
      // 发起请求后这个 iFrame 就没用了，所以把它从 dom 上移除掉
      iFrame.parentNode.removeChild(iFrame);
      iFrame = null;
    } else if (isiOS) {
      //iOS终端直接页面跳转
      window.location.href = url;
      // 如果用户没有安装淘宝APP，则提示用户去安装淘宝
    } else {
      window.location.href = url;
    }
  };

  toReturnUrl = () => {
    const { orderInfo }: any = this.props;
    if (orderInfo.returnUrl == null || orderInfo.returnUrl == '') {
      return;
    }
    setTimeout(function() {
      window.location.href = orderInfo.returnUrl;
    }, 2000);
  };

  // 复制文本
  copyText = (text: string, cb: any = () => {}) => {
    if (!('execCommand' in document)) {
      Toast.info('复制失败,请手动复制', 2);
      return;
    }
    const temp = document.createElement('input');
    temp.setAttribute('value', text);
    temp.setAttribute('readonly', true);
    document.body.appendChild(temp);
    temp.select();
    temp.setSelectionRange(0, text.length);
    document.execCommand('copy');
    document.body.removeChild(temp);
    cb();
  };
  //计算金额
  actualAmount = (orderInfo: any) => {
    return Number(
      orderInfo.gatheringAmount + (orderInfo.floatAmount == null ? 0 : orderInfo.floatAmount),
    );
  };
  // // 定时获取订单状态
  // loadGatheringCode = (orderInfo: any) => {
  //   let intervalId = setInterval(() => {
  //     if (orderInfo.orderState == '2' || orderInfo.orderState == '4') {
  //       clearInterval(intervalId);
  //       return;
  //     }
  //     this.loadGatheringCodeInner();
  //   }, 1500);
  // };

  // 持续发出请求获取订单状态
  loadGatheringCodeInner = () => {
    const { dispatch }: any = this.props;
    const { orderInfo }: any = this.state;
    dispatch({
      type: 'global/getOrderGatheringCode',
      payload: { orderNo: orderInfo.orderNo },
      callback: (res: any) => {
        const { code, data } = res;
        if (code == 200) {
          this.setState({ ...this.state, orderInfo: data }, () => {
            if (data.orderState == '2' || data.orderState == '4') {
              let residueSecond = dayjs(data.orderInfo.usefulTime).diff(
                dayjs(res.timestamp),
                'second',
              );
              this.setState({ ...this.state, residueSecond });
              this.checkPaySuccess();
            }
            // that.generageQrcode();
          });
        }
      },
    });
  };
  // 检查订单是否支付成功
  checkPaySuccess = () => {
    const { orderInfo }: any = this.state;
    let interval = window.setInterval(() => {
      if (orderInfo.orderState == '4') {
        this.setState({ ...this.state, paySuccessFlag: true }, () => {
          clearInterval(interval);
          this.toReturnUrl();
        });
        return;
      }
      this.checkPaySuccessInner();
    }, 3000);
  };
  // 检查订单是否支付成功
  checkPaySuccessInner = () => {
    const { dispatch }: any = this.props;
    const { orderInfo }: any = this.state;
    dispatch({
      type: 'global/getOrderGatheringCode',
      payload: { orderNo: orderInfo.orderNo },
      callback: (res: any) => {
        const { code, data } = res;
        if (code == 200 && data.orderState == '4') {
          this.setState({ ...this.state, orderInfo: data });
        }
      },
    });
  };
  // 倒计时
  countdown = () => {
    let countdownInterval = setInterval(() => {
      let { residueSecond }: any = this.state;
      this.setState(
        (preState: any) => ({
          ...preState,
          residueSecond: preState.residueSecond - 1,
        }),
        () => {
          this.updateCountdownClock();
          if (residueSecond == 0) {
            clearInterval(countdownInterval);
            this.setState({ ...this.state, overdueFlag: true });
          }
        },
      );
    }, 1000);
  };
  /**
   * 更新倒计时
   */
  updateCountdownClock = () => {
    const { residueSecond }: any = this.state;
    var countdownHour = 0;
    var countdownMinute = 0;
    var countdownSecond = 0;
    if (residueSecond > 0) {
      countdownHour = parseInt((residueSecond / (60 * 60)) % 24);
      countdownMinute = parseInt((residueSecond / 60) % 60);
      countdownSecond = parseInt(residueSecond % 60);
    }
    if (countdownHour < 10) {
      countdownHour = '0' + countdownHour;
    }
    if (countdownMinute < 10) {
      countdownMinute = '0' + countdownMinute;
    }
    if (countdownSecond < 10) {
      countdownSecond = '0' + countdownSecond;
    }
    this.setState({ ...this.state, countdownHour, countdownMinute, countdownSecond });
  };

  render() {
    const { orderInfo, overdueFlag, paySuccessFlag }: any = this.state;
    return (
      <div className={styles.content}>
        {/* 超时，过期弹框 */}
        {isJudge(!paySuccessFlag && overdueFlag)(<MaskFailCompoent />, null)}

        {/* 成功 弹框 */}
        {isJudge(paySuccessFlag)(<MaskSuccessCompoent />, null)}

        {/* 支付宝扫码兼转账 */}
        {isJudge(orderInfo.gatheringChannelCode === 'alipayScanTransfer')(
          <AlipayScanTransferCompoent
            {...this.state}
            opennerApp={this.opennerApp}
            copyText={this.copyText}
            actualAmount={this.actualAmount}
          />,
          null,
        )}

        {/* 支付宝扫码 */}
        {isJudge(orderInfo.gatheringChannelCode === 'alipay')(
          <AlipayCompoent
            {...this.state}
            opennerApp={this.opennerApp}
            copyText={this.copyText}
            actualAmount={this.actualAmount}
          />,
          null,
        )}

        {/* 支付宝转账 */}
        {isJudge(orderInfo.gatheringChannelCode === 'alipayTransfer')(
          <AlipayTransfer
            {...this.state}
            opennerApp={this.opennerApp}
            copyText={this.copyText}
            actualAmount={this.actualAmount}
          />,
          null,
        )}

        {/* 银行卡 */}
        {isJudge(orderInfo.gatheringChannelCode === 'bankCard')(
          <BankComponent
            {...this.state}
            opennerApp={this.opennerApp}
            copyText={this.copyText}
            actualAmount={this.actualAmount}
          />,
          null,
        )}
        {/* zfb转账到银行卡 */}
        <AlipayTransferBank
          {...this.state}
          opennerApp={this.opennerApp}
          copyText={this.copyText}
          actualAmount={this.actualAmount}
        />
        {/* 云闪付 */}
        {isJudge(orderInfo.gatheringChannelCode === 'ysf')(
          <YsfCompoent
            {...this.state}
            opennerApp={this.opennerApp}
            copyText={this.copyText}
            actualAmount={this.actualAmount}
          />,
          null,
        )}
      </div>
    );
  }
}

export default Pay;
