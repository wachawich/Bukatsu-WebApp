import React, { useEffect, useState, useRef } from "react";
import {
    IconUser,
    IconSettings,
    IconLogout,
    IconLassoPolygon,
    IconAdjustmentsHorizontal,
    IconCalendar,
    IconAlignJustified,
    IconSearch,
    IconHeart
} from "@tabler/icons-react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
// import { useTranslation } from "next-i18next";
import { IconFaceId } from "@tabler/icons-react";
//import jwt from "jsonwebtoken";
//import useCheckTokenFlags from "@/hooks/useCheckTokenFlag";
import Link from "next/link.js";
import { useMediaQuery } from "@/comps/public/useMediaQuery"
import Image from "next/image";
import { decodeToken } from "@/utils/auth/jwt";
import { useNotification } from "@/comps/noti/notiComp"

interface MainLinkProps {
    label: string;
    route: string;
}


function ProvideLink({ label, route }: MainLinkProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isLargerThanSms = useMediaQuery("(min-width: 768px)");

    const changeRoute = () => {
        const newRoute = "/" + route;
        if (pathname === newRoute) {
            router.reload();
        } else {
            router.push(newRoute, undefined, { shallow: true });
        }
    };

    return (
        <button
            onClick={changeRoute}
            className={`relative text-black ${!isLargerThanSms ? "hover:bg-gray-900 w-full h-[50px]" : ""}`}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                borderRadius: "4px",
                fontSize: isLargerThanSms ? "1rem" : "1.2rem",
                fontWeight: isLargerThanSms ? "normal" : "bold",
                backgroundColor: "transparent",
                transition: "background-color 0.1s",
                cursor: "pointer",
            }}
        >
            <div className="text-sm font-semibold">{label}</div>
        </button>
    );
}


