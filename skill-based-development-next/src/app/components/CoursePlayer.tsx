"use client";

import {useEffect, useRef, useState} from "react";
import type {Course, Lesson} from "@/types/course";

const FALLBACK_VIDEO_URL = "/content/video/website-placeholder-video.mp4";

type CoursePlayerProps = {
    course: Course;
};

export default function CoursePlayer({course}: CoursePlayerProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const shouldAutoplayRef = useRef(false);
    const controlsTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lessons = course.chapters.flatMap((chapter) =>
        chapter.sections.flatMap((section) =>
            section.lessons
        )
    );
    const [currentLesson, setCurrentLesson] = useState<Lesson | undefined>(lessons[0]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [activeVideoUrl, setActiveVideoUrl] = useState(currentLesson?.videoUrl ?? "");
    const [videoError, setVideoError] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showVideoControls, setShowVideoControls] = useState(false);
    const currentLessonIndex = currentLesson
        ? lessons.findIndex((lesson) => lesson.id === currentLesson.id)
        : -1;
    const hasPreviousLesson = currentLessonIndex > 0;
    const hasNextLesson = currentLessonIndex >= 0 && currentLessonIndex < lessons.length - 1;

    useEffect(() => {
        setActiveVideoUrl(currentLesson?.videoUrl ?? "");
        setVideoError(false);
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        if (videoRef.current) {
            videoRef.current.currentTime = 0;
        }
    }, [currentLesson]);

    useEffect(() => {
        const video = videoRef.current;
        if (!video || !activeVideoUrl || !shouldAutoplayRef.current) return;

        shouldAutoplayRef.current = false;
        video.play().catch(() => {
            setIsPlaying(false);
        });
    }, [activeVideoUrl]);

    useEffect(() => {
        return () => {
            if (controlsTimeoutRef.current) {
                clearTimeout(controlsTimeoutRef.current);
            }
        };
    }, []);

    function showControlsTemporarily() {
        setShowVideoControls(true);

        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        controlsTimeoutRef.current = setTimeout(() => {
            setShowVideoControls(false);
        }, 3000);
    }

    function hideControls() {
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current);
        }

        setShowVideoControls(false);
    }

    function togglePlay() {
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) {
            video.play();
            setIsPlaying(true);
        } else {
            video.pause();
            setIsPlaying(false);
        }
    }

    function skipForward(seconds: number) {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime += seconds;
    }

    function skipBackward(seconds: number) {
        const video = videoRef.current;
        if (!video) return;
        video.currentTime = Math.max(0, video.currentTime - seconds);
    }

    function handleTimeUpdate() {
        const video = videoRef.current;
        if (!video) return;
        setCurrentTime(video.currentTime);
    }

    function handleLoadedMetadata() {
        const video = videoRef.current;
        if (!video) return;
        setDuration(video.duration);
    }

    function handleScrub(event: React.ChangeEvent<HTMLInputElement>) {
        const video = videoRef.current;
        if (!video) return;
        const newTime = Number(event.target.value);
        video.currentTime = newTime;
        setCurrentTime(newTime);
    }
    
    function formatTime(seconds: number) {
        if (!Number.isFinite(seconds)) {
            return "0:00";
        }
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = Math.floor(seconds % 60);
        return `${minutes}: ${remainingSeconds.toString().padStart(2, "0")}`;
    }

    function nextLesson() {
        if (!hasNextLesson) return;
        setCurrentLesson(lessons[currentLessonIndex + 1]);
    }

    function previousLesson() {
        if (!hasPreviousLesson) return;
        setCurrentLesson(lessons[currentLessonIndex - 1]);
    }

    function selectLesson(lesson: Lesson) {
        shouldAutoplayRef.current = true;
        setCurrentLesson(lesson);
    }

    function handleVideoError() {
        if (activeVideoUrl && activeVideoUrl !== FALLBACK_VIDEO_URL) {
            setActiveVideoUrl(FALLBACK_VIDEO_URL);
            setVideoError(true);
            return;
        }

        setVideoError(true);
    }

    return (
        <div className="course-player">
            <main className="video-section">
                <div
                    className={`video-shell${showVideoControls ? " is-controls-visible" : ""}`}
                    onMouseEnter={showControlsTemporarily}
                    onMouseMove={showControlsTemporarily}
                    onMouseLeave={hideControls}
                    onFocus={showControlsTemporarily}
                    onBlur={hideControls}
                >
                    {currentLesson ? (
                        <video
                            key={`${currentLesson.id}-${activeVideoUrl}`}
                            ref={videoRef}
                            src={activeVideoUrl}
                            className="video"
                            controls
                            onEnded={nextLesson}
                            onError={handleVideoError}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            onTimeUpdate={handleTimeUpdate}
                            onLoadedMetadata={handleLoadedMetadata}
                        />
                         
                    ) : (
                        <div className="video-empty">No lessons are available for this course yet.</div>
                    )}
                    <div className="video-overlay">
                        <button type="button" className="video-control-button" onClick={() => skipBackward(10)}>↶ 10</button>
                        <button type="button" className="video-control-button" onClick={togglePlay}>{isPlaying ? "❚❚" : "▶"}</button>
                        <button type="button" className="video-control-button" onClick={() => skipForward(10)}>10 ↷</button>
                    </div>
                    <div className="video-bottom-controls">
                        <input className="video-scrubber" type="range" min={0} max={duration || 0} step={0.1} value={currentTime} onChange={handleScrub}/>
                        <div className="video-time">
                            {formatTime(currentTime)}
                            {" / "}
                            {formatTime(duration)}
                        </div>
                    </div>
                </div>

                <div className="video-controls">
                    <button className="prev-lesson" onClick={previousLesson} disabled={!hasPreviousLesson}>Previous Lesson</button>
                    <button className="skip-back" onClick={() => skipBackward(10)} disabled={!currentLesson}>↶ 10</button>
                    <button className="toggle-play" onClick={togglePlay} disabled={!currentLesson}>{isPlaying ? "❚❚" : "▶"}</button>
                    <button className="skip-forward" onClick={() => skipForward(10)} disabled={!currentLesson}>10 ↷</button>
                    <button className="next-lesson" onClick={nextLesson} disabled={!hasNextLesson}>Next Lesson</button>
                </div>

                <section className="lesson-details">
                    <p className="course-player-eyebrow">{course.name}</p>
                    <h1 className="lesson-title">{currentLesson?.title ?? "Course player"}</h1>
                    {videoError && (
                        <p className="video-error">
                            This lesson video file was not found, so the preview video is playing instead.
                        </p>
                    )}
                    {currentLesson?.description && <p className="lesson-description">{currentLesson.description}</p>}
                </section>
            </main>

            <aside className="course-menu">
                <h2 className="course-content-heading">Course Content</h2>
                {course.chapters.map((chapter)=> (
                    <section key={chapter.id} className="course-menu-chapter">
                        <h3 className="course-menu-chapter-title">{chapter.title}</h3>
                        {chapter.sections.map((section) => (
                            <div key={section.id} className="course-menu-section">
                                <h4 className="course-menu-section-title">{section.title}</h4>
                                <div className="course-menu-lessons">
                                    {section.lessons.map((lesson) => (
                                        <button
                                            className={`course-menu-lesson-button${currentLesson?.id === lesson.id ? " is-active" : ""}`}
                                            key={lesson.id}
                                            onClick={() => selectLesson(lesson)}
                                        >
                                            {lesson.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </section>
                ))}
            </aside>
        </div>
    );
}