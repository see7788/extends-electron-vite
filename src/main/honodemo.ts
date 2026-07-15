import { Hono } from 'hono'
import { proxy } from 'hono/proxy'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import packageJson from '../../package.json' with { type: 'json' }
import { AddressInfo } from 'node:net'

export const app = new Hono()
if (process.env.ELECTRON_RENDERER_URL) {
    app.all("/renderer/*", c => proxy(process.env.ELECTRON_RENDERER_URL + c.req.path))
} else {
    app.use("/renderer/*", serveStatic({ root: "./out/renderer" }))
}
app.get("/test", ctx => ctx.html("test"))
app.get("*", ctx => ctx.html("index"))
export default (): Promise<string | void> => {
    const { host, port } = packageJson.config
    return new Promise((resolve, reject) => {
        const server = serve(
            { fetch: app.fetch, port, hostname: host },
            (info: AddressInfo) => {
                resolve(`http://${host}:${String(info.port)}`)
            }
        )
        server.on('error', reject)
    })
}
