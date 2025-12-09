import { Outlet } from 'react-router'
export default function Page() {
  return (
    <div>
      <div>Child</div>
      <Outlet />
    </div>
  )
}
