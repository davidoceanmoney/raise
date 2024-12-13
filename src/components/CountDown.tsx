"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function CountDown() {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 0,
          hours: 0,
          minutes: 0,
    seconds: 0,
  })
  useEffect(() => {
    const targetDate = new Date().getTime() + 3020 * 60 * 1000
    const interval = setInterval(() => {
      const now = new Date().getTime()
      const distance = targetDate - now
      if (distance < 0) {
        clearInterval(interval)
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        })
        return
      }
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)
      setTimeRemaining({ days, hours, minutes, seconds })
    }, 1000)
    return () => clearInterval(interval)
  }, [])
  return (
    <div className="flex flex-col items-center justify-center pt-8 gap-6">
      <div className="text-2xl font-medium text-white font-monument ">Remaining Time</div>
      <div className="flex gap-4">
        <div className="bg-gray-900 text-gold-100  px-6 py-4 rounded-lg shadow-md text-center">
          <div className="text-4xl font-bold font-monument  text-center ">{timeRemaining.days}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Days</div>
        </div>
        <div className="bg-gray-900 text-gold-100  dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md text-center">
          <div className="text-4xl font-bold text-center">{timeRemaining.hours}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Hours</div>
        </div>
        <div className="bg-gray-900 text-gold-100  dark:bg-gray-800 px-6 py-4 rounded-lg shadow-md text-center">
          <div className="text-4xl font-bold text-center">{timeRemaining.minutes}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Minutes</div>
        </div>
      </div>
      {/* <div className="flex gap-4">
        <Button variant="outline">Start</Button>
        <Button variant="outline">Pause</Button>
        <Button variant="outline">Reset</Button>
      </div> */}
    </div>
  )
}