export function MainLinks() {
    // const { t } = useTranslation();
    const [token, setToken] = useState<any | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { showNotification } = useNotification();

    const router = useRouter();

    const data: MainLinkProps[] = [];

    interface LinkItem {
        label: string;
        route: string;
    }

    interface LinksProps {
        links: LinkItem[];
    }

    data.push({
        label: "Calendar",
        route: "calendar",
    });

    data.push({
        label: "My Activity",
        route: "myac",
    });

    data.push({
        label: "Club",
        route: "club",
    });

    data.push({
        label: "Map",
        route: "map",
    });

    // if (pageFlag.master_data && pageFlag.master_data.read) {
    //     data_manage.push({
    //         icon: <IconAdjustmentsHorizontal size="1.5rem" />,
    //         label: "master_data",
    //         route: "masterdata",
    //     });
    // }

    function Links({ links }: LinksProps) {
        return (
            <div className="flex gap-2" style={{ width: "70%" }}>
                {links.map((link) => (
                    <ProvideLink key={link.label} {...link} />
                ))}
            </div>
        );
    }

    function MobileNav({ links }: LinksProps) {
        return (
            <div className="absolute mx-0 top-0 left-0 h-80 bg-[#ffffff] text-black flex flex-col z-30"
                style={{ width: "100%", position: "absolute", overflow: "visible" }}>
                <div className="w-full flex flex-col justify-start items-center mt-16 gap-3">
                    {links.map((link) => (
                        <ProvideLink key={link.label} {...link} />
                    ))}
                </div>
            </div>
        );
    }

    const isLargerThanSm = useMediaQuery("(min-width: 768px)");


    const [showNav, setShowNav] = useState(false);

    const toggleNav = () => {
        setShowNav(prevState => !prevState);
    };

    useEffect(() => {
        const token = decodeToken();

        setToken(token)
    }, []);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleLogout = () => {

        localStorage.removeItem("bukatsu_access_token");
        setIsDropdownOpen(false);
        showNotification("Logout", "logout successfully!", "error");

        router.push("/auth/login");
    };

    const handleSettings = () => {
        console.log("Opening settings...");
        setIsDropdownOpen(false);
        // router.push("/settings");
    };

    const handleProfile = () => {
        console.log("Opening profile...");
        setIsDropdownOpen(false);
        router.push("/profile");
    };
    const handleFav = () => {
        console.log("Opening favorite...");
        setIsDropdownOpen(false);
        router.push("/Fav");
    };

    return (

        <div
            style={{
                display: "flex",
                justifyContent: isLargerThanSm ? 'center' : 'space-between',
                alignItems: "center",
                height: "3rem",
                width: "100%"
            }}
            className="mx-0"
        >
            {showNav && <MobileNav links={data} />}

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",

                }}
            >

                {isLargerThanSm ? (
                    <Link href={"/home"} className="text-[#FD6A03] font-black text-xl mr-8 ml-2">
                        {/* <Image maw={100} src="/resource/OneAgri_Pro_logo_version4.png" alt="LOGO" /> */}
                        BUKATSU
                    </Link>
                ) : (

                    <div className="flex justify-start items-center ml-3">
                        <IconAlignJustified
                            style={{ color: '#FD6A03' }} // เปลี่ยนสีเป็นส้ม
                            stroke={3} // เพิ่มความหนาของเส้น
                            size={30} // ขนาดของไอคอน (ปรับได้ตามต้องการ)
                            className="mx-0 my-0 border rounded-md cursor-pointer z-40"
                            onClick={toggleNav}
                        />
                        <Link href={"/home"} className="text-[#FD6A03] font-black text-md ml-2">
                            {/* <Image maw={100} src="/resource/OneAgri_Pro_logo_version4.png" alt="LOGO" /> */}
                            BUKATSU
                        </Link>
                    </div>
                )}



            </div>



            {isLargerThanSm && (
                <div className="navCenter flex space-between items-center" style={{ width: "70%" }}>
                    <Links links={data} />
                    {/* <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar text-xs h-full w-64 text-black relative"
                        style={{
                            padding: "5px 20px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            right: isLargerThanSm ? '-10' : '0'
                        }}
                    /> */}
                </div>
            )}



            <div style={{ display: "flex", justifyContent: "center" }} className="text-black flex items-center">
                {/* profile */}

                {/* {!isLargerThanSm && (
                    <IconSearch className="mr-2 border rounded-md p-1 w-full h-full" />
                )} */}

                {token ? (
                    <div className="flex">
                        <Image
                            src={token.profile_image || ""}
                            alt="profile"
                            width={38}
                            height={40}
                            className="border-2 mr-3"
                            style={{
                                borderRadius: "50%",
                                marginLeft: isLargerThanSm ? '10px' : '0'
                            }}
                            onClick={toggleDropdown}
                        />
                        {/* <p className="mt-2 text-sm">{token.username}</p> */}
                    </div>
                ) : (
                    <Image
                        src="/saveee.png"
                        alt="profile"
                        width={38}
                        height={40}
                        className="border-2 mr-3"
                        style={{
                            borderRadius: "50%",
                            marginLeft: isLargerThanSm ? '10px' : '0'
                        }}
                        onClick={toggleDropdown}
                    />
                )}

                {isDropdownOpen && (
                    <div className="absolute top-0 h-40">
                        <div className="absolute -right-10 top-16 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                            <button
                                onClick={handleProfile}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <IconUser size={16} className="mr-2" />
                                Profile
                            </button>

                            <button
                                onClick={handleFav}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <IconHeart size={16} className="mr-2" />
                                Favorite Activity
                            </button>

                            <button
                                onClick={handleSettings}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                            >
                                <IconSettings size={16} className="mr-2" />
                                Settings
                            </button>

                            <hr className="my-1 border-gray-200" />


                            <button
                                onClick={handleLogout}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                            >
                                <IconLogout size={16} className="mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                )}


                {/* <ActionIcon>
                    <Avatar
                        radius="xl"
                        alt="profile"
                        size={30}
                        src={profileImage || ""}
                        onClick={() => router.push("/profile")}
                    />
                </ActionIcon> */}
            </div>
        </div>



    );
}
