


import "@/styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router.js";
import { setTimeout } from "timers";
import { SessionProvider, signOut } from "next-auth/react";
import Script from "next/script.js";
import { decodeToken } from "@/utils/auth/jwt";
import { useNotification } from "@/comps/noti/notiComp"

import { NotificationProvider } from "@/comps/noti/notiComp";

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps) => {
    const [data, setData] = useState<{}>({});
    const [token, setToken] = useState<string | null>(null);
    const [hasToken, setHasToken] = useState(true);
    const [isRefreshingToken, setIsRefreshingToken] = useState(true);
    const [isRender, setIsRender] = useState(false);


    const router = useRouter();

    useEffect(() => {
        const token = decodeToken();

        setToken(token)
    }, []);


    useEffect(() => {
        if (
            token
        ) {
            setHasToken(true);
            setIsRender(true);
        } else if (
            !token &&
            (router.pathname === "/auth/login" || router.pathname === "/auth/register")
        ) {
            setHasToken(true);
            setIsRender(true);

        }  else if (
            router.pathname === "/home" ||
            router.pathname === "/calendar" ||
            router.pathname === "/map" ||
            router.pathname === "/myactivity" ||
            (router.pathname === "/activity_detail" && router.query.activity_id) ||
            router.pathname === "/resetpassword"
        ) {
            setHasToken(true);
            setIsRender(true);
        }


        else {
            setTimeout(() => {

                const token = decodeToken();

                if (!token) {
                    // showNotification("Not found token!", `Pls Login before!`, "error");

                    router.push("/auth/login");
                }
            }, 3000);
        }
    }, [token, router.pathname, hasToken]);

    return (
        <>
            <Head>
                <title>Bukatsu</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <meta name="HandheldFriendly" content="true" />
                <link rel="icon" href="/BukatsuLogoV2.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <meta property="og:image" content="/BukatsuLogoV2.png" />
                <meta property="og:image:type" content="image/png" />
                <meta property="og:image:width" content="1200" />
                <meta property="og:image:height" content="630" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap"
                    rel="stylesheet"
                />
            </Head>

            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
                strategy="afterInteractive"
            />

            <Script id="google-analytics" strategy="afterInteractive">
                {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
            </Script>



            {hasToken && (
                <SessionProvider session={session}>
                    <NotificationProvider>
                        {isRefreshingToken && isRender && (
                            <Component {...pageProps} data={data} setData={setData} />
                        )}
                    </NotificationProvider>
                </SessionProvider>
            )}

        </>
    );
};

export default App;




