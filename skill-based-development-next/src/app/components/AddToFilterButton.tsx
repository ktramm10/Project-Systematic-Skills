"use client";

import type { Dispatch, SetStateAction } from "react";

type AddFilterButtonProps = {
    courseTag: string;
    courseTagLabel: string;
    courseFilters: string[];
    setCourseFilters: Dispatch<SetStateAction<string[]>>;
};

export function AddToFilterButton(filterButtonProps: AddFilterButtonProps) {
    const isActive = filterButtonProps.courseFilters.includes(filterButtonProps.courseTag);

    function buttonClick() {
        filterButtonProps.setCourseFilters((currentFilters) => {
            if (currentFilters.includes(filterButtonProps.courseTag)) {
                console.log("Removed " + filterButtonProps.courseTag + " from the filter.");
                return currentFilters.filter((courseFilter) => courseFilter !== filterButtonProps.courseTag);
            }

            console.log("Added " + filterButtonProps.courseTag + " To the Filter.");
            return [...currentFilters, filterButtonProps.courseTag];
        });
    }

    return (
        <button className={`filter-button${isActive ? " is-active" : ""}`} onClick={buttonClick}>
            {filterButtonProps.courseTagLabel}
        </button>
    );
}