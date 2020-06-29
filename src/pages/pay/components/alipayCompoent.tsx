import React, { Component } from 'react';
import { connect } from 'dva';
import QRCode from 'qrcode.react';
import commonStyles from './common.less';
import styles from './alipay.less';
import { isJudge } from '@/utils/helpers';
import { Modal, Toast } from 'antd-mobile';
class AlipayCompoent extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisiable: false,
    };
  }
  opennerAlipayByModal = () => {
    const { opennerApp, copyText, orderInfo }: any = this.props;
    const { modalVisiable }: any = this.state;
    return (
      <Modal
        visible={modalVisiable}
        transparent
        maskClosable={false}
        title="提示"
        footer={[
          {
            text: '确定',
            onPress: () => {
              copyText(orderInfo.account);
              opennerApp('snssdk1128://');
              this.setState({ modalVisiable: false });
            },
          },
        ]}
      >
        复制成功,点击确定打开抖音App!
      </Modal>
    );
  };
  createQR = () => {
    const { orderInfo } = this.props;
    return <QRCode style={{ display: 'inline-block' }} value={orderInfo.codeContent} size={240} />;
  };
  render() {
    const { actualAmount, copyText, orderInfo }: any = this.props;
    const { countdownHour, countdownMinute, countdownSecond, overdueFlag }: any = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.translateMoney}>
            <span className={styles.alipayIcon}></span>
            <span>
              请转账<span>￥{actualAmount(orderInfo)}</span>
            </span>
          </div>
          <div className={styles.orderId}>
            <span>订单号：{orderInfo.orderNo}</span>
            <span
            onClick={event => {
              copyText(orderInfo.orderNo, () => {
                Toast.success('复制成功！请切换到支付页面按住3秒黏贴'), 5;
              });
            }}
            >
              复制
            </span>
          </div>
          <div className={styles.timeDown}>
            <span>
              支付倒计时 {countdownMinute}分:{countdownSecond}秒
            </span>
          </div>
        </div>
        <div className={styles.mind}>
          <p>优先使用其他手机扫码100%成功</p>
          <p>使用抖音,闲鱼,高德地图第三方软件扫码100%成功，二维码下方有教程</p>
          <div className={styles.qr}>{this.createQR()}</div>
          <p>如抖音扫一扫跳转到支付宝后</p>
          <p>提示 重要提示 请使用其他手机扫一扫 </p>
        </div>
        <div className={styles.bottom}>
          <p className={styles.dyButton} onClick={() => this.setState({ modalVisiable: true })}></p>
          <p className={styles.dyGif}></p>
        </div>
        {this.opennerAlipayByModal()}
      </div>
    );
  }
}

export default AlipayCompoent;
