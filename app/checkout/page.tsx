"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useCart } from "@/components/cart/cart-provider"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import ClientLayout from "@/components/client-layout"
import { openRazorpayCheckout } from "@/lib/razorpay"

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const { data: session, status } = useSession()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [orderId, setOrderId] = useState("")
  const [paymentProcessing, setPaymentProcessing] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login?callbackUrl=/checkout")
    }
  }, [status, router])

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push("/")
    }
  }, [items, router, success])

  // Debug log for Razorpay key
  useEffect(() => {
    console.log("NEXT_PUBLIC_RAZORPAY_KEY_ID available:", !!process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID)
  }, [])

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsSubmitting(true)

    try {
      console.log("Creating Razorpay order...")

      // STEP 1: Create a Razorpay order first
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalPrice,
        }),
      })

      const responseData = await orderResponse.json()

      if (!orderResponse.ok) {
        console.error("Failed to create Razorpay order:", responseData)
        throw new Error(responseData.error || responseData.details || "Failed to create payment order")
      }

      console.log("Razorpay order created successfully:", responseData)
      setPaymentProcessing(true)

      // Get the key from environment variable or use a fallback for testing
      const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || "rzp_test_8N1lRFVr383MVi"
      console.log("Using Razorpay key:", razorpayKeyId)

      // STEP 2: Open Razorpay checkout
      await openRazorpayCheckout({
        key: razorpayKeyId,
        amount: responseData.amount,
        currency: responseData.currency,
        name: "SimbiEat",
        description: "Food Order Payment",
        order_id: responseData.id,
        prefill: {
          name: session?.user?.name || "",
          email: session?.user?.email || "",
        },
        handler: async (response) => {
          try {
            console.log("Payment successful, verifying payment:", response)

            // STEP 3: Verify the payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            })

            const verifyData = await verifyResponse.json()

            if (!verifyResponse.ok) {
              console.error("Payment verification failed:", verifyData)
              throw new Error(verifyData.error || "Payment verification failed")
            }

            console.log("Payment verified, creating order in database...")

            // STEP 4: Create the order in your database
            const orderCreateResponse = await fetch("/api/orders", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                items: items.map((item) => ({
                  foodItem: item._id,
                  quantity: item.quantity,
                  price: item.price,
                  specialInstructions: item.specialInstructions || null,
                })),
                total: totalPrice,
                paymentId: response.razorpay_payment_id,
                paymentOrderId: response.razorpay_order_id,
              }),
            })

            const orderResult = await orderCreateResponse.json()

            if (!orderCreateResponse.ok) {
              console.error("Order creation error:", orderResult)
              throw new Error(orderResult.error || "Failed to place order")
            }

            console.log("Order created successfully:", orderResult)
            setSuccess(true)
            setOrderId(orderResult.orderId || orderResult.order?.orderNumber)
            clearCart()
          } catch (error: any) {
            console.error("Order creation error:", error)
            // Fix for TypeScript error - use type assertion
            setError(typeof error.message === "string" ? error.message : "Failed to complete order after payment")
          } finally {
            setPaymentProcessing(false)
            setIsSubmitting(false)
          }
        },
        modal: {
          ondismiss: () => {
            console.log("Payment modal dismissed")
            setPaymentProcessing(false)
            setIsSubmitting(false)
            setError("Payment was cancelled. Please try again.")
          },
        },
        theme: {
          color: "#3B82F6",
        },
      })
    } catch (error: any) {
      console.error("Checkout error:", error)
      // Fix for TypeScript error - use type assertion
      setError(typeof error.message === "string" ? error.message : "An error occurred during checkout")
      setPaymentProcessing(false)
      setIsSubmitting(false)
    }
  }

  if (status === "loading") {
    return (
      <ClientLayout>
        <div className="container mx-auto flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      </ClientLayout>
    )
  }

  if (success) {
    return (
      <ClientLayout>
        <div className="container mx-auto py-8">
          <Card className="mx-auto max-w-md">
            <CardHeader>
              <div className="flex items-center justify-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" />
                <CardTitle>Order Placed Successfully!</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center">Thank you for your order. Your order ID is:</p>
              <p className="text-center text-lg font-bold">{orderId}</p>
              <p className="text-center text-sm text-muted-foreground">
                You can track your order status in the My Orders section.
              </p>
              <div className="rounded-lg bg-amber-50 p-4 text-amber-800">
                <p className="text-center font-medium">Please collect your order from the canteen counter.</p>
                <p className="text-center text-sm">Your order will be ready for pickup shortly.</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/orders")}>View My Orders</Button>
            </CardFooter>
          </Card>
        </div>
      </ClientLayout>
    )
  }

  return (
    <ClientLayout>
      <div className="container mx-auto py-8">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Order Summary */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Order Summary</h2>
            <Card>
              <CardContent className="pt-6">
                <ul className="divide-y">
                  {items.map((item) => (
                    <li key={item._id} className="py-3">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">
                            {item.name} x {item.quantity}
                          </p>
                          {item.specialInstructions && (
                            <p className="text-xs italic text-gray-500">Note: {item.specialInstructions}</p>
                          )}
                        </div>
                        <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 border-t pt-4">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Form */}
          <div>
            <h2 className="mb-4 text-2xl font-bold">Complete Your Order</h2>
            <Card>
              <form onSubmit={handlePayment}>
                <CardContent className="space-y-4 pt-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  <div className="rounded-lg bg-blue-50 p-4 text-blue-800">
                    <h3 className="font-medium">Pickup Information</h3>
                    <p className="text-sm mt-1">
                      Your order will be available for pickup at the canteen counter. Please show your order
                      confirmation to collect your food.
                    </p>
                  </div>
                </CardContent>

                <CardFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || items.length === 0 || paymentProcessing}
                  >
                    {isSubmitting ? (
                      "Processing..."
                    ) : (
                      <>
                        <CreditCard className="mr-2 h-4 w-4" />
                        Pay ₹{totalPrice.toFixed(2)}
                      </>
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </ClientLayout>
  )
}
