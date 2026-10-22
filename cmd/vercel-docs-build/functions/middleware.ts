import { next } from '@vercel/functions'
import { proxyEvent } from './pls-api'
import { proxyScript } from './pls-script'

// Routing Middleware for the docs site, running on the Node.js runtime
// Vercel deploys middleware to every region, so the Plausible proxy runs close to the visitor instead of only in the project's function region
// The builder routes only the Plausible paths here, so no other request invokes it
export default async function middleware(request: Request): Promise<Response> {
  const { pathname } = new URL(request.url)

  // Proxy the event API (/pls/api and anything below it)
  if (pathname == '/pls/api' || pathname.startsWith('/pls/api/')) {
    return proxyEvent(request)
  }

  // Proxy the script (/pls/index.js and /pls/index.[random].js)
  if (pathname.startsWith('/pls/index')) {
    return proxyScript()
  }

  // Let anything else continue through the deployment's routes
  return next()
}
