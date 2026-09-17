export type Lesson = {
    id: number;
    title: string;
    slug: string;
    description: string | null;
    videoUrl: string;
    duration: number | null;
    position: number;
};

export type Section = {
    id: number;
    title: string;
    slug: string;
    position: number;
    lessons: Lesson[];
};

export type Chapter = {
    id: number;
    title: string;
    slug: string;
    position: number;
    sections: Section[];
};

export type Course = {
    id: number;
    name: string;
    slug: string;
    priceCents: number;
    description: string;
    thumbnail: string;
    chapters: Chapter[];
};