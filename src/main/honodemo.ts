import { Hono } from 'hono'
import { proxy } from 'hono/proxy'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import packageJson from '../../package.json' with { type: 'json' }
import { AddressInfo } from 'node:net'

export const app = new Hono()
app.get("/test", ctx => ctx.html("test"))
export default (): Promise<string | void> => {
    const { host, port } = packageJson.config
    if (process.env.ELECTRON_RENDERER_URL) {
        app.all("/renderer/*", c => {
            const path = c.req.path.replace(/^\/renderer/, "")
            return proxy(`${process.env.ELECTRON_RENDERER_URL}${path}`)
        })
        app.all("/@*",
            c => proxy(
                `${process.env.ELECTRON_RENDERER_URL}${c.req.path}`
            )
        )

        app.all("/src/*",
            c => proxy(`${process.env.ELECTRON_RENDERER_URL}${c.req.path}`)
        )

        app.all("/assets/*",
            c => proxy(`${process.env.ELECTRON_RENDERER_URL}${c.req.path}`)
        )
    } else {
        app.use("*", serveStatic({ root: "./out/renderer" }))
    }

    app.notFound(c => c.text("hono Not Found", 404))
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
