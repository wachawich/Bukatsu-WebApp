// import "@/styles/globals.css";
// import NextApp, { AppProps, AppContext } from "next/app";
// import Head from "next/head";
// import {
//     MantineProvider,
//     useMantineTheme,
//     ColorSchemeProvider,
//     ColorScheme,
// } from "@mantine/core";
// import { useColorScheme } from '@mantine/hooks';
// import { useEffect, useState } from "react";
// import { Notifications } from "@mantine/notifications";
// // import { appWithTranslation } from "next-i18next";
// import { useLocalStorage } from "@mantine/hooks";

// import { useRouter } from "next/router.js";
// import { setTimeout } from "timers";
// import { ShowNoti } from "@/comps/noti/notiComp";
// import { LoadingProvider } from "@/comps/loading/LoadingContext";
// import LoadingComponent from "@/comps/loading/LoadingComponent"
// import { ModalsProvider } from "@mantine/modals";
// // import { MsalProvider } from "@azure/msal-react";
// // import jwt from "jsonwebtoken";
// import { SessionProvider, signOut } from "next-auth/react";
// import Script from "next/script.js";

// const App = ({
//     Component,
//     pageProps: { session, ...pageProps },
// }: AppProps & { colorScheme: ColorScheme }) => {
//     const [data, setData] = useState<{}>({});
//     const [colorScheme, setColorScheme] = useState<ColorScheme>(
//         pageProps.colorScheme
//     );
//     const [valueColorMode, setValueColorMode] = useLocalStorage({
//         key: "mantine-color-scheme",
//         defaultValue: "light",
//     });

//     const [token, setToken] = useLocalStorage({
//         key: "authToken",
//         defaultValue: "",
//     });

//     const [hasToken, setHasToken] = useState(true);
//     const [isRefreshingToken, setIsRefreshingToken] = useState(true);
//     const [isRender, setIsRender] = useState(false);

//     const router = useRouter();

//     useEffect(() => {
//         setColorScheme("light");
//     }, [valueColorMode]);

//     useEffect(() => {
//         if (!(router.pathname == "/login" || router.pathname == "/redirect_in"))
//             signOut({ redirect: false });
//     }, [token, router.pathname, hasToken]);

//     useEffect(() => {
//         if (
//             token ||
//             router.pathname == "/login" ||
//             router.pathname == "/redirect_in" ||
//             router.pathname == "/test"
//         ) {
//             setHasToken(true);
//             setIsRender(true);
//         } else {
//             setTimeout(() => {
//                 const authToken = localStorage.getItem("authToken");

//                 if (!authToken) {
//                     ShowNoti({
//                         response: "error",
//                         message: "err_please_login",
//                     });

//                     router.push("login");
//                 }
//                 // else {
//                 //     if (jwt.decode(authToken)) setIsRender(true);
//                 // }
//             }, 3000);
//         }
//     }, [token, router.pathname, hasToken]);


//     useEffect(() => {
//         function redirectToLogin(token: string, pathname: string) { }

//         if (router.isReady && router.pathname && router.pathname != "/login") {
//             redirectToLogin(token, router.pathname);
//         }
//     }, [router.isReady, router.pathname]);

//     // useEffect(() => {
//     //   const unloadCallback = (event: any) => {
//     //     event.preventDefault();
//     //     event.returnValue = "";
//     //     return "";
//     //   };

//     //   window.addEventListener("beforeunload", unloadCallback);
//     //   return () => window.removeEventListener("beforeunload", unloadCallback);
//     // }, []);
//     // const handleRouteChange = (url: any) => {
//     //     window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
//     //         page_path: url, // Update the page path in GA
//     //     });
//     // };

//     // useEffect(() => {
//     //     router.events.on("routeChangeComplete", handleRouteChange);
//     //     return () => {
//     //         router.events.off("routeChangeComplete", handleRouteChange);
//     //     };
//     // }, [router.events]);

//     return (
//         <>
//             <Head>
//                 {/* <title>{Conf.application_name}</title> */}
//                 <meta
//                     name="viewport"
//                     content="minimum-scale=1, initial-scale=1, width=device-width"
//                 />
//                 <meta name="HandheldFriendly" content="true" />
//                 {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta> */}
//                 <link rel="icon" href="/resource/logo-xs.png" />

//                 <link rel="preconnect" href="https://fonts.googleapis.com" />
//                 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
//                 <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
//             </Head>


//             <Script
//                 src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
//                 strategy="afterInteractive"
//             />

//             <Script id="google-analytics" strategy="afterInteractive">
//                 {`
//                   window.dataLayer = window.dataLayer || [];
//                   function gtag(){dataLayer.push(arguments);}
//                   gtag('js', new Date());
//                   gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
//                 `}
//             </Script>

//             <LoadingProvider>
//                 <LoadingComponent />
//                 <MantineProvider
//                     theme={{
//                         colorScheme,
//                         loader: "bars",
//                         fontFamily: "Noto Sans Thai, sans-serif",
//                         headings: { fontFamily: "Noto Sans Thai, sans-serif" },
//                     }}
//                     withGlobalStyles
//                     withNormalizeCSS
//                 >
//                     <ModalsProvider>
//                         {hasToken && (
//                             <SessionProvider session={session}>
//                                 {isRefreshingToken && isRender && (
//                                     <Component {...pageProps} data={data} setData={setData} />
//                                 )}
//                             </SessionProvider>
//                         )}
//                     </ModalsProvider>
//                     <Notifications position="top-center" />
//                     <LoadingComponent />
//                 </MantineProvider>
//             </LoadingProvider>

//         </>
//     );
// };

// export default App

