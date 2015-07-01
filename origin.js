Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

function Origin() {}
Origin.prototype.construct = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
}
