const mergeObjects = (objects, key) => {
  return Object.values(
    objects.reduce((acc, object) => {
      if (acc[object.id]) {
        acc[object.id][key].push(object[key]);
      } else {
        acc[object.id] = {
          ...object,
          [key]: [object[key]],
        };
      }
      return acc;
    }, {})
  );
};

export { mergeObjects };
