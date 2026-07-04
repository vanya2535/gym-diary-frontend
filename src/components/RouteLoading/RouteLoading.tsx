import styles from './RouteLoading.module.scss'

export function RouteLoading() {
  return (
    <div className={styles.root}>
      <p className={styles.text}>Загрузка…</p>
    </div>
  )
}
