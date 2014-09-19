
/*restful validators*/
module.exports = function restfulValidators(tables, req, res, errorHandler){
    var self = this;
    this.onError = function(status, code, msg, field){ return errorHandler.error(status, code, msg, field) };

    this.$init = function(){

    };

    this.$init(); //initializer

    var validators = {
        min: {
            define: function(min){
                return {min:min};
            },
            validate: function(field,str,min){
                if(str.length>=parseInt(min)){
                    return true;
                }else{
                    return self.onError(400,100, 'Minimum length is '+min+'.',field);
                }
            }
        },
        max: {
            define: function(max){
                return {max:max};
            },
            validate: function(field,str,max){
                if(str.length<=parseInt(max)){
                    return true;
                }else{
                    return self.onError(400,100, 'Maximum length is '+max+'.',field);
                }
            }
        },
        numeric: {
            pattern:{
                regex: /^\d+$/,
                message: "Invalid number format."
            },
            define: function(){
                var pattern = $patternToString(validators.numeric.pattern.regex);
                return {
                    pattern: pattern,
                    patternErrorMessage: validators.numeric.pattern.message
                };
            },
            validate: function(field,str){
                var reg = validators.numeric.pattern.regex;
                if(reg.test(str)){
                    return true;
                }else{
                    return self.onError(400,100,validators.numeric.pattern.message, field);
                }
            }
        },
        float:{
            pattern:{
                regex: /^[-+]?[0-9]*\.?[0-9]+$/,
                message: "Invalid decimal number."
            },
            define: function(){
                var pattern = $patternToString(validators.float.pattern.regex);
                return {
                    pattern: pattern,
                    patternErrorMessage: validators.float.pattern.message
                };
            },
            validate: function(field,str){
                var reg = validators.float.pattern.regex;
                if(reg.test(str)){
                    return true;
                }else{
                    return self.onError(400,100,validators.float.pattern.message, field);
                }
            }
        },
        percentage:{
            pattern:{
                regex: /^(([0]{1}(\.\d{1,10})?)|([0-1]{1}(\.[0]{1,10})?))$/,
                message: "Invalid percentage, must be decimal value <= 1 >= 0."
            },
            define: function(){
                var pattern = $patternToString(validators.percentage.pattern.regex);
                return {
                    pattern: pattern,
                    patternErrorMessage: validators.percentage.pattern.message
                };
            },
            validate: function(field,str){
                var reg = validators.percentage.pattern.regex;
                if(reg.test(str)){
                    return true;
                }else{
                    return self.onError(400,100,validators.percentage.pattern.message, field);
                }
            }
        },
        length: {
            define: function(lng){
                return {
                    max: lng,
                    min: lng
                };
            },
            validate: function(field,str,lng,type){
                if(!type) type = "characters";
                if(str.length==parseInt(lng)){
                    return true;
                }else{
                    return self.onError(400,100, 'Must be exactly '+lng+' '+type+'.',field);
                }
            }
        },
        password:{
            pattern:{
                /*
                * contains at least 8 characters
                * contain at least 1 number
                * contain at least 1 lowercase character (a-z)
                * contain at least 1 uppercase character (A-Z)
                * contains only characters a-zA-Z0-9!@#$%^&*
                * */
                regex: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[a-zA-Z0-9!@#$%^&*]{8,}$/,
                message: "Invalid password format."
            },
            define: function(){
                var pattern = $patternToString(validators.password.pattern.regex);
                return {
                    pattern: pattern,
                    patternErrorMessage: validators.password.pattern.message
                };
            },
            validate: function(field,str){
                if(str==="") return self.onError(400,100,validators.password.pattern.message,field);
                var re = validators.password.pattern.regex;
                if(re.test(str)){
                    return true;
                }else{
                    return self.onError(400,100,validators.password.pattern.message,field);
                }
            }
        },
        email: {
            pattern:{
                regex: /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                message: "Invalid email format."
            },
            define: function(){
                var pattern = $patternToString(validators.email.pattern.regex);
                return {
                    pattern: pattern,
                    patternErrorMessage: validators.email.pattern.message
                };
            },
            validate: function(field,str){
                if(str==="") return true;
                var re = validators.email.pattern.regex;
                if(re.test(str)){
                    return true;
                }else{
                    return self.onError(400,100,validators.email.pattern.message,field);
                }
            }
        },
        uuid: {
            pattern:{
                regex: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
                message: "Invalid UUID format."
            },
            define: function(){
                var pattern = $patternToString(validators.uuid.pattern.regex);
                return {
                    pattern: pattern,
                    patternErrorMessage: validators.uuid.pattern.message
                };
            },
            validate: function(field,str){
                if(str==="") return true;
                var re = validators.uuid.pattern.regex;
                if(re.test(str)){
                    return true;
                }else{
                    console.log('uuid: '+str);
                    return self.onError(400,100,validators.uuid.pattern.message,field);
                }
            }
        },
        date: {
            define: function(){
                return {};
            },
            validate: function(field,str){
                if(str==="") return true;

                /*check for numeric date*/
                if(str === (parseInt(str) + '')) {
                    now = new Date(parseInt(now));
                } else {
                    now = new Date(str);
                }

                if (now == 'Invalid Date'){
                    return self.onError(400,100, 'Must be a valid/parsable date format.',field);
                }else{
                    return true
                }

            }
        }
    };

    var $patternToString = function(reg){
        var pattern = (reg).toString();
        return pattern.substring(1,pattern.length-1);
    };

    return validators;
};