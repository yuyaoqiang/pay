import React, { Component } from 'react';
import { connect } from 'dva';
import commonStyles from './common.less';
import styles from './alipayTransferBank.less';
import { isJudge } from '@/utils/helpers';
import { Modal, Toast } from 'antd-mobile';

class AlipayTransferBank extends Component {
  constructor(props: any) {
    super(props);
    this.state = {
      modalVisiable: false,
    };
  }
  createQR = () => {
    return (
      <QRCode
        style={{ display: 'inline-block' }}
        value={`https://qr.alipay.com/fkx115499chcmf5qnlmancc`}
        size={240}
      />
    );
  };
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
              copyText(orderInfo.bankCardAccount);
              opennerApp('alipayqr://platformapi/startapp?saId=20000116');
              this.setState({ modalVisiable: false });
            },
          },
        ]}
      >
        复制成功,点击确定打开支付宝!
      </Modal>
    );
  };

  render() {
    const { actualAmount, copyText, orderInfo }: any = this.props;
    const { countdownHour, countdownMinute, countdownSecond, overdueFlag }: any = this.props;
    return isJudge(orderInfo.gatheringChannelCode === 'alipayTransferBank')(
      <div className={styles.container}>
        <div className={styles.top}>
          <span className={styles.alipayIcon}></span>
          <div className={styles.translateMoney}>
            <span className={styles.helperToMoney}>
              请转账<span>￥{actualAmount(orderInfo)}</span>
            </span>
            <span
              className={styles.moneyCopyBtn}
              onClick={event => {
                const money = actualAmount(orderInfo);
                copyText(money+'', () => {
                  Toast.success('复制成功！请切换到支付宝页面按住3秒黏贴', 3);
                });
              }}
            >
              复制金额
            </span>
          </div>
          <div className={styles.alertMsg}>请按照页面金额进行转账</div>
          <div className={styles.orderId}>
            <span>订单号：{orderInfo.orderNo}</span>
            <span
              className={styles.copyBtn}
              onClick={event => {
                copyText(orderInfo.orderNo, () => {
                  Toast.success('复制成功！请切换到支付宝页面按住3秒黏贴'), 5;
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
          <div className={styles.alertMsg}>请优先使用复制账号支付宝转账</div>
          <div className={styles.userInfo}>
            <span>银行：{orderInfo.openAccountBank}</span>
            <span
              className={styles.copyBtn}
              onClick={event => {
                copyText(orderInfo.openAccountBank, () => {
                  Toast.success('复制成功！请切换到支付宝页面按住3秒黏贴'), 5;
                });
              }}
            >
              复制
            </span>
          </div>
          <div className={styles.userInfo}>
            <span>开户人：{orderInfo.accountHolder}</span>
            <span
              className={styles.copyBtn}
              onClick={event => {
                copyText(orderInfo.accountHolder, () => {
                  Toast.success('复制成功！请切换到支付宝页面按住3秒黏贴'), 5;
                });
              }}
            >
              复制
            </span>
          </div>
          <div className={styles.userInfo}>
            <span>卡号：{orderInfo.bankCardAccount}</span>
            <span
              className={styles.copyBtn}
              onClick={event => {
                copyText(orderInfo.bankCardAccount, () => {
                  Toast.success('复制成功！请切换到支付宝页面按住3秒黏贴'), 5;
                });
              }}
            >
              复制
            </span>
          </div>
          <div
            className={styles.alipayBtn}
            onClick={() => this.setState({ modalVisiable: true })}
          ></div>
        </div>
        <div className={styles.mind}>
          <p>如无法使用唤醒支付宝转账,请尝试以下方法</p>
          <p></p>
        </div>
        {this.opennerAlipayByModal()}
      </div>,
      null,
    );
  }
}

export default AlipayTransferBank;
