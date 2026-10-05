"use client";

import {useState} from "react";
import Image from "next/image";
import Link from "next/link";

type SearchResult = {
    id: number;
    name: string;
    slug: string;
    description: string;
    thumbnail: string;    
}

type SearchBarProps = {
    scope?: "all" | "owned";
    resultHrefPrefix?: "/courses" | "/course-library/viewer";
}

const COURSE_IMAGE_FALLBACK = "/content/images/courses/fundamentals-of-closed-guard.jfif";

export default function SearchBar({ scope = "all", resultHrefPrefix = "/courses" }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleSearch(value: string) {
        setQuery(value);
        setError("");
        if (value.trim().length < 2) {
            setResults([]);
            return;
        }
        setLoading(true);

        try {
            const searchParams = new URLSearchParams({ q: value });

            if (scope === "owned") {
                searchParams.set("scope", "owned");
            }

            const response = await fetch(`/api/search?${searchParams.toString()}`);
            if (!response.ok) {
                const body = await response.json();
                throw new Error(body.error ?? "Search failed");
            }

            const data = await response.json();

            setResults(data);
        } catch (error) {
            console.error(error);
            setError(error instanceof Error ? error.message : "Search failed");
            setResults([]);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="search-container">
            <input type="text" placeholder="Search Courses..." value={query} onChange={(event)=> handleSearch(event.target.value)} className="search-input" />
            {query.length >= 2 && (
                <div className="search-results">
                    {loading && <p>Searching</p>}
                    {!loading && error && <p>{error}</p>}
                    {!loading && !error && results.length === 0 && (
                        <p>No results found.</p>
                    )}

                    {!loading && results.map((course) => (
                        <Link key={course.id} href={`${resultHrefPrefix}/${course.slug}`} className="search-result">
                            <Image src={course.thumbnail || COURSE_IMAGE_FALLBACK} alt={course.name} width={96} height={64} />
                            <div>
                                <h3>{course.name}</h3>
                                <p>{course.description}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}