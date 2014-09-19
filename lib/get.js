var $restfulRequest = require('./request');
var $restfulActions = require('./actions');
var $errors = require('./errors');

var $restfulSqlString = require('./sql-string');
var $sql = require('./mysql');
var _ = require('underscore');
var $extend = require('extend');

module.exports = function restfulGet(req,res,errorHandler){
    var self = this;
    this.errorHandler = errorHandler;

    this.$init = function(){
        if(!self.errorHandler) self.errorHandler = new $errors(req,res);
    };

    this.build = function(tables, o, onComplete, onError){
        if(!onComplete) onComplete = function(resp, obj){ res.send(resp); };
        if(!onError) onError = function(resp, obj){
            self.errorHandler.error(404, 100, 'Record was not found.');
            return self.errorHandler.response();
        };

        var restfulRequest = new $restfulRequest(tables, req, res, self.errorHandler);
        var obj = restfulRequest.GET(o);
        if(obj==false) return self.errorHandler.response();

        var restfulSqlString = new $restfulSqlString();

        var strSQL = restfulSqlString.select(obj);

        var response = {};

        var restfulActions = new $restfulActions(tables, req, res, self.errorHandler);

        if(obj.validators){
            response = restfulActions.getValidators(obj,response);
        }

        $sql.connect().then(function(connection){
            connection.execute(strSQL).then(function(rows) {
                if(rows.length>0){
                    connection.release();
                    if(_.isEmpty(response)){
                        response = restfulActions.formatResponse(obj,rows[0]);

                    }else{
                        response.data = restfulActions.formatResponse(obj,rows[0]);
                    }
                    return onComplete(response,obj);
                }else{
                    /*
                    * Cloning and removing "auth" filter to check if record exists
                    * */
                    var objTemp = $extend(true, {}, obj);
                    delete objTemp._auth;
                    var strSQL = restfulSqlString.exist(objTemp);
                    connection.execute(strSQL).then(function(rows) {
                        connection.release();
                        if(rows.length>0){
                            self.errorHandler.error(403, 100, 'This record is forbidden.');
                            return self.errorHandler.response();
                        }else{
                            return onError(rows,obj);
                        }
                        return onComplete(response,obj);
                    });
                }

            });
        });
        return true;
    };

    this.$init();
}