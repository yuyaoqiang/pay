import React, { Component } from 'react';
import { connect } from 'dva';
import styles from './ysf.less';
import { isJudge } from '@/utils/helpers';
import { Modal, Toast } from 'antd-mobile';

class YsfComponent extends Component {
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
              opennerApp('uppaywallet://');
              this.setState({ modalVisiable: false });
            },
          },
        ]}
      >
        复制成功,点击确定打开云闪付!
      </Modal>
    );
  };

  render() {
    const { actualAmount, copyText, orderInfo }: any = this.props;
    const { countdownHour, countdownMinute, countdownSecond, overdueFlag }: any = this.props;
    return (
      <div className={styles.container}>
        <div className={styles.top}>
          <span className={styles.alipayIcon}></span>
          <div className={styles.translateMoney}>
            <span className={styles.helperToMoney}>
              请转账<span>￥{actualAmount(orderInfo)}</span>
            </span>
          </div>
          <div className={styles.orderId}>
            <span>订单号：{orderInfo.orderNo}</span>
            <span
              className={styles.copyBtn}
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
          <div className={styles.alertMsg}>请勿重复支付</div>
          <div className={styles.userInfo}>
            <span>云闪付账号：{orderInfo.account}</span>
            <span
              className={styles.copyBtn}
              onClick={event => {
                copyText(orderInfo.account, () => {
                  Toast.success('复制成功！请切换到支付页面按住3秒黏贴'), 5;
                });
              }}
            >
              复制
            </span>
          </div>
          <div className={styles.userInfo}>
            <span>收款姓名：{orderInfo.realName}</span>
            <span
              className={styles.copyBtn}
              onClick={event => {
                copyText(orderInfo.realName, () => {
                  Toast.success('复制成功！请切换到支付页面按住3秒黏贴'), 5;
                });
              }}
            >
              复制
            </span>
          </div>
          <div className={styles.mind}>
            <span
              className={styles.ysfBtn}
              onClick={() => this.setState({ modalVisiable: true })}
            >
              打开云闪付
            </span>
          </div>
        </div>
        {this.opennerAlipayByModal()}
      </div>
    );
  }
}

export default YsfComponent;
