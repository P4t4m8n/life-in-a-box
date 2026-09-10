"use server"

import { createHash } from "crypto"

// --- Auth ---
import { requireAdmin } from "@/lib/auth"

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/webp", "image/gif"])

// signs only `timestamp` (Cloudinary's documented minimal signed-upload payload)
export async function uploadImageToCloudinary(
  formData: FormData
): Promise<{ url: string }> {
  await requireAdmin()

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary is not configured. Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env"
    )
  }

  const file = formData.get("file")
  if (!(file instanceof File)) {
    throw new Error("No file provided")
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    throw new Error("Unsupported file type")
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File too large")
  }

  const timestamp = Math.floor(Date.now() / 1000)
  const signature = createHash("sha1")
    .update(`timestamp=${timestamp}${apiSecret}`)
    .digest("hex")

  const uploadForm = new FormData()
  uploadForm.append("file", file)
  uploadForm.append("api_key", apiKey)
  uploadForm.append("timestamp", String(timestamp))
  uploadForm.append("signature", signature)

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: uploadForm }
  )

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Cloudinary upload failed: ${text}`)
  }

  const data = await res.json()
  return { url: data.secure_url as string }
}
