import { useReducedMotion } from 'framer-motion'
import { useEffect, useState } from 'react'

export function useIsReducedMotion(userPreference: 'system' | 'reduce' | 'no-preference' = 'system'): boolean {
  const systemPrefers = useReducedMotion()
  const [reduce, setReduce] = useState<boolean>(() => {
    if (userPreference === 'reduce') return true
    if (userPreference === 'no-preference') return false
    return !!systemPrefers
  })

  useEffect(() => {
    if (userPreference === 'reduce') setReduce(true)
    else if (userPreference === 'no-preference') setReduce(false)
    else setReduce(!!systemPrefers)
  }, [userPreference, systemPrefers])

  return reduce
}
