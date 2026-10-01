"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { CourseTag } from "../../enum/course-tag"
import {AddToFilterButton} from "../components/AddToFilterButton";
import {ClearFiltersButton} from "../components/ClearFiltersButton";

export default function CategoriesPage() {
    const categories = [
        { tag: CourseTag.FUNDAMENTALS, label: "Fundamentals" },
        { tag: CourseTag.SOLO_DRILLS, label: "Solo Drills" },
        { tag: CourseTag.CLOSED_GUARD, label: "Closed Guard" },
        { tag: CourseTag.HALF_GUARD, label: "Half Guard" },
        { tag: CourseTag.OPEN_GUARD, label: "Open Guard" },
        { tag: CourseTag.SIDE_CONTROL, label: "Side Control" },
        { tag: CourseTag.MOUNT, label: "Mount" },
        { tag: CourseTag.BACK_CONTROL, label: "Back Control" },
        { tag: CourseTag.KNEE_ON_BELLY, label: "Knee On Belly" },
        { tag: CourseTag.NORTH_SOUTH, label: "North South" },
        { tag: CourseTag.TURTLE, label: "Turtle" },
        { tag: CourseTag.GUARD_PASSING, label: "Guard Passing" },
        { tag: CourseTag.ESCAPES, label: "Escapes" },
    ];

    const [filter, setFilter] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getCoursesByCategory() {
            setError("");

            if (filter.length === 0) {
                setCourses([]);
                return;
            }

            setLoading(true);

            try {
                const searchParams = new URLSearchParams();
                filter.forEach((courseTag) => searchParams.append("tag", courseTag));

                const response = await fetch(`/api/categorize?${searchParams.toString()}`);

                if (!response.ok) {
                    throw new Error("Unable to load courses for those filters.");
                }

                const data = await response.json();
                setCourses(data);
            } catch (error) {
                console.error(error);
                setError(error instanceof Error ? error.message : "Unable to load courses for those filters.");
                setCourses([]);
            } finally {
                setLoading(false);
            }
        }

        getCoursesByCategory();
    }, [filter]);

    return (
        <main className="categories-page">
            <section className="categories-hero">
                <div className="categories-heading-group">

                    <h1 className="categories-heading">Browse Courses by Category</h1>
                    <p className="categories-intro">
                        Choose one or more areas to find courses that match your training focus.
                    </p>
                </div>
            </section>

            <section className="categories-filter-panel" aria-label="Course category filters">
                <div className="categories-container">
                    {categories.map((category) => (
                        <AddToFilterButton
                        key={category.tag}
                        courseFilters={filter} 
                        setCourseFilters={setFilter}
                        courseTag={category.tag}
                        courseTagLabel={category.label}
                        />
                    ))}
                    <ClearFiltersButton courseFilters={filter} setCourseFilters={setFilter}/>
                </div>
            </section>

            <section className="category-results-section">
                <div className="category-results-heading">
                    <h2>{filter.length > 0 ? "Matching Courses" : "Choose a Category"}</h2>
                    <p>
                        {filter.length > 0
                            ? `${courses.length} ${courses.length === 1 ? "course" : "courses"} found for your current filters.`
                            : "Your course matches will appear here once a filter is selected."}
                    </p>
                </div>
                {loading && <p className="category-results-message">Loading courses...</p>}
                {!loading && error && <p className="category-results-message">{error}</p>}
                {!loading && !error && filter.length === 0 && (
                    <p className="category-results-message">Start with a category like Half Guard, Fundamentals, or Solo Drills.</p>
                )}
                {!loading && !error && filter.length > 0 && courses.length === 0 && (
                    <p className="category-results-message">No courses match those filters.</p>
                )}
                {!loading && courses.length > 0 && (
                    <div className="library-course-container">
                        {courses.map((course) => (
                            <article key={course.id} className="content-card library-course-card">
                                <Image src={course.thumbnail || "/content/images/courses/fundamentals-of-closed-guard.jfif"} alt={course.name} width={640} height={360} />
                                <div className="library-card-body">
                                    <p className="library-card-label">Course</p>
                                    <h2>{course.name}</h2>
                                    {course.description && <p>{course.description}</p>}
                                </div>
                                <Link href={`/courses/${course.slug}`}>View Course</Link>
                            </article>
                        ))}
                    </div>
                )}
            </section>
        </main>
    );

}