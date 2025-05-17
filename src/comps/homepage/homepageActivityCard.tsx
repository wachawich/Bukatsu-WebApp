import React, { useEffect, useState } from "react";
import { ActivityField } from "@/utils/api/activity";
import Image from "next/image";
import Link from "next/link";
import Heart from "../activityDetail/Heart";

interface ActivityCardProps {
    activity: ActivityField;
}

export default function HomepageActivityCard({ activity }: ActivityCardProps) {

    return (


        <div className="bg-white rounded-lg shadow-md hover:shadow-lg w-full h-full transition-all flex flex-col relative">
            <div className="absolute top-2 right-2 flex items-center justify-center bg-gray-300 rounded-full">
                <Heart
                    activity_id={activity.activity_id}
                />
            </div>
            <Image
                src={activity.image_link?.banner || "/default-banner.jpg"}
                width={300}
                height={160}
                className="w-full h-40 object-cover rounded-t-md "
                alt={activity.title}
            />

            <div className="flex flex-col flex-grow pt-3 px-4 pb-4">
                <h2 className="text-lg font-semibold  mb-1">{activity.title}</h2>
                <div className="flex flex-wrap gap-1 mb-2">
                    {activity.activity_type_data?.map((type) => (
                        <span
                            key={`type-${type.activity_type_id}`}
                            className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded"
                        >
                            {type.activity_type_name}
                        </span>
                    ))}
                    {activity.activity_subject_data?.map((subject) => (
                        <span
                            key={`subject-${subject.subject_id}`}
                            className="bg-orange-100 text-orange-600 text-xs px-2 py-0.5 rounded"
                        >
                            {subject.subject_name}
                        </span>
                    ))}
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4">
                    {activity.description}
                </p>

                <div className="mt-auto self-end">
                    <Link href={`/activity_detail?activity_id=${activity.activity_id}`}>
                        <button className="text-sm bg-orange-500 hover:bg-orange-600 text-white px-4 py-1 rounded">
                            View more
                        </button>
                    </Link>
                </div>
            </div>
        </div>


    );
};

