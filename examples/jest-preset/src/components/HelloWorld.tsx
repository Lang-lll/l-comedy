import styles from './HelloWorld.less'

const HelloWorld = ({ name = 'World' }) => {
  return <div className={styles.hello}>Hello, {name}!</div>
}

export default HelloWorld
