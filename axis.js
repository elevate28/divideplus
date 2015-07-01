Object.setPrototypeOf = Object.setPrototypeOf || function (obj, proto) {
    obj.__proto__ = proto;
    return obj;
}

Origin = Origin || function Origin() {};
Origin.prototype.become = Origin.prototype.become || function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
};

function Axis(a, b, c) {
    this[-1] = typeof a == "undefined" ? new Origin() : a;

    if (!(this[-1] instanceof Axis || this[-1] instanceof Origin)) {
        throw "IncompatibleObjectType";;
    }
    if (this[-1] instanceof Axis) {
        this[-1] = this[-1].clone();
    }

    // Middle can contain an object / value
    this[0] = typeof b == "undefined" ? new Origin() : b;

    if (this[0] instanceof Axis) {
        this[0] = this[0].clone();
    }

    this[1] = typeof c == "undefined" ? new Origin() : c;

    if (!(this[1] instanceof Axis || this[1] instanceof Origin)) {
        throw "IncompatibleObjectType";;
    }
    if (this[1] instanceof Axis) {
        this[1] = this[1].clone();
    }
}

// become Function
// Can be used to rebecome the instance into a new object

Axis.prototype.become = function (Class) {
    Object.setPrototypeOf(this, Class.prototype);
    Class.apply(this, [].slice.call(arguments, 1));
};

// Statistical Functions

Axis.prototype.size = function (f) {
    var size = 0;
    if (this[-1] instanceof Axis) {
        size++;
    }
    if (this[1] instanceof Axis) {
        size++;
    }
    if (typeof f == "function") {
        f.call(this, size);
    }
    return size;
}

Axis.prototype.contains = function (object, f) {
    var contains = 0;
    if (this[-1] == object) {
        contains++;
    }
    if (this[1] == object) {
        contains++;
    }
    if (this[-1] instanceof Axis) {
        contains += this[-1].contains(object, f);
    }
    if (this[1] instanceof Axis) {
        contains += this[1].contains(object, f);
    }
    if (typeof f == "function") {
        f.call(this, contains);
    }
    return contains;
}

Axis.prototype.empty = function (f) {
    var empty = 0;
    if (this[-1] instanceof Axis) {
        empty += this[-1].empty(f);
    } else {
        empty++;
    }
    if (this[1] instanceof Axis) {
        empty += this[1].empty(f);
    } else {
        empty++;
    }
    if (typeof f == "function") {
        f.call(this, empty);
    }
    return empty;
}

Axis.prototype.full = function (f) {
    var full = 0;
    if (this[-1] instanceof Axis) {
        full += 1 + this[-1].full(f);
    }
    if (this[1] instanceof Axis) {
        full += 1 + this[1].full(f);
    }
    if (typeof f == "function") {
        f.call(this, full);
    }
    return full;
}

Axis.prototype.capacity = function (f) {
    var capacity = 2;
    if (this[-1] instanceof Axis) {
        capacity += this[-1].capacity(f);
    }
    if (this[1] instanceof Axis) {
        capacity += this[1].capacity(f);
    }
    if (typeof f == "function") {
        f.call(this, capacity);
    }
    return capacity;
}

Axis.prototype.depth = function (f) {
    var d0 = 1,
        d1 = 1;
    if (this[-1] instanceof Axis) {
        d0 += this[-1].depth(f);
    }
    if (this[1] instanceof Axis) {
        d0 += this[1].depth(f);
    }
    if (typeof f == "function") {
        f.call(this, d0 > d1 ? d0 : d1);
    }
    return d0 > d1 ? d0 : d1;
}

Axis.prototype.clone = function (f) {
    var clone = new Map(
        this[-1] instanceof Axis ? this[-1].clone(f) : new Origin(),
        this[0] instanceof Axis ? this[0].clone(f) : (this[0] instanceof Origin ? new Origin() : this[0]),
        this[1] instanceof Axis ? this[1].clone(f) : new Origin()
    );
    if (typeof f == "function") {
        f.call(this, clone);
    };
    return clone;
}

// Operative Functions

Axis.prototype.accept = function (a, b, c, f) {
    if (a == true) {
        a = this.clone();
    }
    if (b == true) {
        b = this.clone();
    }
    if (c == true) {
        c = this.clone();
    }
    var clone = this.clone();
    this.become(Axis, a, b, c);
    if (typeof f == "function") {
        f.call(clone, this);
    }
    return this;
}

Axis.prototype.take = function (object, f) {
    if (typeof object == "undefined") {
        object = new Origin();
    }
    if (!(object instanceof Axis || object instanceof Origin)) {
        throw "IncompatibleObjectType";
    }
    if (this.empty() == 0) {
        return this.accept(object, undefined, true, f);
    }
    var clone = this.clone();
    var size = this.size();
    if (size == 0) {
        this.accept(object, this[0], this[1]);
        if (typeof f == "function") {
            f.call(clone, this);
        }
        return this;
    }
    if (size == 1) {
        this.accept(
            this[-1] instanceof Origin ? object : this[-1],
            this[0],
            this[1] instanceof Origin ? object : this[1]);
        if (typeof f == "function") {
            f.call(clone, this);
        }
        return this;
    }
    if (this[-1].empty() > 0) {
        return this[-1].take(object, f);
    }
    return this[1].take(object, f);
}

Axis.prototype.drop = function (steps, a, b, f) {
    var o = this;
    a = a ? 1 : 0;
    b = b ? 1 : 0;
    var c = i & 1 ? a : b;
    for (var i = 0; i < q; i++) {
        if (typeof f == "function") {
            f.call(this, o);
        }
        if (o[c] instanceof Origin) {
            o[c].become(Axis);
        }
        o = o[c];
    };
    this.become(Axis, o[-1], o[1]);
    return this;
}

Axis.prototype.flip = function (f) {
    var self = new Axis(this[-1], this[0], this[1]);
    this.become(Axis, this[1], this[0], this[-1]);
    if (typeof f == "function") {
        f.call(self, this);
    }
    return this;
}

Axis.prototype.walk = function (path, length, steps, f) {
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
        if (length < path.length) {
            path = path.slice(0, length);
        }
        while (path.length < length) {
            path.push(0);
        }
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
        this[bit].become(Axis);
    }
    return this[bit].walk(path, length, steps - 1, f);
}

// Short-hand Origin
var _ = {};
_._ = function (a, b, c) {
    return new Axis(a, b, c);
};
