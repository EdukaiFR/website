import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
    plugins: [react()],
    test: {
        environment: "jsdom",
        globals: true,
        setupFiles: ["./tests/setup.ts"],
        include: ["**/*.test.{ts,tsx}"],
        exclude: ["**/node_modules/**", "**/e2e/**"],
        coverage: {
            provider: "v8",
            reporter: ["text", "json", "html", "json-summary"],
            exclude: [
                "node_modules/",
                "tests/",
                "**/*.d.ts",
                "**/*.config.*",
                "**/types/**",
                "components/ui/**",
                "app/**/layout.tsx",
                "app/**/loading.tsx",
                "app/**/error.tsx",
                "lib/summary-sheets/**",
                "agent-os/**",
                ".next/**",
            ],
        },
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./"),
        },
    },
});
