declare module 'react-native-exif-metadata' {
  const Exif: {
    getExif: (path: string) => Promise<any>;
  };
  export default Exif;
}
