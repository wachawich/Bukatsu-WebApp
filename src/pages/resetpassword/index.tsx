import React, { useEffect, useState } from 'react'

import LayoutShell from "@/comps/layouts/LayoutShell";

import ResetPasswordPage from "@/comps/auth/resetPassword/resetPassword"
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
            <ResetPasswordPage />
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
                <title>Reset Password</title>
                <meta name="description" content="Reset Password Page" />
            </Head>

            <NotificationProvider>
                <PageContent></PageContent>
            </NotificationProvider>
        </>
    );
}