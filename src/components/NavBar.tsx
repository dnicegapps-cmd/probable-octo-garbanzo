import { NavLink } from 'react-router-dom'
import { useDueCount } from '../hooks/useCollection'

export default function NavBar() {
  const dueCount = useDueCount()

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="font-bold text-blue-600 text-lg tracking-tight">漢 SRS</span>
        <div className="flex gap-1">
          <NavLink
            to="/search"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/collection"
            className={({ isActive }) =>
              `px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Collection
          </NavLink>
          <NavLink
            to="/review"
            className={({ isActive }) =>
              `relative px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-100'
              }`
            }
          >
            Review
            {dueCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center px-1">
                {dueCount > 99 ? '99+' : dueCount}
              </span>
            )}
          </NavLink>
        </div>
      </div>
    </nav>
  )
}
