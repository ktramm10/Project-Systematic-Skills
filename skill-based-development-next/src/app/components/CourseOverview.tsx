"use client";

import { useState } from "react";
import type { Course, Chapter, Section } from "@/types/course";

type CourseOverviewProps = {
    course: Course;
};

export default function CourseOverview({
    course,
}: CourseOverviewProps) {
    const [openChapterId, setOpenChapterId] = useState<number | null>(null);

    function toggleChapter(chapterId: number) {
        setOpenChapterId((currentChapterId) =>
            currentChapterId === chapterId ? null : chapterId
        );
    }

    return (
        <div className="course-overview">
            {course.chapters.map((chapter) => (
                <ChapterDropdown
                    key={chapter.id}
                    chapter={chapter}
                    isOpen={openChapterId === chapter.id}
                    onToggle={() => toggleChapter(chapter.id)}
                />
            ))}
        </div>
    );
}

type ChapterDropdownProps = {
    chapter: Chapter;
    isOpen: boolean;
    onToggle: () => void;
};

function ChapterDropdown({
    chapter,
    isOpen,
    onToggle,
}: ChapterDropdownProps) {
    return (
        <article className="course-overview-chapter">
            <button
                type="button"
                className="course-overview-chapter-toggle"
                aria-expanded={isOpen}
                onClick={onToggle}
            >
                {chapter.title}
            </button>

            {isOpen && (
                <div className="course-overview-sections">
                    {chapter.sections.map((section) => (
                        <CourseSection
                            key={section.id}
                            section={section}
                        />
                    ))}
                </div>
            )}
        </article>
    );
}

type CourseSectionProps = {
    section: Section;
};

function CourseSection({
    section,
}: CourseSectionProps) {
    return (
        <section className="course-overview-section">
            <h3>{section.title}</h3>

            <ul className="course-overview-lessons">
                {section.lessons.map((lesson) => (
                    <li
                        key={lesson.id}
                        className="course-overview-lesson"
                    >
                        {lesson.title}
                    </li>
                ))}
            </ul>
        </section>
    );
}