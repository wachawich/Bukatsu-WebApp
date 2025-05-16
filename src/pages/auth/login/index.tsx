import React, { useEffect, useState } from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import LoginPage from "@/comps/auth/login/loginPage"
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
            <LoginPage />
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
            <Head>
                <title>Login</title>
                <meta name="description" content="Register Page" />
            </Head>

            <NotificationProvider>
                <PageContent></PageContent>
            </NotificationProvider>
        </>
    );
}