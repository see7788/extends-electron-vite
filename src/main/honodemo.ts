import { Hono, Handler } from 'hono'
import { proxy } from 'hono/proxy'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import packageJson from '../../package.json' with { type: 'json' }
import { AddressInfo } from 'node:net'

export const app = new Hono()
app.get("/test", ctx => ctx.html("test"))
export default (): Promise<string> => {
    const { host, port } = packageJson.config
    if (process.env.ELECTRON_RENDERER_URL) {
        app.all("*", ctx => {
            const url = `${process.env.ELECTRON_RENDERER_URL}${ctx.req.path}`
            return proxy(url)
        })
    } else {
        app.use(
            "*",
            serveStatic({
                root: "./out/renderer"
            })
        )
    }
    app.notFound(c => c.text("hono Not Found", 404))
    return new Promise((resolve, reject) => {
        const server = serve(
            { fetch: app.fetch, port, hostname: host },
            (info: AddressInfo) => {
                resolve(`http://${host}:${String(info.port)}/#/testrouter`)
            }
        )
        server.on('error', reject)
    })
}
