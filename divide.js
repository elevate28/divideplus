Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

function Origin() {}
Origin.prototype.construct = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
}

function Divide(v, a, b) {
    this[-1] = typeof a == "undefined" ? new Origin() : a;
    this[0] = typeof v == "undefined" ? new Origin() : v;
    this[1] = typeof b == "undefined" ? new Origin() : b;
}

// Construct Function
// Can be used to reconstruct the instance into a new object

Divide.prototype.construct = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
};

// Statistical Functions

Divide.prototype.size = function (f) {
    var size = 0;
    if (this[-1] instanceof Divide) {
        size++;
    }
    if (this[1] instanceof Divide) {
        size++;
    }
    if (typeof f == "function") {
        f.call(this, size);
    }
    return size;
}

Divide.prototype.contains = function (object, f) {
    var contains = 0;
    if (this[-1] == object) {
        contains++;
    }
    if (this[1] == object) {
        contains++;
    }
    if (this[-1] instanceof Divide) {
        contains += this[-1].contains(object, f);
    }
    if (this[1] instanceof Divide) {
        contains += this[1].contains(object, f);
    }
    if (typeof f == "function") {
        f.call(this, contains);
    }
    return contains;
}

Divide.prototype.empty = function (f) {
    var empty = 0;
    if (this[-1] instanceof Divide) {
        empty += this[-1].empty(f);
    } else {
        empty++;
    }
    if (this[1] instanceof Divide) {
        empty += this[1].empty(f);
    } else {
        empty++;
    }
    if (typeof f == "function") {
        f.call(this, empty);
    }
    return empty;
}

Divide.prototype.full = function (f) {
    var full = 0;
    if (this[-1] instanceof Divide) {
        full += 1 + this[-1].full(f);
    }
    if (this[1] instanceof Divide) {
        full += 1 + this[1].full(f);
    }
    if (typeof f == "function") {
        f.call(this, full);
    }
    return full;
}

Divide.prototype.capacity = function (f) {
    var capacity = 2;
    if (this[-1] instanceof Divide) {
        capacity += this[-1].capacity(f);
    }
    if (this[1] instanceof Divide) {
        capacity += this[1].capacity(f);
    }
    if (typeof f == "function") {
        f.call(this, capacity);
    }
    return capacity;
}

Divide.prototype.depth = function (f) {
    var d0 = 1,
        d1 = 1;
    if (this[-1] instanceof Divide) {
        d0 += this[-1].depth(f);
    }
    if (this[1] instanceof Divide) {
        d0 += this[1].depth(f);
    }
    if (typeof f == "function") {
        f.call(this, d0 > d1 ? d0 : d1);
    }
    return d0 > d1 ? d0 : d1;
}

// Operative Functions

Divide.prototype.accept = function (object, f) {
    if (typeof object == "undefined") {
        object = new Origin();
    }
    if (!(object instanceof Divide || object instanceof Origin)) {
        throw "IncompatibleObjectType";;
    }
    var self = new Divide(this[0], this[-1], this[1]);
    this.construct(Divide, undefined, self, object);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
}

Divide.prototype.take = function (object, f) {
    if (typeof object == "undefined") {
        object = new Origin();
    }
    if (!(object instanceof Divide || object instanceof Origin)) {
        throw "IncompatibleObjectType";;
    }
    if (this.empty() == 0) {
        return this.accept(object, f);
    }
    var size = this.size();
    if (size == 0) {
        this[-1] = object;
        if (typeof f == "function") {
            f.call(this, this);
        }
        return this;
    }
    if (size == 1) {
        this[(this[-1] instanceof Origin) ? 0 : 1] = object;
        if (typeof f == "function") {
            f.call(this, this);
        }
        return this;
    }
    if (this[-1].empty() > 0) {
        return this[-1].take(object, f);
    }
    return this[1].take(object, f);
}

Divide.prototype.drop = function (steps, a, b, f) {
    var o = this;
    a = a ? 1 : 0;
    b = b ? 1 : 0;
    var c = i & 1 ? a : b;
    for (var i = 0; i < q; i++) {
        if (typeof f == "function") {
            f.call(this, o);
        }
        if (o[c] instanceof Origin) {
            o[c].construct(Divide);
        }
        o = o[c];
    };
    this.construct(Divide, o[-1], o[1]);
    return this;
}

Divide.prototype.flip = function (f) {
    var self = new Divide(this[0], this[-1], this[1]);
    this.construct(Divide, this[0], this[1], this[-1]);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
}

Divide.prototype.walk = function (path, length, steps, f) {
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
    bit = bit == 0 ? -1 : bit;
    if (steps == 0) {
        return this;
    }
    if (this[bit] instanceof Origin) {
        this[bit].construct(Divide);
    }
    return this[bit].walk(path, length, steps - 1, f);
}

// Short-hand Origin
var _ = {};
_._ = function (v, a, b) {
    return new Divide(v, a, b);
};
