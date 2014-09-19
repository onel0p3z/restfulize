var $restfulRequest = require('./request');
var $restfulActions = require('./actions');
var $errors = require('./errors');
var $restfulSqlString = require('./sql-string');
var $sql = require('./mysql');
var $extend = require('extend');

module.exports = function restfulUpdate(req, res, errorHandler){
    var self = this;
    this.errorHandler = errorHandler;

    this.$init = function(){
        if(!self.errorHandler) self.errorHandler = new $errors(req, res);
    };

    this.build = function(tables, o, setting, onComplete){
        if(!onComplete) onComplete = function(resp, obj){ res.send(resp); };

        var s = {
            ignoreQuery: false,
            ignoreBody: false,
            checkExist: false
        };
        s = $extend(true, s, setting || {});

        //defining query so it won't be populated by restfulRequest
        if(s.ignoreQuery && o.query===undefined) o.query = {};

        //defining body so it won't be populated by restfulRequest (mainly for internal updating)
        if(s.ignoreBody && o.body===undefined) o.body = {};

        if(o.overwrites===undefined) o.overwrites = {};
        o.overwrites.table_list = "*";

        var restfulRequest = new $restfulRequest(tables, req, res, self.errorHandler);
        var restfulActions = new $restfulActions(tables, req, res, self.errorHandler);

        /*
        * Grabbing data
        * */
        var obj = restfulRequest.PUT(o);
        if(obj===false) return self.errorHandler.response();

        /*
         * Processing data
         * */
        var actions = restfulActions.PUT(obj,restfulRequest.params);
        actions.then(function(obj){
            var restfulSqlString = new $restfulSqlString();
            var strSQL = restfulSqlString.update(obj);

            var response = {};

            $sql.connect().then(function(connection){
                connection.execute(strSQL).then(function(rows) {
                    connection.release();
                    response = {
                        "status":"success",
                        "details":{
                            "affectedRows": rows.affectedRows,
                            "changedRows": rows.changedRows,
                            "warningCount": rows.warningCount
                        }
                    };
                    onComplete(response,obj);
                });
            });

        }).fail(self.errorHandler.response);

        return true;
    };

    this.$init();
};