import React, { useEffect, useState } from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import RegisterPage from "@/comps/auth/register/registerPage"
import { NotificationProvider } from "@/comps/noti/notiComp";
import Head from 'next/head';

// import { getUser } from "@/utils/api/userData"

function PageContent() {
    // const [canRead, setCanRead] = useState(false);

    // useCheckTokenFlags(
    //     [{ flag: "read", onFlagUpdated: setCanRead }],
    //     "check_in"
    // );

    return (
        <div className="bg-[#343434] w-full h-full">
            <RegisterPage />
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


export default function Register() {

    return (
        <>
            <Head>
                <title>Register</title>
                <meta name="description" content="Register Page" />
            </Head>
            
            <NotificationProvider>
                <PageContent></PageContent>
            </NotificationProvider>
        </>
    );
}