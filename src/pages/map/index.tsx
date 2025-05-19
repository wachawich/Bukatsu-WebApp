import React, {useEffect, useState} from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import MainMap from "@/comps/map/mainMap"

import { getUser } from "@/utils/api/userData"

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-[#ffffff] w-full h-full pt-14">
            <MainMap/>
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


export default function MainMaps() {
    return (
        <>
            <LayoutShell>
                <PageContent></PageContent>
            </LayoutShell>
        </>
    );
}