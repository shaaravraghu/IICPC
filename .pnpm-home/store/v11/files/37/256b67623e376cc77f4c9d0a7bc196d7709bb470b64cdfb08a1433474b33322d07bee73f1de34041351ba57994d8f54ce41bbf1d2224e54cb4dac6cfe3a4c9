var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);

// <define:__CLERK_UI_SUPPORTED_REACT_BOUNDS__>
var define_CLERK_UI_SUPPORTED_REACT_BOUNDS_default = [[18, 0, -1, 0], [19, 0, 0, 3], [19, 1, 1, 4], [19, 2, 2, 3], [19, 3, 3, 0]];

export {
  __privateGet,
  __privateAdd,
  __privateSet,
  __privateMethod,
  define_CLERK_UI_SUPPORTED_REACT_BOUNDS_default
};
//# sourceMappingURL=chunk-E5QRIS4Z.mjs.map