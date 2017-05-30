module.exports = function(RED) {
    var ltc2309 = require('ltc2309');
    
    
    function initLTC2309(config) 
    {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        this.status({fill:"orange",shape:"ring",text:"Not Initialised"});
        this.on('input', function(msg) {
            this.ltc = new ltc2309('/dev/i2c-2', 0x08);
            globalContext.set("i2cLtc",this.ltc);
            globalContext.set("initLtc",true);
            if(globalContext.initLtc)
            {
                this.status({fill:"green",shape:"dot",text:"Initialised"});
            }
            else
            {
                
                this.status({fill:"red",shape:"ring",text:"Not Initialised"});
            }
            node.send(null);
        });
    }
    RED.nodes.registerType("ltc2309init",initLTC2309);
    
    function getVoltLtc2309(config) {
        RED.nodes.createNode(this,config);
        this.mode = parseInt(config.mode);
        this.channel = config.channel;
        var node = this;
        var globalContext = this.context().global;
        this.on('input', function(msg) 
        {
            if(globalContext.initLtc)
            {                
                this.status({fill:"green",shape:"dot",text:"?"});
                globalContext.i2cLtc.getADCVolt(this.channel,this.mode,function(data)
                {
                    msg.payload = data;
                    node.send(msg);
                });
            }
            else
            {
                node.warn("I2C nicht initialisiert");
                msg=null;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("ltc2309getVoltCh",getVoltLtc2309);


    function getVoltAllLtc2309(config) {
        RED.nodes.createNode(this,config);
        this.mode = parseInt(config.mode);
        var node = this;
        var globalContext = this.context().global;
        this.on('input', function(msg) 
        {
            if(globalContext.initLtc)
            {                
                this.status({fill:"green",shape:"dot",text:"?"});
                globalContext.i2cLtc.getADCVoltAll(this.mode,function(data)
                {
                    msg.payload = data;
                    var msg0 = { payload:data.adcV0, topic: "CH0" };
                    var msg1 = { payload:data.adcV1, topic: "CH1" };
                    var msg2 = { payload:data.adcV2, topic: "CH2" };
                    var msg3 = { payload:data.adcV3, topic: "CH3" };
                    var msg4 = { payload:data.adcV4, topic: "CH4" };
                    var msg5 = { payload:data.adcV5, topic: "CH5" };
                    var msg6 = { payload:data.adcV6, topic: "CH6" };
                    var msg7 = { payload:data.adcV7, topic: "CH7" };
                    node.send(msg0);
                    node.send(msg1);
                    node.send(msg2);
                    node.send(msg3);
                    node.send(msg4);
                    node.send(msg5);
                    node.send(msg6);
                    node.send(msg7);
                });
            }
            else
            {
                node.warn("I2C nicht initialisiert");
                msg=null;
                node.send(msg);
            }
        });
    }
    RED.nodes.registerType("ltc2309getVoltAllCh",getVoltAllLtc2309);
}
