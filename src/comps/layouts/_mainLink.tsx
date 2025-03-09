import React, { useEffect, useState } from "react";
import {
    IconUser,
    IconLassoPolygon,
    IconAdjustmentsHorizontal,
    IconCalendar,
    IconAlignJustified,
    IconSearch,
} from "@tabler/icons-react";
import {
    ThemeIcon,
    UnstyledButton,
    Group,
    Text,
    Divider,
    useMantineTheme,
    Avatar,
    ActionIcon,
    Image,
} from "@mantine/core";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";
// import { useTranslation } from "next-i18next";
import { useLocalStorage, useMediaQuery } from "@mantine/hooks";
import { IconFaceId } from "@tabler/icons-react";
//import jwt from "jsonwebtoken";
//import useCheckTokenFlags from "@/hooks/useCheckTokenFlag";
import Link from "next/link.js";

interface MainLinkProps {
    label: string;
    route: string;
}


// function ProvideLink({ label, route }: MainLinkProps) {
//     const router = useRouter();
//     const pathname = usePathname();
//     const theme = useMantineTheme();

//     const isLargerThanSms = useMediaQuery("(min-width: 768px)");

//     function changeRoute() {
//         const oldpath = pathname;
//         const newRoute = "/" + route;

//         if (oldpath === newRoute) {
//             router.reload();
//         } else {
//             router.push(`/${route}`, undefined, { shallow: true });
//         }
//     }

//     return (
//         <UnstyledButton
//             onClick={changeRoute}
//             style={{
//                 display: "flex",
//                 padding: "8px",
//                 borderRadius: "4px",
//                 color: isLargerThanSms ? '#000000' : '#000000',
//                 zIndex: isLargerThanSms ? '0' : '50',
//                 position: "relative"
//             }}
//             className="relative"
//         >
//             <div className="text-sm text-black z-50">{label}</div>
//         </UnstyledButton>
//     );
// }

function ProvideLink({ label, route }: MainLinkProps) {
    const router = useRouter();
    const pathname = usePathname();
    const isLargerThanSms = useMediaQuery("(min-width: 768px)");

    function changeRoute() {
        const oldpath = pathname;
        const newRoute = "/" + route;

        if (oldpath === newRoute) {
            router.reload();
        } else {
            router.push(`/${route}`, undefined, { shallow: true });
        }
    }

    return (
        <UnstyledButton
            onClick={changeRoute}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "12px",
                borderRadius: "4px",
                color: "#000",
                zIndex: isLargerThanSms ? "0" : "50",
                position: "relative",
                width: isLargerThanSms ? "auto" : "100%", // ทำให้เต็ม width บนมือถือ
                height: isLargerThanSms ? "auto" : "50px", // กำหนดความสูงในมือถือ
                fontSize: isLargerThanSms ? "1rem" : "1.2rem", // ทำตัวใหญ่ขึ้น
                fontWeight: isLargerThanSms ? "normal" : "bold", // เพิ่ม font-weight
                backgroundColor: isLargerThanSms ? "transparent" : "transparent", // มี bg hover
                transition: "background-color 0.1s",
            }}
            className={`relative ${!isLargerThanSms ? "hover:bg-gray-900" : ""}`}
        >
            <div className="text-black text-sm font-semibold">{label}</div>
        </UnstyledButton>
    );
}


export function MainLinks() {
    // const { t } = useTranslation();
    const router = useRouter();
    const [token, setToken] = useLocalStorage({
        key: "authToken",
        defaultValue: "",
    });
    const [pageFlag, setPageFlag] = useState<any>({});

    const [profileImage, setProfileImage] = useState<string>("");

    const [hasToken, setHasToken] = useState(false);
    const [viewManageFlag, setViewManageFlag] = useState<boolean>(false);

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
                    <input
                        type="text"
                        placeholder="Search..."
                        className="search-bar text-xs h-full w-64 text-black relative"
                        style={{
                            padding: "5px 20px",
                            borderRadius: "10px",
                            border: "1px solid #ccc",
                            right : isLargerThanSm ? '-10' : '0'
                        }}
                    />
                </div>
            )}



            <div style={{ display: "flex", justifyContent: "center" }} className="text-black flex items-center">
                {/* profile */}

                {!isLargerThanSm && (
                    <IconSearch className="mr-2 border rounded-md p-1 w-full h-full" />
                )}

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
                />


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
