import React, { useEffect, useState } from "react";
import {
    AppShell,
    Image,
    ActionIcon,
    Avatar,
} from "@mantine/core";
import {
    IconFaceId,
    IconUser,
    IconBell,
    IconHome,
    IconLassoPolygon,
    IconCalendar,
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { MainLinks } from "./_mainLink";
// import { useTranslation } from "next-i18next";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
// import Conf from "./../../app.config.js";
// import jwt from "jsonwebtoken";
// import UpdateIcon from "../update/UpdateIcon";
// import { signOut } from "next-auth/react";
import Link from "next/link.js";


const LayoutShell = ({ children }: any) => {
    // const { t } = useTranslation();
    // const theme = useMantineTheme();
    // const { colorScheme, toggleColorScheme } = useMantineColorScheme();
    // const dark = colorScheme === "dark";
    const [opened, setOpened] = useState(true);
    const router = useRouter();
    const [token, setToken] = useLocalStorage({
        key: "authToken",
        defaultValue: "",
    });
    const [username, setUsername] = useState("");
    const [profileImage, setProfileImage] = useState<string>("");

    const [activeTab, setActiveTab] = useState<string | null>("tab1");

    const handleLocaleChange = (event: any) => {
        const value = event;

        router.push(router.asPath, router.asPath, {
            locale: value,
        });
    };

    const isLargerThanSm = useMediaQuery("(min-width: 768px)");

    // useEffect(() => {
    //     if (token !== "") {
    //         const flagDecode: any = jwt.decode(token);
    //         setUsername(flagDecode.user);
    //         setProfileImage(localStorage.profile_image);
    //     }
    // }, [token]);

    // bottom tabs style
    const tabTextStyle = (isActive: boolean) => ({
        fontSize: "12px",
        fontWeight: "700",
        color: isActive ? "#5F9FE3" : "gray",
        marginTop: "10px",
    });

    const tabRoutes = {
        tab1: "/mobile_homepage",
        tab2: "/planning",
        tab3: "/new_area_map",
        tab4: "/check_in",
        tab5: "/profile",
    };

    useEffect(() => {
        const currentTab = Object.keys(tabRoutes).find(
            (key) =>
                tabRoutes[key as keyof typeof tabRoutes] === router.pathname
        );
        if (currentTab) {
            setActiveTab(currentTab);
        }
    }, [router.pathname]);

    return (
        <AppShell
            styles={{
                main: {
                    background: "#ffffff",
                    // paddingBottom: "100px",
                    height: isLargerThanSm ? "100vmin": "100vmax"
                },
            }}
            navbar={{ width: 250, breakpoint: "sm", collapsed: { mobile: !opened } }}
            //navbar={{ width: 250, breakpoint: "sm", hidden: false }}  
            header={{ height: 70 }}
        >
            {/* Navbar for PC (visible on larger screens) */}
            <AppShell.Navbar p="md" style={{ width: "100%" , position: "fixed", backgroundColor: "#ffffff"}}>
                <AppShell.Section style={{ width: "100%" }} className="flex flex-col items-center">
                    <MainLinks />
                    <div className="w-full bg-[#FD6A03] h-2"></div>
                </AppShell.Section>
            </AppShell.Navbar>

            {/* Header section */}
            {/* <AppShell.Header>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        height: "100%",
                    }}
                >
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                        }}
                    >
                        <Link href={"/home"}>
                            <Image maw={100} src="/resource/OneAgri_Pro_logo_version4.png" alt="LOGO" />
                        </Link>
                    </div>

                    <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
                        profile
                        <ActionIcon>
                            <Avatar
                                radius="xl"
                                alt="profile"
                                size={30}
                                src={profileImage || ""}
                                onClick={() => router.push("/profile")}
                            />
                        </ActionIcon>
                    </div>
                </div>
            </AppShell.Header> */}

            {/* Main content area */}
            <AppShell.Main className="flex justify-center h-full">{children}</AppShell.Main>
        </AppShell>

    );
};

export default LayoutShell;
