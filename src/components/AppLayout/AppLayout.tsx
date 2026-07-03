import { Outlet } from 'react-router-dom'
import { AppNav } from '../AppNav/index.ts'
import styles from './AppLayout.module.scss'

export function AppLayout() {
  return (
    <div className={styles.root}>
      <AppNav />
      <main className={styles.content}>
        <Outlet />
      </main>
    </div>
  )
}
