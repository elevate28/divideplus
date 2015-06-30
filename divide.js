function Zero() {}

Zero.prototype.increase = function (i) {
    if (!(i instanceof Zero) && !(i instanceof One) && !(i instanceof Two)) {
        i = new One(i);
    }
    return i;
}

Zero.prototype.decrease = function () {
    return this;
}


function One(i) {
    if (typeof i == "undefined") {
        i = new Zero();
    }
    this[0] = i;
}

One.prototype.increase = function (i) {
    if (!(i instanceof Zero) && !(i instanceof One) && !(i instanceof Two)) {
        i = new One(o);
    }
    return new Two(this, i);
}

One.prototype.decrease = function () {
    return new Zero();
}


function Two(o, i) {
    this[0] = o;
    this[1] = i;
}

Two.prototype.increase = function (i) {
    if (!(i instanceof Zero) && !(i instanceof One) && !(i instanceof Two)) {
        i = new One(o);
    }
    return new Two(this, i);
}

Two.prototype.decrease = function (q) {
    var o = this;
    for (var i = 0; i < q; i++) {
        if (typeof o == "undefined") {
            return new Zero();
        }
        o = o[0];
    };
    return o;
}

function _0() {
    return new Zero();
};

function _1(o) {
    return new One(o);
};

function _2(o, i) {
    return new Two(o, i);
};
