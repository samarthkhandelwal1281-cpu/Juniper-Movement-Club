import { index, route, type RouteConfig } from "@react-router/dev/routes";

export default [index("routes/home.tsx"), route("studio-admin", "routes/admin.tsx")] satisfies RouteConfig;