// // App.getInitialProps = async (appContext: AppContext) => {
// //   const appProps = await NextApp.getInitialProps(appContext);
// //   return {
// //     ...appProps,
// //     colorScheme: localStorage.getItem("mantine-color-scheme") || "light",
// //   };
// // };

import "@/styles/globals.css";
import NextApp, { AppProps, AppContext } from "next/app";
import Head from "next/head";
import {
    MantineProvider,
    useMantineTheme,
    ColorSchemeProvider,
    ColorScheme,
} from "@mantine/core";
import { useColorScheme } from '@mantine/hooks';
import { useEffect, useState } from "react";
import { Notifications } from "@mantine/notifications";
// import { appWithTranslation } from "next-i18next";
import { useLocalStorage } from "@mantine/hooks";

import { useRouter } from "next/router.js";
import { setTimeout } from "timers";
import { ShowNoti } from "@/comps/noti/notiComp";
// import { LoadingProvider } from "@/comps/loading/LoadingContext";
// import LoadingComponent from "@/comps/loading/LoadingComponent"
import { ModalsProvider } from "@mantine/modals";
// import { MsalProvider } from "@azure/msal-react";
// import jwt from "jsonwebtoken";
import { SessionProvider, signOut } from "next-auth/react";
import Script from "next/script.js";

const App = ({
    Component,
    pageProps: { session, ...pageProps },
}: AppProps & { colorScheme: ColorScheme }) => {



    const [data, setData] = useState<{}>({});
    const [colorScheme, setColorScheme] = useState<ColorScheme>(
        pageProps.colorScheme
    );
    const [valueColorMode, setValueColorMode] = useLocalStorage({
        key: "mantine-color-scheme",
        defaultValue: "light",
    });

    const [token, setToken] = useLocalStorage({
        key: "authToken",
        defaultValue: "",
    });

    const [hasToken, setHasToken] = useState(true);
    const [isRefreshingToken, setIsRefreshingToken] = useState(true);
    const [isRender, setIsRender] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setColorScheme("light");
    }, [valueColorMode]);

    useEffect(() => {
        if (!(router.pathname == "/login" || router.pathname == "/redirect_in"))
            signOut({ redirect: false });
    }, [token, router.pathname, hasToken]);

    const toggleColorScheme = (value?: ColorScheme) => {
        const nextColorScheme =
          value || (colorScheme === "dark" ? "light" : "dark");
    
        setColorScheme(nextColorScheme);
        setValueColorMode(nextColorScheme);
      };

    useEffect(() => {
        if (
            token ||
            router.pathname == "/login" ||
            router.pathname == "/redirect_in" ||
            router.pathname == "/test"
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
                // else {
                //     if (jwt.decode(authToken)) setIsRender(true);
                // }
            }, 3000);
        }
    }, [token, router.pathname, hasToken]);


    useEffect(() => {
        function redirectToLogin(token: string, pathname: string) { }

        if (router.isReady && router.pathname && router.pathname != "/login") {
            redirectToLogin(token, router.pathname);
        }
    }, [router.isReady, router.pathname]);

    // useEffect(() => {
    //   const unloadCallback = (event: any) => {
    //     event.preventDefault();
    //     event.returnValue = "";
    //     return "";
    //   };

    //   window.addEventListener("beforeunload", unloadCallback);
    //   return () => window.removeEventListener("beforeunload", unloadCallback);
    // }, []);
    // const handleRouteChange = (url: any) => {
    //     window.gtag("config", process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS, {
    //         page_path: url, // Update the page path in GA
    //     });
    // };

    // useEffect(() => {
    //     router.events.on("routeChangeComplete", handleRouteChange);
    //     return () => {
    //         router.events.off("routeChangeComplete", handleRouteChange);
    //     };
    // }, [router.events]);

    return (
        <>
            <Head>
                {/* <title>{Conf.application_name}</title> */}
                <meta
                    name="viewport"
                    content="minimum-scale=1, initial-scale=1, width=device-width"
                />
                <meta name="HandheldFriendly" content="true" />
                {/* <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"></meta> */}
                <link rel="icon" href="/resource/logo-xs.png" />

                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
                <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@100..900&display=swap" rel="stylesheet" />
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
                <MantineProvider
                    theme={{
                        colorScheme: 'light',
                        loader: "bars",
                        fontFamily: "Noto Sans Thai, sans-serif",
                        headings: { fontFamily: "Noto Sans Thai, sans-serif" },
                    }}
                    withGlobalStyles
                    withNormalizeCSS
                >
                    <ModalsProvider>
                        {hasToken && (
                            <SessionProvider session={session}>
                                {isRefreshingToken && isRender && (
                                    <Component {...pageProps} data={data} setData={setData} />
                                )}
                            </SessionProvider>
                        )}
                    </ModalsProvider>
                    <Notifications position="top-center" />
                    <LoadingComponent />
                </MantineProvider>
            </LoadingProvider> */}

            <MantineProvider
                theme={{
                    colorScheme: 'light',
                    loader: "bars",
                    fontFamily: "Noto Sans Thai, sans-serif",
                    headings: { fontFamily: "Noto Sans Thai, sans-serif" },
                }}
                withGlobalStyles
                withNormalizeCSS
            >
                <ModalsProvider>
                    {hasToken && (
                        <SessionProvider session={session}>
                            {isRefreshingToken && isRender && (
                                <Component {...pageProps} data={data} setData={setData} />
                            )}
                        </SessionProvider>
                    )}
                </ModalsProvider>
                <Notifications position="top-center" />
                {/* <LoadingComponent /> */}
            </MantineProvider>

        </>
    );
};

export default App

// App.getInitialProps = async (appContext: AppContext) => {
//   const appProps = await NextApp.getInitialProps(appContext);
//   return {
//     ...appProps,
//     colorScheme: localStorage.getItem("mantine-color-scheme") || "light",
//   };
// };

