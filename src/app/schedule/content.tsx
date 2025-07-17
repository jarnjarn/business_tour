'use client';

import Link from "next/link";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useTouristStore } from "@/states/tourist.state";

export function ScheduleContent() {
    const { tourists, fetchTourists } = useTouristStore();
    const [query, setQuery] = useState({ page: 1, limit: 10, search: "" });
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    useEffect(() => {
        fetchTourists(query);
    }, [query]);

    return (
        <div>
            <div className="mt-10">
                <h1 className="text-center font-semibold text-lime-700 text-3xl">
                    DANH SÁCH LỊCH TRÌNH THĂM QUAN
                </h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 p-4">
                {tourists?.data?.map((tourist, index) => (
                    <div
                        key={index}
                        className="relative overflow-hidden rounded-xl shadow-lg group cursor-pointer"
                        onMouseEnter={() => setHoveredId(tourist._id)}
                        onMouseLeave={() => setHoveredId(null)}
                    >
                        <Image
                            src={tourist.location.image}
                            alt={tourist.location.name}
                            width={300}
                            height={200}
                            className="w-full h-auto"
                        />
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                            <h3 className="text-sm font-semibold">{tourist.location.name}</h3>
                        </div>

                        {/* Hover Buttons */}
                        {hoveredId === tourist._id && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/50 transition-opacity duration-300">
                                <Link href={`/schedule/${tourist._id}`}>
                                    <button className="bg-white text-black px-4 py-2 md:px-6 md:py-3 rounded-lg m-1 text-sm md:text-base">
                                        Xem lịch trình
                                    </button>
                                </Link>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}