import { $lang } from "@/stores";

import {
    component$,
    useComputed$,
    useSignal,
    useTask$,
} from "@builder.io/qwik";
import type { SidebarEntry, SidebarProps } from "./Sidebar.astro";
import { SidebarFolder } from "./SidebarFolder";
import { SidebarLink } from "./SidebarLink";

type SidebarListProps = {
    sidebarEntries: SidebarEntry[];
} & SidebarProps;

export const SidebarList = component$(
    ({ sidebarMode, sidebarEntries }: SidebarListProps) => {
        let renderList = useSignal<SidebarEntry[]>(sidebarEntries ?? []);
        let filter = useSignal("");
        let filteredList = useComputed$(() => {
            return renderList.value.filter(({ linkList }) =>
                linkList.some(
                    ({ title }) =>
                        (title ?? "").toLowerCase().includes(
                            filter.value.toLowerCase(),
                        ),
                )
            );
        });

        const allOpen = sidebarMode === "guides";

        return (
            <>
                <input
                    class="input input-primary"
                    placeholder="Search here"
                    bind:value={filter}
                />

                {filteredList.value.map(({ linkList, folder }) => {
                    const filteredList = linkList.filter((
                        { title },
                    ) => (title ?? "").toLowerCase().includes(
                        filter.value.toLowerCase(),
                    ));

                    return (
                        <SidebarFolder
                            title={folder}
                            id={folder}
                            isOpen={filteredList.length > 0 || allOpen}
                        >
                            {filteredList.map(({ title, link }) => (
                                <SidebarLink
                                    link={link}
                                    lang={$lang.get()}
                                    noTranslate={sidebarMode === "reference"}
                                >
                                    {title}
                                </SidebarLink>
                            ))}
                        </SidebarFolder>
                    );
                })}
            </>
        );
    },
);
