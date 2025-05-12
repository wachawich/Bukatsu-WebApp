import React, {useEffect, useState} from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import CreateActivity from "@/comps/createActivity/create_activityPage"

import { getUser } from "@/utils/api/userData"

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-[#343434] w-full h-full pt-14">
            <CreateActivity/>
        </div>
        // <>
        //     {canRead && (
        //         <div className="fadeIn-animation">
        //             {/* <CheckIn /> */}
        //         </div>
        //     )}
        // </>
    );
}


export default function create_activity() {
    return (
        <>
            <LayoutShell>
                <PageContent></PageContent>
            </LayoutShell>
        </>
    );
}