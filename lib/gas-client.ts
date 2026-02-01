const GAS_SCRIPT_URL = process.env.NEXT_PUBLIC_GAS_SCRIPT_URL || ""

export interface GASResponse<T = any> {
  success: boolean
  data?: T
  error?: string
}

export async function callGASEndpoint<T = any>(
  action: string,
  payload: Record<string, any> = {},
): Promise<GASResponse<T>> {
  try {
    const response = await fetch(GAS_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        action,
        ...payload,
      }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const result = await response.json()
    return result
  } catch (error) {
    console.error("[v0] GAS API Error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    }
  }
}
