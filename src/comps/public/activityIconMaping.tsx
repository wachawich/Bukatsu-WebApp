import {
    IconHandStop,        // ใช้แทน กิจกรรมอาสา (สื่อถึงการช่วยเหลือ)
    IconBuildingArch,    // ใช้แทน Open House
    IconTools,           // ใช้แทน กิจกรรมคณะวิศวะ
    IconAtom,            // ใช้แทน กิจกรรมคณะวิทย์
    IconSchool,          // ใช้แทน กิจกรรมคณะครุ
    IconPalette,         // ใช้แทน กิจกรรมคณะศิลป์
    IconPresentation,    // ใช้แทน อบรม
    IconTrophy,          // ใช้แทน ประกวด
    IconMicrophone,      // ใช้แทน สัมมนา
    IconBeach,           // ใช้แทน สันทนาการ
    IconUsersGroup,      // ใช้แทน ชมรม
    IconBook2            // ใช้แทน กิจกรรมวิชาการ
  } from '@tabler/icons-react';
  
  const iconSize: number = 20;
  
  const activityIconMap: Record<number, JSX.Element> = {
    1: <IconHandStop size={iconSize} color="#4CAF50" />,      // กิจกรรมอาสา
    2: <IconBuildingArch size={iconSize} color="#2196F3" />,  // Open House
    3: <IconTools size={iconSize} color="#FF9800" />,         // วิศวะ
    4: <IconAtom size={iconSize} color="#9C27B0" />,          // วิทย์
    5: <IconSchool size={iconSize} color="#3F51B5" />,        // ครุ
    6: <IconPalette size={iconSize} color="#E91E63" />,       // ศิลป์
    7: <IconPresentation size={iconSize} color="#009688"/>,   // อบรม
    8: <IconTrophy size={iconSize} color="#FFC107" />,        // ประกวด
    9: <IconMicrophone size={iconSize} color="#673AB7"/>,     // สัมมนา
    10: <IconBeach size={iconSize} color="#03A9F4"/>,         // สันทนาการ
    11: <IconUsersGroup size={iconSize} color="#00BCD4"/>,    // ชมรม
    12: <IconBook2 size={iconSize} color="#FF5722" />         // กิจกรรมวิชาการ
  };
  
  export default activityIconMap;
  