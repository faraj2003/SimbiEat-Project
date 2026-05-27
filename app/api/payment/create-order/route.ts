import { NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import Razorpay from "razorpay"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      console.error("Authentication failed: No session or user")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const { amount } = await request.json()

    if (!amount || amount <= 0) {
      console.error("Invalid amount provided:", amount)
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 })
    }

    // Check if Razorpay keys are available
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_SECRET) {
      console.error("Razorpay keys not found in environment variables")
      return NextResponse.json({ error: "Payment gateway configuration missing" }, { status: 500 })
    }

    console.log("Initializing Razorpay with key ID:", process.env.RAZORPAY_KEY_ID)

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    })

    // Create order with proper error handling
    try {
      // Convert amount to paise (Razorpay requires amount in smallest currency unit)
      const amountInPaise = Math.round(amount * 100)
      console.log("Creating Razorpay order for amount:", amount, "Amount in paise:", amountInPaise)

      // Create a receipt ID
      const receiptId = `receipt_${Date.now()}_${Math.floor(Math.random() * 1000)}`

      // Create order with minimal required fields
      const orderOptions = {
        amount: amountInPaise,
        currency: "INR",
        receipt: receiptId,
        // Removing notes and other optional fields that might cause issues
      }

      console.log("Sending order creation request with options:", JSON.stringify(orderOptions))

      const order = await razorpay.orders.create(orderOptions)

      console.log("Razorpay order created successfully:", order)

      return NextResponse.json({
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      })
    } catch (razorpayError: any) {
      // Type assertion for better error handling
      console.error("Razorpay API error:", razorpayError)

      // Extract more detailed error information if available
      const errorDetails =
        razorpayError.error?.description ||
        razorpayError.description ||
        (typeof razorpayError.message === "string" ? razorpayError.message : "Unknown Razorpay error")

      return NextResponse.json(
        {
          error: "Razorpay order creation failed",
          details: errorDetails,
          code: razorpayError.statusCode || 500,
        },
        { status: 500 },
      )
    }
  } catch (error: any) {
    // Type assertion for error
    console.error("Error creating Razorpay order:", error)
    return NextResponse.json(
      {
        error: "Failed to create payment order",
        details: typeof error.message === "string" ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
