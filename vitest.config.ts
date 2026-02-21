import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    include: ["**/*.{test,spec,itest}.?(c|m)[jt]s?(x)"],
  },
});
