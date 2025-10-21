/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { CounterBadge } from "@/components/badge/CounterBadge";
import { DataTable } from "@/components/data-table";
import {
    columns,
    CourseGrid,
    FilterCourses,
    LibraryHeader,
    SearchBar,
    ViewToggle,
} from "@/components/library";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useCourse } from "@/hooks";
import { useSessionStorage } from "@/hooks/useSessionStorage";
import { useCourseService } from "@/services";
import { RotateCcw } from "lucide-react";
import { useEffect, useState } from "react";

// Define the extended course type for the table
interface ExtendedCourseData {
    _id?: string;
    id: string;
    title: string;
    subject: string;
    level: string;
    author: string;
    isPublished: boolean;
    createdAt: string;
    quizzes: string[];
    exams: string[];
    summarySheets: unknown[];
}

// Type for API response that might have different property names
type ApiCourseData = {
    _id?: string;
    id?: string;
    title: string;
    subject: string;
    level: string;
    author?: string;
    isPublished?: boolean;
    createdAt?: string;
    quizzes: string[];
    exams: string[];
    summarySheets: unknown[];
};

export default function LibraryPage() {
    // Basic Data
    const courseService = useCourseService();
    const { coursesData, loadAllCourses } = useCourse(courseService);
    const [userCourses, setUserCourses] = useState<ExtendedCourseData[]>([]);

    const { storageUserId } = useSessionStorage();

    // View State - Load from localStorage or default to 'grid'
    const [view, setView] = useState<"grid" | "table">(() => {
        if (typeof window !== "undefined") {
            return (
                (localStorage.getItem("library-view") as "grid" | "table") ||
                "grid"
            );
        }
        return "grid";
    });

    // Save view preference to localStorage
    const handleViewChange = (newView: "grid" | "table") => {
        setView(newView);
        if (typeof window !== "undefined") {
            localStorage.setItem("library-view", newView);
        }
    };

    // Courses Filter
    const [coursesFilter, setCoursesFilter] = useState<{
        subjects: string[];
        levels: string[];
        titles: string[];
    }>({
        subjects: [],
        levels: [],
        titles: [],
    });
    const [filteredCourses, setFilteredCourses] = useState<
        ExtendedCourseData[]
    >([]);
    const [isFilterOpen, setFilterOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<{
        type: "" | "title" | "subject" | "level";
        value: string;
    }>({
        type: "",
        value: "",
    });
    // Courses Search Bar
    const [search, setSearch] = useState<string>("");

    const applyCourseFilter = (
        courses: ExtendedCourseData[],
        filter: { type: "title" | "subject" | "level" | ""; value: string },
        search: string
    ): ExtendedCourseData[] => {
        // Safety check: ensure courses is an array
        if (!courses || !Array.isArray(courses)) {
            return [];
        }

        let result = [...courses];

        // Filtrage par filtre sélectionné (subject, level, title)
        if (filter.type && filter.value) {
            result = result.filter(course => {
                if (filter.type === "title")
                    return course.title
                        ?.toLowerCase()
                        ?.includes(filter.value.toLowerCase());
                if (filter.type === "subject")
                    return course.subject
                        ?.toLowerCase()
                        ?.includes(filter.value.toLowerCase());
                if (filter.type === "level")
                    return course.level
                        ?.toLowerCase()
                        ?.includes(filter.value.toLowerCase());
                return false;
            });
        }

        // Filtrage par recherche libre (sur plusieurs champs si besoin)
        if (search) {
            const loweredSearch = search.toLowerCase();
            result = result.filter(
                course =>
                    course.title?.toLowerCase()?.includes(loweredSearch) ||
                    course.subject?.toLowerCase()?.includes(loweredSearch) ||
                    course.level?.toLowerCase()?.includes(loweredSearch)
            );
        }

        return result;
    };

    const getFilterFromCourses = () => {
        const subjects = new Set<string>();
        const levels = new Set<string>();
        const titles = new Set<string>();

        // Safety check: ensure coursesData is an array
        if (coursesData && Array.isArray(coursesData)) {
            coursesData.forEach(course => {
                if (course?.subject) subjects.add(course.subject);
                if (course?.level) levels.add(course.level);
                if (course?.title) titles.add(course.title);
            });
        }

        return {
            subjects: Array.from(subjects),
            levels: Array.from(levels),
            titles: Array.from(titles),
        };
    };

    useEffect(() => {
        if (coursesData && coursesData.length > 0) {
            const { subjects, levels, titles } = getFilterFromCourses();
            setCoursesFilter({ subjects, levels, titles });
        }
    }, [coursesData]);

    useEffect(() => {
        const fetchCourses = async () => {
            const response = await loadAllCourses();

            // Check if response is null or not an array
            if (response && Array.isArray(response)) {
                const extendedCourses: ExtendedCourseData[] = response.map(
                    (course: ApiCourseData) => ({
                        ...course,
                        id: course._id || course.id || "",
                        author: course.author || "Unknown",
                        isPublished: course.isPublished || false,
                        createdAt: course.createdAt || new Date().toISOString(),
                    })
                );
                setUserCourses(extendedCourses);
            } else {
                // If response is null or not an array, set empty array
                console.warn(
                    "Failed to load courses or received invalid response"
                );
                setUserCourses([]);
            }
        };

        fetchCourses();
    }, []);

    useEffect(() => {
        const result = applyCourseFilter(userCourses, filter, search).map(
            course => ({
                ...course,
                author:
                    storageUserId === course.author ? "Vous" : course.author,
            })
        );

        setFilteredCourses(result);
    }, [userCourses, filter, search]);

    if (!coursesData) {
        return (
            <div className="flex items-center justify-center w-full h-full min-h-[60vh]">
                <div className="flex flex-col items-center gap-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    <p className="text-muted-foreground">
                        Chargement de vos cours...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 lg:gap-6 px-3 sm:px-4 lg:px-8 py-4 lg:py-6 min-h-[calc(100vh-5rem)] w-full max-w-full overflow-hidden bg-gradient-to-br from-slate-50/50 via-blue-50/30 to-indigo-50/50">
            {/* Header */}
            <LibraryHeader />

            {/* Filters and Search */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm">
                <CardContent className="p-4 lg:p-6">
                    {/* Mobile Layout (2 rows) */}
                    <div className="flex flex-col gap-4 lg:hidden">
                        {/* First Row: Filters, Counter, and View Toggle */}
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                                <FilterCourses
                                    coursesFilter={coursesFilter}
                                    activeFilter={filter}
                                    setActiveFilter={setFilter}
                                    isFilterOpen={isFilterOpen}
                                    setFilterOpen={setFilterOpen}
                                />

                                {filter.type && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 flex-shrink-0"
                                        onClick={() =>
                                            setFilter({ type: "", value: "" })
                                        }
                                    >
                                        <RotateCcw className="w-4 h-4 mr-2" />
                                        <span className="hidden sm:inline">Réinitialiser</span>
                                        <span className="sm:hidden">Reset</span>
                                    </Button>
                                )}

                                <CounterBadge
                                    counter={filteredCourses.length}
                                    type={"cours"}
                                    size="sm"
                                />
                            </div>

                            <div className="flex items-center flex-shrink-0">
                                <ViewToggle
                                    view={view}
                                    onViewChange={handleViewChange}
                                />
                            </div>
                        </div>

                        {/* Second Row: Search Bar (Full Width on Mobile) */}
                        <div className="w-full">
                            <div className="w-full sm:max-w-md">
                                <SearchBar setSearch={setSearch} />
                            </div>
                        </div>
                    </div>

                    {/* Desktop Layout (1 row) */}
                    <div className="hidden lg:flex items-center justify-between gap-2 lg:gap-3 xl:gap-6">
                        {/* Left: Search Bar + Filters Group */}
                        <div className="flex items-center gap-2 lg:gap-3 xl:gap-4 flex-1 min-w-0">
                            {/* Search Bar */}
                            <div className="w-56 lg:w-60 xl:w-80 2xl:w-96 flex-shrink-0">
                                <SearchBar setSearch={setSearch} />
                            </div>

                            {/* Filters and Counter */}
                            <div className="flex items-center gap-1 lg:gap-2 xl:gap-3 flex-wrap min-w-0">
                                <FilterCourses
                                    coursesFilter={coursesFilter}
                                    activeFilter={filter}
                                    setActiveFilter={setFilter}
                                    isFilterOpen={isFilterOpen}
                                    setFilterOpen={setFilterOpen}
                                />

                                {filter.type && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="text-red-500 border-red-200 hover:bg-red-50 hover:border-red-300 flex-shrink-0 px-2 lg:px-3"
                                        onClick={() =>
                                            setFilter({ type: "", value: "" })
                                        }
                                    >
                                        <RotateCcw className="w-4 h-4 lg:mr-2" />
                                        <span className="hidden lg:inline xl:inline">Réinitialiser</span>
                                    </Button>
                                )}

                                <CounterBadge
                                    counter={filteredCourses.length}
                                    type={"cours"}
                                    size="sm"
                                />
                            </div>
                        </div>

                        {/* Right: View Toggle */}
                        <div className="flex-shrink-0">
                            <ViewToggle
                                view={view}
                                onViewChange={handleViewChange}
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Content */}
            <Card className="border-0 shadow-lg bg-white/70 backdrop-blur-sm flex-1">
                <CardContent className="p-4 lg:p-6">
                    <div className="w-full max-w-full overflow-hidden">
                        {view === "grid" ? (
                            <CourseGrid
                                courses={filteredCourses.map(course => ({
                                    id: course.id,
                                    title: course.title,
                                    subject: course.subject,
                                    level: course.level,
                                    author: course.author,
                                    createdAt: course.createdAt,
                                    isPublished: course.isPublished,
                                }))}
                                isLoading={false}
                            />
                        ) : (
                            <div className="overflow-x-auto">
                                <DataTable
                                    data={filteredCourses}
                                    columns={columns}
                                />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
