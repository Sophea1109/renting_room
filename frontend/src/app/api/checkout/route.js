import { NextResponse } from "next/server";

// Simulating database models based on your Draw.io Schema
// In production, you would import Prisma, Mongoose, or use Eloquent models in Laravel
export async function POST(request) {
  try {
    const body = await request.json();
    const { 
      unit_id, 
      check_in_date, 
      check_out_date, 
      total_price, 
      payment_method // "Visa" or "Cash"
    } = body;

    // 1. Core Input Validation
    if (!unit_id || !check_in_date || !check_out_date || !total_price || !payment_method) {
      return NextResponse.json({ 
        success: false, 
        message: "Missing mandatory booking or payment fields." 
      }, { status: 400 });
    }

    // Generate unique structural IDs
    const mockBookingId = Math.floor(3000 + Math.random() * 7000);
    const mockPaymentId = Math.floor(60000 + Math.random() * 40000);

    // 2. Conditional State Processing Strategy
    let bookingStatusId; // From your Schema: Tracks reservation steps
    let initialPaymentStatus; // From your Schema: Tracks transaction clearance

    if (payment_method.toLowerCase() === "visa") {
      // --- USE CASE: Process Pay First (Visa) ---
      // Payment happens instantly, so the booking is automatically verified and finalized.
      bookingStatusId = 2; // e.g., 2 = 'Paid & Confirmed'
      initialPaymentStatus = "Completed"; 
    } else if (payment_method.toLowerCase() === "cash") {
      // --- USE CASE: Confirm Pay Later (Cash) ---
      // The slot is reserved ("Booking First"), but transaction clears on arrival.
      bookingStatusId = 1; // e.g., 1 = 'Pending / Reserved On-Site'
      initialPaymentStatus = "Unpaid";
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid payment methodology selected." 
      }, { status: 422 });
    }

    // 3. Simulated Relational Mapping Records
    
    // DB Entry targeting your [Booking Table] fields
    const bookingRecord = {
      booking_id: mockBookingId,
      user_id: 102, // Inferred from active session/token authentication
      unit_id: parseInt(unit_id),
      status_id: bookingStatusId, 
      check_in_date: check_in_date,
      check_out_date: check_out_date,
      total_price: parseFloat(total_price),
    };

    // DB Entry targeting your [Payment Table] fields
    const paymentRecord = {
      payment_id: mockPaymentId,
      booking_id: mockBookingId,
      payment_method: payment_method, // "Visa" or "Cash"
      payment_status: initialPaymentStatus, // "Completed" or "Unpaid"
      payment_date: initialPaymentStatus === "Completed" ? new Date().toISOString().slice(0, 10) : null
    };

    // 4. Log Execution Steps to Terminal Console
    console.log("\n================ BACKEND TRANSACTION REGISTERED ================");
    console.log(`Payment Protocol: [${payment_method.toUpperCase()}]`);
    console.log("Written to DB::Booking Table ->", bookingRecord);
    console.log("Written to DB::Payment Table ->", paymentRecord);
    console.log("================================================================\n");

    // 5. Unified System Return payload
    return NextResponse.json({
      success: true,
      message: payment_method.toLowerCase() === "visa" 
        ? "Visa processing approved. Upfront booking established." 
        : "Booking placed first successfully! Cash pending check-in.",
      data: {
        booking: bookingRecord,
        payment: paymentRecord
      }
    }, { status: 201 });

  } catch (error) {
    console.error("Backend checkout crash:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Internal server runtime execution error." 
    }, { status: 500 });
  }
}