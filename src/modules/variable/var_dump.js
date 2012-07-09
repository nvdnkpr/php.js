/* 
* @author Niklas von Hertzen <niklas at hertzen.com>
* @created 26.6.2012 
* @website http://hertzen.com
 */


PHP.Modules.prototype.var_dump = function() {
    
    var str = "",
    indent = 0,
    COMPILER = PHP.Compiler.prototype,
    VAR = PHP.VM.Variable.prototype;
    
    var $dump = function( argument, indent ) {
        var str = "",
        value = argument[ COMPILER.VARIABLE_VALUE ]; // trigger get for undefined
       
        str += $INDENT( indent );
        
        /*
        if (argument[ VAR.IS_REF] !== undefined ) {
            str += "&";
        }*/
       
        if ( argument[ VAR.TYPE ] === VAR.ARRAY ) {
            str += "array(";

            var values = value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.VALUES ][ COMPILER.VARIABLE_VALUE ];
            var keys = value[ PHP.VM.Class.PROPERTY + PHP.VM.Array.prototype.KEYS ][ COMPILER.VARIABLE_VALUE ];
            
            str += values.length;
       
            str += ") {\n";
            
            keys.forEach(function( key, index ){
                
                if (key instanceof PHP.VM.Variable) {
                    key = key[ COMPILER.VARIABLE_VALUE ];
                }
                
                str += $INDENT( indent + 2 ) + "[";
                if ( typeof key === "string" ) {
                    str += '"' + key + '"';
                } else {
                    str += key;
                } 
                str += "]=>\n";
               
                str += $dump( values[ index ], indent + 2 );
                
            }, this);
            
            str += $INDENT( indent ) + "}\n";
        } else if( argument[ VAR.TYPE ] === VAR.NULL ) {
            
            str += "NULL\n";  
        } else if( argument[ VAR.TYPE ] === VAR.BOOL ) {    
            str += "bool(" + value + ")\n";  
        } else if( argument[ VAR.TYPE ] === VAR.STRING ) {
            
            str += "string(" + value.length + ') "' + value + '"\n';  
        } else if( argument[ VAR.TYPE ] === VAR.INT ) {
            str += "int(" + value + ')\n';  
        } else if( argument instanceof PHP.VM.ClassPrototype || argument[ VAR.TYPE ] === VAR.OBJECT ) {
            // todo, complete
            if( argument[ VAR.TYPE ] === VAR.OBJECT ) {
                argument = value;
            }
            
            str += "object(" + argument[ COMPILER.CLASS_NAME ] + ')#1 ';
            
            var props = [];
            
            // search whole prototype chain
            for ( var item in argument ) {
                if (item.substring(0, PHP.VM.Class.PROPERTY.length) === PHP.VM.Class.PROPERTY) {
                    props.push( item );
                }
            }
         
            
            str += '(' + props.length + ') {\n';
            
            props.forEach(function( prop ){
                str += $INDENT( indent + 2 ) + '["' + prop.substring( PHP.VM.Class.PROPERTY.length ) + '"]=>\n';
                str += $dump( argument[ prop ], indent + 2 );
            });
            
            str += '}\n';  
        } else if( argument[ VAR.TYPE ] === VAR.FLOAT ) {
            str += "float(" + value + ')\n';      
        } else {
            console.log( argument );
        }
    
        return str;
    }, 
    $INDENT = function( num ) {
        var str = "", i ;
        for (i = 0; i < num; i++) {
            str += " ";
        }
        return str;
    };
    
    PHP.Utils.$A( arguments ).forEach( function( argument ) {
        str += $dump( argument, 0 );    
    }, this );
    
    this.echo( str );
    
    
  
// console.log(arguments);
/*
    console.log( arguments[0].type);
    console.log( arguments[0] instanceof PHP.VM.VariableProto);
    console.log( arguments );
    */
};