import { Outlet } from 'react-router'
import './Home.less'

export default function Page() {
  return (
    <div>
      <div>Home</div>
      <div className="home-content">
        <Outlet />
      </div>
    </div>
  )
}
