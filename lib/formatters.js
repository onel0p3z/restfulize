/*restful formatters*/
module.exports = function restfulFormatters(tables, req, res, errorHandler){
    var self = this;
    var $sanitize = require('validator');
    this.onError = function(status, code, msg){ return errorHandler.error(status, code, msg) };

    this.$init = function(){};

    this.$init(); //initializer

    return {
        json: function(str){
            return JSON.parse(str);
        },
        boolean: function(str){
            str = (str+'').toLowerCase();
            var bol = false;
            if(str==='true' || str==='yes' || str==='1') bol = true;
            return bol;
        },
        date: function(str){
            if(str===null && str===undefined) str='';
            str = $sanitize.trim(str);
            if(str!=='') str = Date.parse(str);
            return str;
        },
        lowercase: function(str){
            return (str+'').toLowerCase();
        },
        uppercase: function(str){
            return (str+'').toUpperCase();
        }
    };
};