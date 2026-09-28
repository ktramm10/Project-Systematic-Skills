"use client";

import type { Dispatch, SetStateAction } from "react";

type ClearCourseFiltersProps = {
    courseFilters: string[];
    setCourseFilters: Dispatch<SetStateAction<string[]>>;
}
export function ClearFiltersButton(clearFiltersProps : ClearCourseFiltersProps) {
    function buttonClick() {
        clearFiltersProps.setCourseFilters([]);
        console.log("Cleared filters.");
    }

    return (
        <button className="clear-filters-button" onClick={buttonClick} disabled={clearFiltersProps.courseFilters.length === 0}>Remove Filters</button>
    )
}