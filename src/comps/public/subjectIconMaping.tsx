import {
  IconMathSymbols,
  IconAtom,
  IconLanguage,
  IconAlphabetLatin,
  IconRun,
  IconGlobe,
  IconPalette,
  IconHammer,
  IconSchool,
  IconHistory,
  IconRosette,
  IconDeviceLaptop,
  IconHeartRateMonitor,
  IconStretching,
  IconDna,
  IconMusic,
  IconMask,
  IconAlphabetGreek,
  IconBrandTaobao,
  IconLanguageKatakana
  
} from '@tabler/icons-react';

const iconSize : number = 20;

const subjectIconMap: Record<any, JSX.Element> = {
  1: <IconMathSymbols size={iconSize} color="#0066CC" />,             // คณิตศาสตร์
  2: <IconAtom size={iconSize} color="#FF5722" />,                    // วิทยาศาสตร์ (ชีวะ เคมี ฟิสิกส์ ดาราศาสตร์)
  3: <IconLanguage size={iconSize} color="#009688" />,                // ภาษาไทย
  4: <IconAlphabetLatin size={iconSize} color="#673AB7" />,           // ภาษาอังกฤษ 
  5: <IconGlobe size={iconSize} color="#4CAF50" />,                   // สังคมศึกษา
  6: <IconRun size={iconSize} color="#00BCD4" />,                     // พลศึกษา เน้นเรื่องสุขภาพ ร่างกาย การออกกำลังกาย และการดูแลตนเอง  
  7: <IconPalette size={iconSize} color="#E91E63" />,                 // ศิลปะ 
  8: <IconHammer size={iconSize} color="#795548" />,                  // การงานอาชีพ
  9: <IconSchool size={iconSize} color="#3F51B5" />,                  // แนะแนว
 10: <IconHistory size={iconSize} color="#795548" />,                 // ประวัติศาสตร์
 11: <IconRosette size={iconSize} color="#FF9800" />,                 // พระพุทธศาสนา
 12: <IconDeviceLaptop size={iconSize} color="#2196F3" />,           // คอมพิวเตอร์
 13: <IconHeartRateMonitor size={iconSize} color="#F44336" />,        // สุขศึกษา                                                   
 14: <IconStretching size={iconSize} color="#00BCD4" />,        // พลศึกษา เน้นการออกกำลังกาย กีฬาพื้นฐาน และกิจกรรมทางกาย 
 15: <IconDna size={iconSize} color="#009688" />,                     // วิทย์พื้นฐานในชีวิตประจำวัน                                                                                
 16: <IconMusic size={iconSize} color="#E91E63" />,                   // ดนตรี
 17: <IconMask size={iconSize} color="#9C27B0" />,                    // นาฏศิลป์
 18: <IconAlphabetGreek size={iconSize} color="#3F51B5" />,          // ภาษาญี่ปุ่น (ใช้ Greek แทน ถ้าไม่มี icon ญี่ปุ่น)
 19: <IconBrandTaobao size={iconSize} color="#FF5722" />,            // ภาษาจีน
 20: <IconLanguageKatakana size={iconSize} color="#9C27B0" />,       // ภาษาฝรั่งเศส (ใช้ Katakana แทน)

};
export default subjectIconMap;
