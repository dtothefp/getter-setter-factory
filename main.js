window.optly                = window.optly || {};
window.optly.mrkt           = window.optly.mrkt || {};
window.optly.mrkt.services  = window.optly.mrkt.services || {};
window.optly.mrkt.user      = window.optly.mrkt.user || {};

window.optly.mrkt.Optly_Q = function(acctData, expData){

  window.optly.PRELOAD = window.optly.PRELOAD = {};

  if(arguments.length > 0 ){
        window.optly.PRELOAD.token = acctData.csrf_token;
    return Object.create(window.optly.mrkt.Optly_Q.prototype, {
      acctData: {
        value: window.optly.mrkt.user.acctData = acctData,
      },
      expData: {
        value: window.optly.mrkt.user.expData = expData
      }
    });
  } else {
    var acctCache, expCache;
    return Object.create(window.optly.mrkt.Optly_Q.prototype, {
      acctData: {
        get: function(){return acctCache},
        set: function(val){
          if(!acctCache){
            window.optly.PRELOAD.token = val.csrf_token;
            window.optly.mrkt.user.acctData = val;
            acctCache = val;
          }
        }
      },
      expData: {
        get: function(){return expCache},
        set: function(val){
          if(!expCache){
            window.optly.mrkt.user.expData = val;
            expCache = val;
          }
        }
      }
    });
  }
};

window.optly.mrkt.Optly_Q.prototype = {

  transformQuedArgs: function(quedArgs) {
    var funcArgs = [];
    $.each(quedArgs, function(index, arg) {
      if (this[ arg ] !== undefined && arg !== 'object') {
        funcArgs.push(this[ arg ]);
      } else if(arg === 'object') {
        funcArgs.push[arg];
      }
    }.bind(this));

    return funcArgs;
  },

  parseQ: function(fnQ, i) {
    var quedArgs, transformedArgs;
    //if not a nested array
    if (typeof fnQ[i] === 'function') {
      quedArgs = fnQ.slice(1);

      //if there are no arguments call the function with the object scope
      if(quedArgs.length === 0) {
        fnQ[i].call(this);
      } else {
        transformedArgs = this.transformQuedArgs(quedArgs);
        fnQ[i].apply( fnQ[i], transformedArgs );
      }

    }
    //if a nested array
    else {
      for(var nestedI = 0; nestedI < fnQ[i].length; nestedI += 1) {

        if (typeof fnQ[i][nestedI] === 'function') {
          quedArgs = fnQ[i].slice(1);

          //if there are no arguments call the function with the object scope
          if(quedArgs.length === 0) {
            fnQ[i][nestedI].call(this);
          } else {
            transformedArgs = this.transformQuedArgs(quedArgs);
            fnQ[i][nestedI].apply( fnQ[i][nestedI], transformedArgs );
          }

        }
      }
    }
  },

  push: function(fnQ) {
    for (var i = 0; i < fnQ.length; i += 1) {
      this.parseQ(fnQ, i);
    }
  }

}

var q = window.optly.mrkt.Optly_Q({csrf_token: 'instantiation args q token'}, {exp: 'instantiation args q exp'});

var anom = function() {
  console.log('anom func', this.acctData, this.expData);
}

var dataAnom = function(acctData, expData) {
  console.log('data anom func', acctData, expData);
}

console.log('*****Push Nested Q********');

q.push([
  [dataAnom, 'acctData', 'expData'],
  [anom]
]);

var qNoArgs = window.optly.mrkt.Optly_Q();

qNoArgs.acctData = {csrf_token: 'no args q token'};
qNoArgs.expData = {exp: 'no args q exp'};

console.log('\n*****Push Individual Arrays********');

qNoArgs.push([dataAnom, 'acctData', 'expData']);
qNoArgs.push([anom]);

console.log('\n*****Can\'t override set properties********');

q.acctData = 'fancy';
q.expData = 'pants';

qNoArgs.acctData = 'you\'re';
qNoArgs.expData = 'tripp\'n';

console.log(
  q.acctData,
  '\n',
  q.expData,
  '\n',
  qNoArgs.acctData,
  '\n',
  qNoArgs.expData
);
