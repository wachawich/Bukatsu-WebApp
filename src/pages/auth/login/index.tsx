import React, {useEffect, useState} from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import LoginPage from "@/comps/auth/login/loginPage"

// import { getUser } from "@/utils/api/userData"

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-[#343434] w-full h-full">
            <LoginPage/>
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


export default function Login() {
    return (
        <>
            <PageContent></PageContent>
        </>
    );
}