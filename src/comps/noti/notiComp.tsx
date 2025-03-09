import { notifications } from "@mantine/notifications";
import { useEffect } from "react";

const greenColor = "#2F9E44";
const greenDarkColor = "#2B8A3E";
const redColor = "#E03131";
const redDarkColor = "#C92A2A";
const msgFontSize = "18px";

// For Event
export function ShowNoti(props: any) {
    const notiColor = props.response === "success" ? greenColor : redColor;
    const notiHoverColor =
        props.response === "success" ? greenDarkColor : redDarkColor;

    notifications.show({
        title: props.title,
        message: props.message,
        autoClose: 10000,
        styles: (theme) => ({
            root: {
                backgroundColor: notiColor,
                borderColor: notiColor,
                "&::before": { backgroundColor: theme.white },
                paddingTop: 35,
                paddingBottom: 35,
            },
            title: { color: theme.white },
            description: { color: theme.white, fontSize: msgFontSize },
            closeButton: {
                color: theme.white,
                "&:hover": { backgroundColor: notiHoverColor },
            },
        }),
    });
}

// For Component
export function ShowNotiComp(props: any) {
    const notiColor = props.response === "success" ? greenColor : redColor;
    const notiHoverColor =
        props.response === "success" ? greenDarkColor : redDarkColor;

    useEffect(() => {
        notifications.show({
            title: props.title,
            message: props.message,
            styles: (theme) => ({
                root: {
                    backgroundColor: notiColor,
                    borderColor: notiColor,
                    "&::before": { backgroundColor: theme.white },
                    paddingTop: 35,
                    paddingBottom: 35,
                },
                title: { color: theme.white },
                description: { color: theme.white },
                closeButton: {
                    color: theme.white,
                    "&:hover": { backgroundColor: notiHoverColor },
                },
            }),
        });
    }, []);
}
