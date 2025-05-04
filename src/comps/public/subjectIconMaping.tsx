import {
  IconMathSymbols,
  IconAtom,
  IconLanguage,
  IconAlphabetLatin,
  IconDeviceLaptop,
  IconRun,
  IconMusic,
  IconBrandTaobao,
  IconStretching
} from '@tabler/icons-react';

const iconSize : number = 20;

const subjectIconMap: Record<any, JSX.Element> = {
  1: <IconMathSymbols size={iconSize} color="#0066CC" />,            // คณิตศาสตร์
  2: <IconAtom size={iconSize} color="#FF5722" />,                     // วิทยาศาสตร์
  3: <IconLanguage size={iconSize} color="#009688" />,                // ภาษาไทย
  4: <IconAlphabetLatin size={iconSize} color="#673AB7" />,           // ภาษาอังกฤษ
  12: <IconDeviceLaptop size={iconSize} color="#2196F3" />,           // คอมพิวเตอร์
  14: <IconStretching size={iconSize} color="#009688" />,                    // พลศึกษา
  16: <IconMusic size={iconSize} color="#E91E63" />,                  // ดนตรี
  19: <IconBrandTaobao size={iconSize} color="#FF9800" />         // ภาษาจีน
};

export default subjectIconMap;
