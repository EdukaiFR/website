# Testing

## Architecture

```
tests/
├── setup.ts                          # Global mocks (router, EventSource, ResizeObserver)
├── factories/                        # Test data builders (buildUser, buildQuiz, ...)
├── mocks/                            # Shared mock helpers (session, router, axios)
├── unit/
│   ├── lib/                          # Pure functions (no React)
│   ├── hooks/                        # Hooks via renderHook()
│   └── components/                   # Components via render() + userEvent
└── e2e/                              # Playwright browser tests
```

## Unit Tests (Vitest)

### Pure functions

Test direct input/output, no React needed.

```ts
import { shuffleQuiz } from "@/lib/utils/quiz";

it("preserves the correct answer after shuffle", () => {
    const [shuffled] = shuffleQuiz([question]);
    expect(shuffled.answer).toContain("Paris");
});
```

Reference: `tests/unit/lib/quiz.test.ts`

### Hooks

Use `renderHook` from `@testing-library/react`.

```ts
import { renderHook, act } from "@testing-library/react";

const { result } = renderHook(() => useQuizPlayer({ quizData }));

act(() => {
    result.current.setSelectedAnswer("B) 4");
});

expect(result.current.score).toBe(1);
```

Reference: `tests/unit/hooks/useQuizPlayer.test.ts`

### Components (RTL)

Use `render`, `screen`, `userEvent.setup()`, and `waitFor` for async updates.

```tsx
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const user = userEvent.setup();

render(<SigninForm onSuccess={onSuccess} />);

await user.type(screen.getByPlaceholderText("ton.email@exemple.com"), "test@example.com");
await user.click(screen.getByRole("button", { name: /se connecter/i }));

await waitFor(() => {
    expect(onSuccess).toHaveBeenCalled();
});
```

Mock external hooks at the top of the file:

```ts
vi.mock("@/hooks/useSession", () => ({
    useSession: () => ({ login: mockLogin, user: null, loading: false }),
}));
```

Reference: `tests/unit/components/auth/SigninForm.test.tsx`

## E2E Tests (Playwright)

Browser tests against the running app. Use accessible selectors (`getByRole`, `getByPlaceholder`).

```ts
import { test, expect } from "@playwright/test";

test("should redirect unauthenticated users", async ({ page }) => {
    await page.goto("/library");
    await expect(page).toHaveURL(/auth/);
});
```

Reference: `tests/e2e/auth.spec.ts`

## Commands

| Command | Description |
|---|---|
| `pnpm test` | Run unit tests (watch mode) |
| `pnpm test:ci` | Run unit tests once + coverage |
| `pnpm test:e2e` | Run Playwright E2E tests |
| `pnpm test:e2e:headed` | Run E2E tests with visible browser |

## CI/CD

Configured in `.github/workflows/test.yml`:

- **Every push**: unit tests + E2E tests
- **PRs only**: coverage report posted as comment
