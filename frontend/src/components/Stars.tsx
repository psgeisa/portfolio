const STAR_COUNT = 40

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export default function Stars() {
  const stars = Array.from({ length: STAR_COUNT }, (_, i) => {
    const top = seededRandom(i * 12.9898) * 100
    const left = seededRandom(i * 78.233) * 100
    const size = 1 + seededRandom(i * 37.719) * 1.5
    const duration = 3 + seededRandom(i * 4.123) * 5
    const delay = seededRandom(i * 9.531) * 6

    return (
      <span
        key={i}
        className="star"
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })

  const lightDots = Array.from({ length: STAR_COUNT }, (_, i) => {
    const top = seededRandom(i * 12.9898 + 100) * 100
    const left = seededRandom(i * 78.233 + 100) * 100
    const size = 1.5 + seededRandom(i * 37.719 + 100) * 2
    const duration = 3 + seededRandom(i * 4.123 + 100) * 5
    const delay = seededRandom(i * 9.531 + 100) * 6
    const color = seededRandom(i * 63.97 + 100) > 0.5 ? 'green' : 'gray'

    return (
      <span
        key={`ld-${i}`}
        className={`light-dot light-dot-${color}`}
        style={{
          top: `${top}%`,
          left: `${left}%`,
          width: `${size}px`,
          height: `${size}px`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`,
        }}
      />
    )
  })

  return (
    <div className="stars" aria-hidden="true">
      {stars}
      {lightDots}
    </div>
  )
}
