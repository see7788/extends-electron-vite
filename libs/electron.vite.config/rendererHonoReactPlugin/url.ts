declare const __HONO_ORIGIN__: string;

export default function rendererHonoUrl<Name extends string>(name: Name): string {
  return new URL(`/${name}/`, __HONO_ORIGIN__).toString();
}
