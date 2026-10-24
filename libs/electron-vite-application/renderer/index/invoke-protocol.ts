import Producer from "../invoke-protocol"

export default new Producer()
    .register(({ route, zod }) => route(
        'xxx1',
        zod.custom<string>(),
        ctx =>typeof ctx,
    ))