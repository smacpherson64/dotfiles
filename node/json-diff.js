const isNull = (obj) => obj === null;
const isUndefined = (obj) => obj === undefined;
const isNil = (obj) => isNull(obj) || isUndefined(obj);
const isObject = (obj) =>
  !isNil(obj) && typeof obj === "object" && !Array.isArray(obj);
const isEmptyObject = (obj) => isObject(obj) && JSON.stringify(obj) === "{}";
const isArray = (obj) => Array.isArray(obj);
const isString = (obj) => typeof obj === "string";
const isNumber = (obj) => typeof obj === "number";

const anyPass = (predicates) => (obj) =>
  !!predicates.find((predicate) => predicate(obj));

const labelType = (obj) => {
  if (isNull(obj)) {
    return "null";
  } else if (isUndefined(obj)) {
    return "undefined";
  } else if (isObject(obj)) {
    return "object";
  } else if (isArray(obj)) {
    return "array";
  } else if (isString(obj)) {
    return "string";
  } else if (isNumber(obj)) {
    return "number";
  } else {
    return "never";
  }
};

const getFlatSpec = (original) => {
  const results = [];

  function _flatSpec(obj, prefix = "") {
    if (isArray(obj)) {
      obj.forEach((item) => {
        _flatSpec(item, prefix ? [prefix, "[]"].join(".") : "[]");
      });
    } else if (isObject(obj)) {
      Object.entries(obj).forEach(([key, value]) => {
        _flatSpec(value, prefix ? [prefix, key].join(".") : key);
      });
    }

    results.push([prefix, labelType(obj)]);
  }

  _flatSpec(original);

  return results;
};

const getKey = ([key]) => key;

const unique = (array) => Array.from(new Set(array));

const keyDiff = (left, right) => (key) => {
  const leftKeyValue = left.find(([label]) => label === key);
  const rightKeyValue = right.find(([label]) => label === key);

  if (leftKeyValue && rightKeyValue) {
    return [
      key,
      leftKeyValue[1] === rightKeyValue[1]
        ? "same"
        : ["mismatch", [leftKeyValue[1], rightKeyValue[1]]],
    ];
  } else if (leftKeyValue) {
    return [key, "missing"];
  } else if (rightKeyValue) {
    return [key, "extra"];
  }
};

const diffFlatSpecs = (left, right) => {
  return unique([...left.map(getKey), ...right.map(getKey)])
    .map(keyDiff(left, right))
    .filter(([, value]) => value !== "same");
};

const diffObjSpecs = (left, right) => {
  const leftSpec = getFlatSpec(
    typeof left === "string" ? JSON.parse(left) : left
  );
  const rightSpec = getFlatSpec(
    typeof right === "string" ? JSON.parse(right) : right
  );

  return diffFlatSpecs(leftSpec, rightSpec);
};

module.exports = {
  getFlatSpec,
  diffObjSpecs,
};
