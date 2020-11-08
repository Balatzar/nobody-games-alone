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

const mergeComplexObjects = (rows, prefix, newColumn) => {
  const findAssociatedFields = RegExp(`^${prefix}`);

  return Object.values(
    rows.reduce((acc, row) => {
      const associatedObject = Object.keys(row)
        .filter((key) => findAssociatedFields.test(key))
        .reduce((accc, key) => {
          accc[key.replace(findAssociatedFields, "")] = row[key];
          delete row[key];
          return accc;
        }, {});
      if (acc[row.id]) {
        acc[row.id][newColumn].push(associatedObject);
      } else {
        acc[row.id] = { ...row, [newColumn]: [associatedObject] };
      }
      return acc;
    }, {})
  );
};

const fetcher = (...args) => fetch(...args).then((res) => res.json());

const prepareTimeslots = (timeslots, title = "", titleIsUsername = false) => {
  return timeslots.map(({ start_time, end_time, id, username }) => ({
    start: new Date(start_time),
    end: new Date(end_time),
    id,
    username,
    title: titleIsUsername ? username : title,
  }));
};

export { mergeObjects, fetcher, prepareTimeslots, mergeComplexObjects };
