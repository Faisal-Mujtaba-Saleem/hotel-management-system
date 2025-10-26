const config = {
    // CLient-side variables (NEXT_PUBLIC_*)
    apiBaseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api",
    clerkPublishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "",

    // Server-side variables
    mongodb_uri: process.env.MONGODB_URI || null,
    smtp_host: process.env.SMTP_HOST || "smtp.gmail.com",
    smtp_port: process.env.SMTP_PORT || 465,
    email_user: process.env.EMAIL_USER || "",
    email_pass: process.env.EMAIL_PASS || ""
}

export default config;