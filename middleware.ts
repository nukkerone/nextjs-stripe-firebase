export { default } from "next-auth/middleware"

export const config = { matcher: ["/restricted", "/plan/basic"] }
