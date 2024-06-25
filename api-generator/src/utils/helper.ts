const onArrayForm = (
  name: string,
  data: any,
  obj: {
    label: string;
    value: string;
  }[]
) => {
  let newObj = [...obj];
  for (const key in data) {
    if (
      (Array.isArray(data[key]) || typeof data[key] === "object") &&
      !(data[key] instanceof File)
    ) {
      newObj = onArrayForm(`${name}[${key}]`, data[key], newObj);
    } else {
      newObj = [...newObj, { label: `${name}[${key}]`, value: data[key] }];
    }
  }
  return newObj;
};

export const expandJSON = (data: any) => {
  let obj: {
    label: string;
    value: string;
  }[] = [];
  for (const key in data) {
    if (
      Array.isArray(data[key]) ||
      (typeof data[key] === "object" && !(data[key] instanceof File))
    ) {
      obj = onArrayForm(`${key}`, data[key], obj);
    } else {
      obj = [
        ...obj,
        {
          label: key,
          value: data[key],
        },
      ];
    }
  }
  return obj;
};
