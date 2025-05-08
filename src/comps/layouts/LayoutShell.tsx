import React, { useEffect, useState } from "react";
import {
    IconChartBar,
    IconStretching,
    IconHome,
    IconCalendar,
    IconTreadmill,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import Link from "next/link";
import { MainLinks } from "./_mainLink";

import { useMediaQuery } from "@/comps/public/useMediaQuery"
import { NotificationProvider } from "@/comps/noti/notiComp";

const LayoutShell = ({ children }: any) => {

    const router = useRouter();
    const [activeTab, setActiveTab] = useState<string | null>("tab3");

    const tabRoutes = {
        tab1: "/static",
        tab2: "/stretch",
        tab3: "/home",
        tab4: "/planning",
        tab5: "/activity",
    };

    useEffect(() => {
        const currentTab = Object.keys(tabRoutes).find(
            (key) => tabRoutes[key as keyof typeof tabRoutes] === router.pathname
        );
        if (currentTab) {
            setActiveTab(currentTab);
        }
    }, [router.pathname]);

    const tabTextStyle = (isActive: boolean) => ({
        fontSize: "12px",
        fontWeight: "700",
        color: isActive ? "#5F9FE3" : "gray",
        marginTop: "10px",
    });

    const isLargerThanSm = useMediaQuery("(min-width: 768px)");

    return (
        <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
            {/* Navbar for PC */}
            {isLargerThanSm && (
                <nav style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "60px",
                    zIndex: 5,
                    paddingTop: "10px"
                }}>
                    <div className="flex flex-col items-center">
                        <MainLinks />
                        <div className="w-full bg-[#FD6A03] h-2"></div>
                    </div>
                </nav>
            )}

            {!isLargerThanSm && (
                <nav style={{
                    width: "100%",
                    backgroundColor: "#ffffff",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    height: "60px",
                    zIndex: 5,
                    paddingTop: "10px"
                }}>
                    <div className="flex flex-col items-center">
                        <MainLinks />
                        <div className="w-full bg-[#FD6A03] h-2"></div>
                    </div>
                </nav>
            )}

            {/* Main content */}
            {/* <main style={{
                // flex: 1,
                //marginLeft: isLargerThanSm ? "100%" : "0px",
                // padding: "80px 16px 100px", // Adjusted for header and bottom nav
                background: "#000000",
                height: "100vh",
                // marginTop: "50px",
                display: "flex"
            }}>
                {children}
            </main> */}

            <NotificationProvider>

                {/* Main content */}
                <main style={{
                    // flex: 1,
                    //marginLeft: isLargerThanSm ? "100%" : "0px",
                    // padding: "80px 16px 100px", // Adjusted for header and bottom nav
                    background: "#ffffff",
                    height: "100vh",
                    // marginTop: "50px",
                    display: "flex"
                }}>
                    {children}
                </main>
            </NotificationProvider>
        </div>
    );
};

export default LayoutShell;

