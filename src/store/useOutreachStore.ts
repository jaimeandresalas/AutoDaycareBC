import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Daycare } from "@/lib/data";

interface OutreachState {
    selectedDaycares: Daycare[];
    toggleDaycare: (daycare: Daycare) => void;
    clearSelection: () => void;
}

export const useOutreachStore = create<OutreachState>()(
    persist(
        (set) => ({
            selectedDaycares: [],

            toggleDaycare: (daycare) =>
                set((state) => {
                    const exists = state.selectedDaycares.some((d) => d.id === daycare.id);
                    return {
                        selectedDaycares: exists
                            ? state.selectedDaycares.filter((d) => d.id !== daycare.id)
                            : [...state.selectedDaycares, daycare],
                    };
                }),

            clearSelection: () => set({ selectedDaycares: [] }),
        }),
        {
            name: "autodaycare-selection-storage",
        }
    )
);
