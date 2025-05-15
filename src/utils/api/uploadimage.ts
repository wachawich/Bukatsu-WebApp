
import { sendDataApi } from '@/utils/callAPI';

  export const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await sendDataApi('PUT', 'image.upload', formData);
    return response;
  };



