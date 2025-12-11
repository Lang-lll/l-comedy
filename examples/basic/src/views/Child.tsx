import { Outlet } from 'react-router'
import styles from './Child.module.less'

export default function Page() {
  return (
    <div className={styles.childContainer}>
      <div>Child</div>
      <Outlet />
    </div>
  )
}
