import ImagePicker from 'react-native-image-crop-picker';
import { Platform } from 'react-native';

export type PickedImage = {
  uri: string;
  fileName: string;
  type: string; // mime
  path: string;
  exif?: any;
};

const guessMime = (path: string) => {
  const lower = path.toLowerCase();
  if (lower.endsWith('.png')) return 'image/png';
  if (lower.endsWith('.heic')) return 'image/heic';
  if (lower.endsWith('.heif')) return 'image/heif';
  if (lower.endsWith('.webp')) return 'image/webp';
  return 'image/jpeg';
};

const ensureFileName = (filename?: string, path?: string) => {
  const fromPath = path?.split('/').pop() || '';
  const name = filename || fromPath || `photo_${Date.now()}.jpg`;
  if (/\.(jpe?g|png|heic|heif|webp)$/i.test(name)) return name;
  const mime = guessMime(path || name);
  const ext = mime.split('/')[1].replace('jpeg', 'jpg');
  return `${name}.${ext}`;
};

export const useImagePicker = () => {
  const pickImages = async (
    multiple = false,
    maxCount = 1,
  ): Promise<PickedImage[]> => {
    try {
      const ios = Platform.OS === 'ios';
      const images = await ImagePicker.openPicker({
        multiple,
        mediaType: 'photo',
        includeExif: ios ? true : false,
        ...(ios ? { forceJpg: true } : {}),
        compressImageQuality: 1,
        maxFiles: maxCount,
        writeTempFile: false,
      });

      const arr = Array.isArray(images) ? images : [images];

      return arr.map(img => {
        const path = img.path;
        const uri = path.startsWith('file://') ? path : `file://${path}`;
        const type = guessMime(path);
        const fileName = ensureFileName(img.filename, path);

        return {
          uri,
          fileName,
          type,
          path,
          exif: Platform.OS === 'ios' ? img.exif ?? null : null,
        };
      });
    } catch (e) {
      console.warn('이미지 선택 실패:', e);
      return [];
    }
  };

  const takePhoto = async (): Promise<PickedImage | null> => {
    try {
      const ios = Platform.OS === 'ios';
      const photo = await ImagePicker.openCamera({
        includeExif: ios ? true : false,
        ...(ios ? { forceJpg: true } : {}),
        compressImageQuality: 1,
        cropping: false,
        mediaType: 'photo',
        useFrontCamera: false,
      });

      const path = photo.path;
      const uri = path.startsWith('file://') ? path : `file://${path}`;
      const type = guessMime(path);
      const fileName = ensureFileName(photo.filename, path);

      return {
        uri,
        fileName,
        type,
        path,
        exif: Platform.OS === 'ios' ? photo.exif ?? null : null,
      };
    } catch (e) {
      console.warn('카메라 촬영 실패:', e);
      return null;
    }
  };

  return { pickImages, takePhoto };
};
