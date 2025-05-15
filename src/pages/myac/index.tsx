import React from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import MyActivityPage from '@/comps/myActivity/myActPage';

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-white w-full h-full pt-14">
            <MyActivityPage/>
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


export default function MyActivity() {
    return (
        <>
            <LayoutShell>
                <PageContent></PageContent>
            </LayoutShell>
        </>
    );
}