


import "@/styles/globals.css";
import { AppProps } from "next/app";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useRouter } from "next/router.js";
import { setTimeout } from "timers";
import { ShowNoti } from "@/comps/noti/notiComp";
// import { LoadingProvider } from "@/comps/loading/LoadingContext";
// import LoadingComponent from "@/comps/loading/LoadingComponent";
import { SessionProvider, signOut } from "next-auth/react";
import Script from "next/script.js";

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
        const storedToken = localStorage.getItem("authToken");
        setToken(storedToken);
    }, []);

    useEffect(() => {
        if (!(router.pathname === "/login" || router.pathname === "/redirect_in")) {
            signOut({ redirect: false });
        }
    }, [token, router.pathname, hasToken]);

    useEffect(() => {
        if (
            token ||
            router.pathname === "/login" ||
            router.pathname === "/redirect_in" ||
            router.pathname === "/test"
        ) {
            setHasToken(true);
            setIsRender(true);
        } else {
            setTimeout(() => {
                const authToken = localStorage.getItem("authToken");

                if (!authToken) {
                    ShowNoti({
                        response: "error",
                        message: "err_please_login",
                    });

                    router.push("login");
                }
            }, 3000);
        }
    }, [token, router.pathname, hasToken]);

    useEffect(() => {
        function redirectToLogin(token: string | null, pathname: string) {
            // You can add logic here if needed
        }

        if (router.isReady && router.pathname && router.pathname !== "/login") {
            redirectToLogin(token, router.pathname);
        }
    }, [router.isReady, router.pathname]);

    return (
        <>
            <Head>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
                <meta name="HandheldFriendly" content="true" />
                <link rel="icon" href="/resource/logo-xs.png" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
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

            {/* <LoadingProvider>
        <LoadingComponent />
        {hasToken && (
          <SessionProvider session={session}>
            {isRefreshingToken && isRender && (
              <Component {...pageProps} data={data} setData={setData} />
            )}
          </SessionProvider>
        )}
        <LoadingComponent />
      </LoadingProvider> */}

            {hasToken && (
                <SessionProvider session={session}>
                    {isRefreshingToken && isRender && (
                        <Component {...pageProps} data={data} setData={setData} />
                    )}
                </SessionProvider>
            )}
        </>
    );
};

export default App;




