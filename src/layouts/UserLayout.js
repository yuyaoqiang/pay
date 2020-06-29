import React from 'react';
import Link from 'umi/link';
import styles from './UserLayout.less';

class UserLayout extends React.PureComponent {
  render() {
    const { children } = this.props;
    return (
      <div className={styles.container}>
        {children}
      </div>
    );
  }
}

export default UserLayout;
