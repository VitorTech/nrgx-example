export const removeDuplicates = (array: any, key: any) => {
    return array.reduce((arr: any, item: any) => {
      const removed = arr.filter((i: any) => i[key] !== item[key]);
      return [...removed, item];
    }, []);
  };