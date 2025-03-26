type Header = {
  [key: string]: string;
};

export const headerGenerator = (headers: Header[]) => {
  const ret: any = {
    "Content-Type": "application/json",
  };

  headers.forEach((header) => {
    Object.keys(header).forEach((key) => {
      ret[key] = header[key];
    });
  });

  return ret;
};
