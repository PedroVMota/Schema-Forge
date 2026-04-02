import App from './components/app'

export default function Page() {
  return (
    <main className="h-screen w-screen overflow-hidden relative">
      {/* Animated mesh gradient background */}
      <div className="mesh-bg">
        <div className="mesh-orb" />
      </div>
      <App />
    </main>
  )
}
