import React from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import FavActivityPage from '@/comps/fav/favActivityPage';
import Footer from '@/comps/Footer/Footer';

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-white w-full h-full pt-10">
            <FavActivityPage/>
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


export default function Calendar() {
    return (
        <>
            <LayoutShell>
                <PageContent></PageContent>
            </LayoutShell>
        </>
    );
}
