import React, { Component } from 'react';
import commonStyles from './common.less';

class MaskCompoent extends Component {
  constructor(props: any) {
    super(props);
  }
  render() {
    return (
      <div className={commonStyles.maskSuccess}>
          <div>支付成功</div>
      </div>
    );
  }
}

export default MaskCompoent;
