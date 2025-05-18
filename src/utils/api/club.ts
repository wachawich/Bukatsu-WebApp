import { fetchDataApi } from "../callAPI"
import { sendDataApi } from '@/utils/callAPI';
  // Interface สำหรับ Club
  export interface ClubItem {
    club_id: string;
    club_name: string;
    club_description: string;
    club_timestamp: string;
    club_link: string;
    club_image_path: string;
  }
  
  export interface ClubdetailProps {  
    clubId: string;
  }
  export interface Props {
    club: ClubItem;
  }

  export interface ClubImage {
    club_id: string;
    image_link: string;
  }
  
  export interface FormattedClubImage {
    id: string;
    link: string;
  }

  export interface ImageUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (file: File) => void;
  }

  export interface PRUploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onUpload: (files: { banner: File | null; square: File | null }) => void;
  }

  export interface ClubItem {
    club_id: string;
    club_name: string;
    club_description: string;
    club_timestamp: string;
    club_link: string;
    club_image_path: string;
  }

  export interface FormattedClubItem {
    id: string;
    title: string;
    detail: string;
    tag: string;
    image: string;
    link: string;
  }


  // ฟังก์ชันสำหรับดึงข้อมูล Club (ตัวอย่างฟังก์ชันที่คุณอาจจะใช้)
  export const getClub = async (clubId: string) => {
    const data = await fetchDataApi('POST', 'club.get', { club_id: clubId });
    return data;
  };


  export const getClubImages = async (): Promise<FormattedClubImage[]> => {
    const response = await fetchDataApi('POST', 'clublink.get', {});
    const data = response.data as ClubImage[];
  
    return data.map((item) => ({
      id: item.club_id,
      link: item.image_link,
    }));
  };

  export const uploadClubImage = async (file: File, clubId: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', clubId);
    const response = await sendDataApi('PUT', 'club.put', formData);
    return response;
  };

export const uploadPRImage = async (file: File, clubId: string, type: 'banner' | 'square') => {
  const formData = new FormData();
  formData.append(type, file); // ใช้ key เป็น type
  formData.append('id', clubId);
  const response = await sendDataApi('PUT', 'club.uploadPrImage', formData);
  return response;
};



