import { Hono } from 'hono'
import { proxy } from 'hono/proxy'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import packageJson from "config"
export const app = new Hono()
app.notFound(c => c.text("hono Not Found", 404))
export default (): Promise<string> => {
    const { host, port } = packageJson
    const rendererUrl = process.env.ELECTRON_RENDERER_URL
    if (rendererUrl) {
        app.all('*', (c) => {
            const target = new URL(c.req.path, rendererUrl)
            target.search = new URL(c.req.url).search
            return proxy(target.toString(), {
                raw: c.req.raw,
            })
        })
    } else {
        app.use(
            "*",
            serveStatic({
                root: "./out/renderer"
            })
        )
    }
    return new Promise((resolve, reject) => {
        const server = serve(
            { fetch: app.fetch, port, hostname: host },
            (info) => {
                resolve(`http://${host}:${String(info.port)}/#/testrouter`)
            }
        )
        server.on('error', reject)
    })
}
