import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import SearchPage from './pages/SearchPage'
import CollectionPage from './pages/CollectionPage'
import ReviewPage from './pages/ReviewPage'

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <NavBar />
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<Navigate to="/search" replace />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/collection" element={<CollectionPage />} />
            <Route path="/review" element={<ReviewPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
