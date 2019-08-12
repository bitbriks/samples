function lpad(str, size) {
    str = "" + str;
    return new Array(size - str.length + 1).join('0') + str;
}
/**
 * Replacer function for JSON.stringify, serializes Date objects to UTC
 * datetime in the OpenERP Server format.
 *
 * However, if a serialized value has a toJSON method that method is called
 * *before* the replacer is invoked. Date#toJSON exists, and thus the value
 * passed to the replacer is a string, the original Date has to be fetched
 * on the parent object (which is provided as the replacer's context).
 *
 * @param {String} k
 * @param {Object} v
 * @returns {Object}
 */
function date_to_utc (k, v) {
    var value = this[k];
    if (!(value instanceof Date)) { return v; }

    return datetime_to_str(value);
}

/**
 * Converts a Date javascript object to a string using OpenERP's
 * datetime string format (exemple: '2011-12-01 15:12:35').
 * 
 * The time zone of the Date object is assumed to be the one of the
 * browser and it will be converted to UTC (standard for OpenERP 6.1).
 * 
 * @param {Date} obj
 * @returns {String} A string representing a datetime.
 */
function datetime_to_str (obj) {
    if (!obj) {
        return false;
    }
    return lpad(obj.getUTCFullYear(),4) + "-" + lpad(obj.getUTCMonth() + 1,2) + "-"
         + lpad(obj.getUTCDate(),2) + " " + lpad(obj.getUTCHours(),2) + ":"
         + lpad(obj.getUTCMinutes(),2) + ":" + lpad(obj.getUTCSeconds(),2);
}


class Rpc {

    /**
     * Helper method, generates a string to describe a ordered by sequence for
     * SQL.
     *
     * For example, [{name: 'foo'}, {name: 'bar', asc: false}] will
     * be converted into 'foo ASC, bar DESC'
     *
     * @param {Object[]} orderBy list of objects {name:..., [asc: ...]}
     * @returns {string}
     */
    _serializeSort(orderBy) {
        return orderBy.map(order => order.name + (order.asc !== false ? ' ASC' : ' DESC')).join(', ');
    }

    _buildQuery(options) {
        var route;
        var params = options.params || {};
        if (options.route) {
            route = options.route;
        } else if (options.model && options.method) {
            route = '/web/dataset/call_kw/' + options.model + '/' + options.method;
        }
        if (options.method) {
            params.args = options.args || [];
            params.model = options.model;
            params.method = options.method;
            params.kwargs = Object.assign(params.kwargs || {}, options.kwargs);
            params.kwargs.context = options.context || params.context || params.kwargs.context;
        }

        if (options.method === 'read_group') {
            if (!(params.args && params.args[0] !== undefined)) {
                params.kwargs.domain = options.domain || params.domain || params.kwargs.domain || [];
            }
            if (!(params.args && params.args[1] !== undefined)) {
                params.kwargs.fields = options.fields || params.fields || params.kwargs.fields || [];
            }
            if (!(params.args && params.args[2] !== undefined)) {
                params.kwargs.groupby = options.groupBy || params.groupBy || params.kwargs.groupby || [];
            }
            params.kwargs.offset = options.offset || params.offset || params.kwargs.offset;
            params.kwargs.limit = options.limit || params.limit || params.kwargs.limit;
            // In kwargs, we look for "orderby" rather than "orderBy" (note the absence of capital B),
            // since the Python argument to the actual function is "orderby".
            var orderBy = options.orderBy || params.orderBy || params.kwargs.orderby;
            params.kwargs.orderby = orderBy ? this._serializeSort(orderBy) : orderBy;
            params.kwargs.lazy = 'lazy' in options ? options.lazy : params.lazy;
        }

        if (options.method === 'search_read') {
            // call the model method
            params.kwargs.domain = options.domain || params.domain || params.kwargs.domain;
            params.kwargs.fields = options.fields || params.fields || params.kwargs.fields;
            params.kwargs.offset = options.offset || params.offset || params.kwargs.offset;
            params.kwargs.limit = options.limit || params.limit || params.kwargs.limit;
            // In kwargs, we look for "order" rather than "orderBy" since the Python
            // argument to the actual function is "order".
            var orderBy = options.orderBy || params.orderBy || params.kwargs.order;
            params.kwargs.order = orderBy ? this._serializeSort(orderBy) : orderBy;
        }

        if (options.route === '/web/dataset/search_read') {
            // specifically call the controller
            params.model = options.model || params.model;
            params.domain = options.domain || params.domain;
            params.fields = options.fields || params.fields;
            params.limit = options.limit || params.limit;
            params.offset = options.offset || params.offset;
            var orderBy = options.orderBy || params.orderBy;
            params.sort = orderBy ? this._serializeSort(orderBy) : orderBy;
            params.context = options.context || params.context || {};
        }

        return {
            route: route,
            params: JSON.parse(JSON.stringify(params)),
        };
    }

    query(params, options) {
        let query = this._buildQuery(params),
            id = Math.floor(Math.random() * 1000 * 1000 * 1000),
            data = {
                jsonrpc: "2.0",
                method: 'call',
                params: query.params,
                id: id
            },
            payload = {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data, date_to_utc)
            };
        console.log(query);
        payload = Object.assign(Object.assign({}, options), payload);
        return new Promise((resolve, reject) => {
            fetch(query.route, payload).then(res => res.json()).then(jsonRes => {
                console.log(jsonRes);
                if (jsonRes.error) {
                    reject(jsonRes.error);
                }
                else {
                    resolve(jsonRes.result);
                }
            }).catch(reject);

        });
    }
}