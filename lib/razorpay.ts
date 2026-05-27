interface RazorpayOptions {
  key: string
  amount: number
  currency: string
  name: string
  description: string
  order_id: string
  prefill?: {
    name?: string
    email?: string
    contact?: string
  }
  handler: (response: any) => void
  modal?: {
    ondismiss?: () => void
    escape?: boolean
    backdropclose?: boolean
    animation?: boolean
  }
  theme?: {
    color?: string
    backdrop_color?: string
    hide_topbar?: boolean
  }
}

declare global {
  interface Window {
    Razorpay: any
  }
}

// Function to load Razorpay script
const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      console.log("Razorpay already loaded")
      resolve(true)
      return
    }

    console.log("Loading Razorpay script...")
    const script = document.createElement("script")
    script.src = "https://checkout.razorpay.com/v1/checkout.js"
    script.async = true
    script.onload = () => {
      console.log("Razorpay script loaded successfully")
      resolve(true)
    }
    script.onerror = () => {
      console.error("Failed to load Razorpay script")
      resolve(false)
    }
    document.body.appendChild(script)
  })
}

// Function to open Razorpay checkout
export const openRazorpayCheckout = async (options: RazorpayOptions): Promise<void> => {
  try {
    const scriptLoaded = await loadRazorpayScript()

    if (!scriptLoaded) {
      throw new Error("Failed to load Razorpay checkout script")
    }

    // Log only non-sensitive information
    console.log("Initializing Razorpay with options:", {
      key: options.key ? "Key provided" : "No key provided",
      amount: options.amount,
      currency: options.currency,
      name: options.name,
      order_id: options.order_id ? "Order ID provided" : "No order ID provided",
    })

    if (!window.Razorpay) {
      throw new Error("Razorpay not available. Script may have failed to load properly.")
    }

    // Validate required fields
    if (!options.key) throw new Error("Razorpay key is required")
    if (!options.order_id) throw new Error("Razorpay order_id is required")
    if (!options.amount) throw new Error("Amount is required")

    const razorpay = new window.Razorpay(options)
    razorpay.open()
  } catch (error: any) {
    console.error("Error opening Razorpay checkout:", error)
    throw error
  }
}
