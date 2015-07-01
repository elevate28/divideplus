Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

function Constructor() {}
Constructor.prototype.construct = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
}

function Map(a, b) {
    this[0] = typeof a == "undefined" ? new Constructor() : a;
    this[1] = typeof b == "undefined" ? new Constructor() : b;
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
        full = full + (this[0] instanceof Map ? this[0].full(f) : 0);
    } else {
        full++;
    }
    if (!(this[1] instanceof Constructor)) {
        full = full + (this[1] instanceof Map ? this[1].full(f) : 0);
    } else {
        full++;
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
    var d0 = 0,
        d1 = 0;
    if (!(this[0] instanceof Constructor)) {
        d0 = (this[0] instanceof Map ? this[0].depth(f) : 0);
    }
    if (!(this[1] instanceof Constructor)) {
        d1 = (this[1] instanceof Map ? this[1].depth(f) : 0);
    }
    if (typeof f == "function") {
        f.call(this, d0 > d1 ? d0 : d1);
    }
    return d0 > d1 ? d0 : d1;
}

// Operative Functions

Map.prototype.take = function (object, f) {
    if (typeof object == "undefined") {
        object = new Constructor();
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
    var self = new Map(this[0], this[1]);
    this.construct(Map, self, object);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
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
    var self = new Map(this[0], this[1]);
    this.construct(Map, this[1], this[0]);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
}

Map.prototype.walk = function (path, length, steps, f) {
    if (typeof f == "function") {
        f.call(this, this);
    }
    var bit = path & 1;
    path = path >> 1;
    if (bit) {
        path = path + Math.pow(2, length - 1);
    }
    if (steps == 0) {
        return this;
    }
    return this[bit].walk(path, length, steps - 1, f);
}

// Short-hand Constructor

function _2(a, b) {
    return new Map(a, b);
};
