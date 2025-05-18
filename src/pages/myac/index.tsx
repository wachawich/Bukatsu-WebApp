import React from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import MyActivityPage from '@/comps/myActivity/myActPage';
import Footer from "@/comps/Footer/Footer";

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-white w-full h-full pt-14">
            <MyActivityPage/>
            <Footer/>
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