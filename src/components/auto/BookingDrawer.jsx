import { useState } from 'react'
import { useCarStore } from '../../hooks/useCarStore'
import { CAR_MODELS } from '../../constants/carData'

export default function BookingDrawer() {
  const { state, dispatch } = useCarStore()
  const [step, setStep] = useState(0)
  const [selectedDate, setSelectedDate] = useState(null)
  const [selectedTime, setSelectedTime] = useState(null)

  if (state.activeScene !== 'auto-studio' || !state.showBooking) return null

  const car = CAR_MODELS.find((m) => m.id === state.activeModel)

  const dates = ['May 20', 'May 21', 'May 22', 'May 23', 'May 24']
  const times = ['9:00 AM', '11:00 AM', '1:00 PM', '3:00 PM', '5:00 PM']

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => dispatch({ type: 'TOGGLE_BOOKING' })} />
      <div
        className="relative w-[90%] max-w-md animate-[fadeUp_0.4s_ease-out_both] pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative bg-black/80 backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-white/[0.04] via-transparent to-transparent pointer-events-none" />
          <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-teal-500/30 to-transparent" />

          <div className="relative px-6 pt-5 pb-6 md:p-7">
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
              <div>
                <p className="text-teal-400/60 text-[9px] tracking-[0.3em] uppercase">Test Drive</p>
                <h2 className="text-white text-xl md:text-2xl font-extralight tracking-wider mt-0.5">{car?.name}</h2>
              </div>
              <button
                onClick={() => dispatch({ type: 'TOGGLE_BOOKING' })}
                className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/40 cursor-pointer hover:text-white/70 hover:bg-white/10 transition-all"
              >
                ✕
              </button>
            </div>

            {/* Steps */}
            <div className="flex gap-1 mb-5">
              {[0, 1, 2].map((s) => (
                <div key={s} className={`flex-1 h-0.5 rounded-full transition-all duration-300 ${step >= s ? 'bg-teal-500/60' : 'bg-white/10'}`} />
              ))}
            </div>

            {step === 0 && (
              <div className="animate-[fadeUp_0.3s_ease-out_both]">
                <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mb-3">Select Date</p>
                <div className="grid grid-cols-3 gap-2">
                  {dates.map((date) => (
                    <button
                      key={date}
                      onClick={() => { setSelectedDate(date); setStep(1) }}
                      className={`py-3 rounded-xl border cursor-pointer transition-all duration-300 text-center ${
                        selectedDate === date
                          ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                          : 'bg-white/3 border-white/8 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-light">{date}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="animate-[fadeUp_0.3s_ease-out_both]">
                <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mb-3">Select Time</p>
                <div className="grid grid-cols-3 gap-2">
                  {times.map((time) => (
                    <button
                      key={time}
                      onClick={() => { setSelectedTime(time); setStep(2) }}
                      className={`py-3 rounded-xl border cursor-pointer transition-all duration-300 text-center ${
                        selectedTime === time
                          ? 'bg-teal-500/15 border-teal-500/40 text-teal-400'
                          : 'bg-white/3 border-white/8 text-white/60 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-light">{time}</span>
                    </button>
                  ))}
                </div>
                <button onClick={() => setStep(0)} className="text-white/25 text-[10px] tracking-[0.2em] uppercase mt-3 cursor-pointer hover:text-white/50">← Back</button>
              </div>
            )}

            {step === 2 && (
              <div className="animate-[fadeUp_0.3s_ease-out_both]">
                <p className="text-white/40 text-[9px] tracking-[0.25em] uppercase mb-3">Confirm Booking</p>
                <div className="bg-white/3 border border-white/8 rounded-xl p-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Vehicle</span>
                    <span className="text-white/70 text-xs font-light">{car?.name}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Date</span>
                    <span className="text-white/70 text-xs font-light">{selectedDate}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Time</span>
                    <span className="text-white/70 text-xs font-light">{selectedTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/30 text-[9px] tracking-[0.2em] uppercase">Location</span>
                    <span className="text-white/70 text-xs font-light">Los Angeles, CA</span>
                  </div>
                </div>
                <button className="w-full py-3.5 rounded-xl bg-teal-500/20 border border-teal-500/40 text-teal-400 text-sm font-light tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 hover:bg-teal-500/30 active:scale-[0.98]">
                  Confirm Booking
                </button>
                <button onClick={() => setStep(1)} className="w-full text-white/25 text-[10px] tracking-[0.2em] uppercase mt-3 cursor-pointer hover:text-white/50">← Back</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
