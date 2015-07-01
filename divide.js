Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

function Constructor() {}
Constructor.prototype.construct = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
}

function Map(v, a, b) {
    this[0] = typeof a == "undefined" ? new Constructor() : a;
    this[1] = typeof b == "undefined" ? new Constructor() : b;
    this.value = v;
}

// Construct Function
// Can be used to reconstruct the instance into a new object

Map.prototype.construct = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
};

// Statistical Functions

Map.prototype.size = function (f) {
    var size = 0;
    if (typeof this[0] != "undefined") {
        size = size + 1;
    }
    if (typeof this[1] != "undefined") {
        size = size + 1;
    }
    if (typeof f == "function") {
        f.call(this, size);
    }
    return size;
}

Map.prototype.contains = function (object, f) {
    var contains = 0;
    if (this[0] == object) {
        contains++;
    }
    if (this[1] == object) {
        contains++;
    }
    if (this[0] instanceof Map) {
        contains = contains + this[0].contains(object, f);
    }
    if (this[1] instanceof Map) {
        contains = contains + this[1].contains(object, f);
    }
    if (typeof f == "function") {
        f.call(this, contains);
    }
    return contains;
}

Map.prototype.empty = function (f) {
    var empty = 0;
    if (!(this[0] instanceof Constructor)) {
        empty = empty + (this[0] instanceof Map ? this[0].empty(f) : 0);
    } else {
        empty++;
    }
    if (!(this[1] instanceof Constructor)) {
        empty = empty + (this[1] instanceof Map ? this[1].empty(f) : 0);
    } else {
        empty++;
    }
    if (typeof f == "function") {
        f.call(this, empty);
    }
    return empty;
}

Map.prototype.full = function (f) {
    var full = 0;
    if (!(this[0] instanceof Constructor)) {
        full = full + (this[0] instanceof Map ? this[0].full(f) : 1);
    }
    if (!(this[1] instanceof Constructor)) {
        full = full + (this[1] instanceof Map ? this[1].full(f) : 1);
    }
    if (typeof f == "function") {
        f.call(this, full);
    }
    return full;
}

Map.prototype.capacity = function (f) {
    var capacity = 2;
    if (!(this[0] instanceof Constructor)) {
        capacity = capacity + (this[0] instanceof Map ? this[0].capacity(f) : 0);
    }
    if (!(this[1] instanceof Constructor)) {
        capacity = capacity + (this[1] instanceof Map ? this[1].capacity(f) : 0);
    }
    if (typeof f == "function") {
        f.call(this, capacity);
    }
    return capacity;
}

Map.prototype.depth = function (f) {
    var d0 = 1,
        d1 = 1;
    if (!(this[0] instanceof Constructor)) {
        d0 = d0 + (this[0] instanceof Map ? this[0].depth(f) : 0);
    }
    if (!(this[1] instanceof Constructor)) {
        d1 = d1 + (this[1] instanceof Map ? this[1].depth(f) : 0);
    }
    if (typeof f == "function") {
        f.call(this, d0 > d1 ? d0 : d1);
    }
    return d0 > d1 ? d0 : d1;
}

// Operative Functions

Map.prototype.accept = function (object, f) {
    if (typeof object == "undefined") {
        object = new Constructor();
    }
    var self = new Map(this.value, this[0], this[1]);
    this.construct(Map, undefined, self, object);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
}

Map.prototype.take = function (object, f) {
    if (typeof object == "undefined") {
        object = new Constructor();
    }
    if (this.empty() == 0) {
        return this.accept(object, f);
    }
    var size = this.size();
    if (size == 0) {
        this[0] = object;
        if (typeof f == "function") {
            f.call(this, this);
        }
        return this;
    }
    if (size == 1) {
        this[(this[0] instanceof Constructor) ? 0 : 1] = object;
        if (typeof f == "function") {
            f.call(this, this);
        }
        return this;
    }
    if (this[0].empty() > 0) {
        return this[0].take(object, f);
    }
    return this[1].take(object, f);
}

Map.prototype.drop = function (steps, a, b, f) {
    var o = this;
    a = a ? 1 : 0;
    b = b ? 1 : 0;
    var c = i & 1 ? a : b;
    for (var i = 0; i < q; i++) {
        if (typeof f == "function") {
            f.call(this, o);
        }
        if (!(o[c] instanceof Map)) {
            break;
        }
        o = o[c];
    };
    this.construct(Map, o[0], o[1]);
    return this;
}

Map.prototype.flip = function (f) {
    var self = new Map(this.value, this[0], this[1]);
    this.construct(Map, this.value, this[1], this[0]);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
}

Map.prototype.walk = function (path, length, steps, f) {
    if (typeof f == "function") {
        f.call(this, this, path, length, steps);
    }
    if (typeof path == "number") {
        var bit = path & 1;
        path = path >> 1;
        if (bit) {
            path = path + Math.pow(2, length - 1);
        }
    } else if (Array.isArray(path)) {
        var bit = path.shift();
        path.push(bit ? bit : 0);
    } else {
        throw "UnknownPathType";
    }
    if (steps == 0) {
        return this;
    }
    return this[bit].walk(path, length, steps - 1, f);
}

// Short-hand Constructor

function _2(v, a, b) {
    return new Map(v, a, b);
};
