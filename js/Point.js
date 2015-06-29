function Point(_) {
    if (_ instanceof Array) {
        _.unshift(this);
    } else {
        _ = [this];
    }
    this._ = _;
    this._a = function () {
        // Fill
        var a = [].slice.call(arguments, 0);
        var b = a.splice(0, 1)[0];
        if (typeof b == "number") {
            if (a.length > 0) {
                for (var c = 0; c < a.length; c++) {
                    if (this._[b + c] == a[c]) {
                        continue;
                    }
                    if (a[c] instanceof Point) {
                        a[c]._[0] = this;
                    }
                    if (typeof a[c] != "undefined") {
                        this._[b + c] = a[c];
                    }
                }
            }
        }
        return this;
    }
    this._b = function () {
        // Navigate
        var a = [].slice.call(arguments, 0);
        if (a.length) {
            var b = a.splice(0, 1)[0];
            if (a.length) {
                if (typeof b == "number") {
                    if (this._[b] instanceof Point) {
                        return this._[b]._b(a);
                    }
                }
            }
            return this._[b];
        }
        return this;
    };
    this._c = function (a) {
        // Find Edge
        if (typeof a == "number") {
            if (typeof this._[a] == "undefined" || this._[a] == this) {
                return this;
            }
            if (this._[a] instanceof Point) {
                return this._[a]._c(a);
            }
            return this._[a];
        }
        return this;
    }
}

function P() {
    var a = [].slice.call(arguments, 0);
    return new Point(a);

}
