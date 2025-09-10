export function CourseStyles() {
    return (
        <style jsx global>{`
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .course-content {
                box-sizing: border-box;
                max-width: 100%;
            }
            html,
            body {
                max-width: 100vw;
            }
            /* Prevent only main content navigation from overflowing, not sidebar */
            .course-content nav,
            .course-content .nav,
            .course-content [role="navigation"]:not([data-sidebar]) {
                max-width: 100%;
                overflow-x: hidden;
            }
            /* Ensure buttons in course content don't overflow */
            .course-content button,
            .course-content .btn {
                max-width: 100%;
                word-break: break-word;
            }
            /* Preserve sidebar icons */
            [data-sidebar] svg,
            [data-sidebar] [data-lucide] {
                flex-shrink: 0;
                display: inline-block !important;
            }
        `}</style>
    );
}
