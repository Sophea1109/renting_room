'use client'

import { useState } from 'react'
import { X, CreditCard, CheckCircle2, Printer } from 'lucide-react'

export default function PaymentModal({ isOpen, onClose, unitId, unitTitle, startDate, endDate, totalPrice }) {
  const [step, setStep] = useState('payment') // payment | processing | success
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [name, setName] = useState('')
  const [bookingRef, setBookingRef] = useState('')
  const [error, setError] = useState('')

  const API = process.env.NEXT_PUBLIC_API_URL
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  if (!isOpen) return null

  const handlePayment = async (e) => {
    e.preventDefault()
    setError('')
    setStep('processing')

    try {
      // POST to /api/bookings
      const res = await fetch(`${API}/bookings`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          unit_id: unitId,
          check_in: startDate,
          check_out: endDate,
          payment_method: 'visa',
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Booking failed.')
        setStep('payment')
        return
      }

      // Use booking_ref from response for the receipt
      setBookingRef(data.data?.booking_ref || data.data?.id || '—')
      setStep('success')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setStep('payment')
    }
  }

  const handleClose = () => {
    setStep('payment')
    setCardNumber('')
    setExpiry('')
    setCvv('')
    setName('')
    setBookingRef('')
    setError('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-800 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden relative border border-gray-100 dark:border-gray-700">

        {step !== 'processing' && (
          <button onClick={handleClose} className="absolute top-6 right-6 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors z-10">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        )}

        {/* STEP 1: Payment Form */}
        {step === 'payment' && (
          <div className="p-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-[#DAF1DE] flex items-center justify-center text-[#0B2B26]">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Payment Details</h2>
                <p className="text-sm text-gray-500">Pay securely with VISA</p>
              </div>
            </div>

            <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Room</span>
                <span className="font-semibold text-gray-900 dark:text-white">{unitTitle}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Check-in</span>
                <span className="font-medium text-gray-900 dark:text-white">{startDate}</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Check-out</span>
                <span className="font-medium text-gray-900 dark:text-white">{endDate}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                <span className="text-gray-500 font-bold">Total</span>
                <span className="font-bold text-[#235347] dark:text-[#DAF1DE]">${totalPrice}</span>
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4000 1234 5678 9010"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
                    required
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Expiry Date</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={expiry}
                    onChange={(e) => setExpiry(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">CVV</label>
                  <input
                    type="password"
                    placeholder="123"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value)}
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2 ml-1">Cardholder Name</label>
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#235347] transition"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-4 bg-[#0B2B26] text-[#DAF1DE] font-black rounded-2xl hover:bg-[#235347] transition-all uppercase tracking-widest text-sm"
              >
                Pay Now
              </button>
            </form>
          </div>
        )}

        {/* STEP 2: Processing */}
        {step === 'processing' && (
          <div className="p-12 text-center">
            <div className="inline-block w-16 h-16 border-4 border-[#DAF1DE] border-t-[#0B2B26] rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Processing...</h2>
            <p className="text-gray-500">Please wait while we confirm your booking</p>
          </div>
        )}

        {/* STEP 3: Success + Receipt */}
        {step === 'success' && (
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-500 mx-auto mb-4">
                <CheckCircle2 className="w-12 h-12" />
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">Booking Confirmed!</h2>
              <p className="text-gray-500 mt-2">Your receipt is ready below</p>
            </div>

            <div className="bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-6 border-2 border-dashed border-gray-200 dark:border-gray-700 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-[#0B2B26]"></div>

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-tighter text-gray-400">Receipt</h3>
                  <p className="text-xs text-gray-400">#{bookingRef}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Room</span>
                  <span className="font-medium text-gray-900 dark:text-white truncate max-w-[180px]">{unitTitle}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-in</span>
                  <span className="font-medium text-gray-900 dark:text-white">{startDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Check-out</span>
                  <span className="font-medium text-gray-900 dark:text-white">{endDate}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Payment</span>
                  <span className="font-medium text-gray-900 dark:text-white">VISA</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-900 dark:text-white">{new Date().toLocaleDateString()}</span>
                </div>
                <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <span className="font-black text-gray-900 dark:text-white uppercase tracking-wider">Total Paid</span>
                  <span className="text-2xl font-black text-[#0B2B26] dark:text-[#DAF1DE]">${totalPrice}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-8">
              <button
                onClick={() => window.print()}
                className="flex items-center justify-center gap-2 py-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-white font-bold rounded-2xl hover:bg-gray-200 transition-all uppercase tracking-widest text-xs"
              >
                <Printer className="w-4 h-4" /> Print
              </button>
              <button
                onClick={handleClose}
                className="flex items-center justify-center gap-2 py-4 bg-[#0B2B26] text-[#DAF1DE] font-bold rounded-2xl hover:bg-[#235347] transition-all uppercase tracking-widest text-xs"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}