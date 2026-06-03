import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { unit_id, check_in_date, check_out_date, total_price, payment_method } = body;

    // 1. Core input parameter validation
    if (!unit_id || !check_in_date || !check_out_date || !total_price) {
      return NextResponse.json({ success: false, message: "Missing tracking data parameters." }, { status: 400 });
    }

    // 2. Mocking relational Database row writes matching your schema mapping
    
    // Inserts tuple to [Booking Table]: booking_id, user_id, unit_id, status_id, check_in_date...
    const mockNewBookingId = Math.floor(1000 + Math.random() * 9000); 
    const mockBookingRecord = {
      booking_id: mockNewBookingId,
      user_id: 99, // Authenticated context fallback
      unit_id: parseInt(unit_id),
      status_id: 2, // e.g., 2 = 'Paid & Confirmed'
      check_in_date: check_in_date,
      check_out_date: check_out_date,
      total_price: parseFloat(total_price),
    };

    // Inserts tuple to [Payment Table]: payment_id, booking_id, payment_method, payment_status
    const mockPaymentRecord = {
      payment_id: Math.floor(50000 + Math.random() * 50000),
      booking_id: mockNewBookingId,
      payment_method: payment_method || "Visa",
      payment_status: "Completed", // Immediate completion for upfront visa transactions
      payment_date: new Date().toISOString().slice(0, 10)
    };

    // Console confirmation to review structural mapping during testing
    console.log("-> Relational Data Insertion Simulated Successfully:");
    console.log("DB::Booking Table Entry: ", mockBookingRecord);
    console.log("DB::Payment Table Entry: ", mockPaymentRecord);

    return NextResponse.json({
      success: true,
      message: "Upfront validation verified, records instantiated.",
      booking: mockBookingRecord,
      payment: mockPaymentRecord
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}