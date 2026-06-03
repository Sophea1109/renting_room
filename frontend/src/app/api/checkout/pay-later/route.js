import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    const { unit_id, check_in_date, check_out_date, total_price, payment_method } = body;

    // Parameter checks
    if (!unit_id || !check_in_date || !check_out_date || !total_price) {
      return NextResponse.json({ success: false, message: "Missing reservation details." }, { status: 400 });
    }

    const mockNewBookingId = Math.floor(2000 + Math.random() * 8000);

    // Mapped straight to your [Booking Table] schema specifications
    const mockBookingRecord = {
      booking_id: mockNewBookingId,
      user_id: 99, // Active customer id
      unit_id: parseInt(unit_id),
      status_id: 1, // status_id: 1 = 'Reserved / Awaiting On-Site Payment'
      check_in_date: check_in_date,
      check_out_date: check_out_date,
      total_price: parseFloat(total_price),
    };

    // Mapped straight to your [Payment Table] schema specifications
    const mockPaymentRecord = {
      payment_id: Math.floor(10000 + Math.random() * 40000),
      booking_id: mockNewBookingId,
      payment_method: payment_method || "Cash", // Cash at Counter selection
      payment_status: "Unpaid", // Stays Unpaid until owner accepts cash physically
      payment_date: null // Empty because transaction hasn't happened yet
    };

    // Console logs to track how fields map to your Draw.io schema rows
    console.log("-> Pay Later Relational Records Placed Successfully:");
    console.log("DB::Booking Table Entry Saved: ", mockBookingRecord);
    console.log("DB::Payment Table Entry Saved: ", mockPaymentRecord);

    return NextResponse.json({
      success: true,
      message: "Cash reservation established.",
      booking: mockBookingRecord,
      payment: mockPaymentRecord
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}