import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Send Money Instantly</h1>
      <p className="text-lg text-gray-600 mb-8">Easily transfer money to friends and family with our app.</p>
      <Link to="/signup" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Sign Up Now
      </Link>
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">How It Works</h2>
        <div className="flex flex-col items-center space-y-4">
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">1. Sign Up</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">2. Search for Friends</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-600">3. Transfer Money</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home