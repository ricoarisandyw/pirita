export const FileUtils = {
  blobToBase64: async (blobUrl: string) =>
    new Promise((resolve) => {
      fetch(blobUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onload = () => {
            if (fileReader.result && typeof fileReader.result === 'string') {
              const base64 = fileReader.result;
              resolve(base64);
            }
          };
        });
    }),
  fileToBase64: async (file: string): Promise<string> =>
    new Promise((resolve) => {
      fetch(file)
        .then((r) => r.blob())
        .then((blob) => {
          const fileReader = new FileReader();
          fileReader.readAsDataURL(blob);
          fileReader.onload = () => {
            if (fileReader.result && typeof fileReader.result === 'string') {
              const base64 = fileReader.result;
              resolve(base64);
            }
          };
        });
    }),
  base64ToBlob: async (base64: string) => {
    const blob = await fetch(base64).then((res) => res.blob());
    return URL.createObjectURL(blob);
  },
  getBase64SizeInKb: (base64: string) => {
    const stringLength = base64.length - 'data:image/png;base64,'.length;

    const sizeInBytes = 4 * Math.ceil(stringLength / 3) * 0.5624896334383812;
    const sizeInKb = sizeInBytes / 1000;
    return sizeInKb;
  },
  downloadCSV: (csv: string) => {
    const uri = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
    const link = document.createElement('a');
    link.setAttribute('href', uri);
    link.setAttribute('download', 'ssic.csv');
    link.click();
  }
};
