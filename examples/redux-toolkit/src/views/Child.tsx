import { useAppSelector } from '@@/exports'

export default function Child() {
  const num = useAppSelector((state) => state.count.num)

  return (
    <div>
      <div>Number: {num}</div>
    </div>
  )
}
