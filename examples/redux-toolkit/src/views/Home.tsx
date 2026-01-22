import { useAppDispatch } from '@@/exports'
import Child from './Child'
import { updateNum } from '@/store/slice/count'

export default function Page() {
  const dispatch = useAppDispatch()

  return (
    <div>
      <Child />

      <button onClick={() => dispatch(updateNum(Math.random()))}>Change</button>
    </div>
  )
}
