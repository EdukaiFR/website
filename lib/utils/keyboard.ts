/**
 * Handler for keyboard events to make clickable divs accessible
 * Triggers the callback when Enter or Space is pressed
 */
export function handleKeyboardClick(
    event: React.KeyboardEvent,
    callback: () => void
) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        callback();
    }
}

/**
 * Props to add keyboard accessibility to clickable elements
 */
export function makeKeyboardAccessible(onClick: () => void) {
    return {
        role: "button" as const,
        tabIndex: 0,
        onKeyDown: (e: React.KeyboardEvent) => handleKeyboardClick(e, onClick),
    };
}
