import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Daycare } from "@/lib/data";

interface OutreachState {
    selectedDaycares: Daycare[];
    hasFollowUps: boolean;
    toggleDaycare: (daycare: Daycare, isFollowUp?: boolean) => void;
    clearSelection: () => void;
}

export const useOutreachStore = create<OutreachState>()(
    persist(
        (set, get) => ({
            selectedDaycares: [],
            hasFollowUps: false,

            toggleDaycare: (daycare, isFollowUp = false) =>
                set((state) => {
                    const exists = state.selectedDaycares.some((d) => d.id === daycare.id);
                    const newSelected = exists
                        ? state.selectedDaycares.filter((d) => d.id !== daycare.id)
                        : [...state.selectedDaycares, daycare];

                    return {
                        selectedDaycares: newSelected,
                        hasFollowUps: exists
                            ? state.hasFollowUps // keep current value on removal
                            : state.hasFollowUps || isFollowUp,
                    };
                }),

            clearSelection: () => set({ selectedDaycares: [], hasFollowUps: false }),
        }),
        {
            name: "autodaycare-selection-storage",
        }
    )
);
