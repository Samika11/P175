var A = ["car"];

var modelsArray = [];

AFRAME.registerComponent("markerhandler", {
  init: async function () {
    var compounds = await this.getCompounds();

    this.el.addEventListener("markerFound", () => {
      var modelName = this.el.getAttribute("model_name");
      var barcodeValue = this.el.getAttribute("value");
      modelsArray.push({ model_name: modelName, barcode_value: barcodeValue });

      // Changing Compound Visiblity
      compounds[barcodeValue]["compounds"].map(item => {
        var compound = document.querySelector(`#${item.compound_name}-${barcodeValue}`);
        compound.setAttribute("visible", false);
      });

      // Changing Car Visiblity
      var car = document.querySelector(`#${modelName}-${barcodeValue}`);
      car.setAttribute("visible", true);
    });

    this.el.addEventListener("markerLost", () => {
      var modelName = this.el.getAttribute("model_name");
      var index = modelsArray.findIndex(x => x.model_name === modelName);
      if (index > -1) {
        modelsArray.splice(index, 1);
      }
    });
  },


  tick: function () {
    if (modelsArray.length > 1) {

      var messageText = document.querySelector("#message-text");

      var length = modelsArray.length;
      var distance = null;

      var compound = this.getCompound();

      if (length === 2) {
        var marker1 = document.querySelector(`#marker-${modelsArray[0].barcode_value}`);
        var marker2 = document.querySelector(`#marker-${modelsArray[1].barcode_value}`);

        distance = this.getDistance(marker1, marker2);

        if (distance < 1.25) {
          if (compound !== undefined) {
            this.showCompound(compound);
          } else {
            messageText.setAttribute("visible", true);
          }
        } else {
          messageText.setAttribute("visible", false);
        }
      }

      if (length === 3) {
        var marker1=document.querySelector(`#marker-${modelsArray[0].barcode_value}`);
        var marker2=document.querySelector(`#marker-${modelsArray[1].barcode_value}`);
        var marker3=document.querySelector(`#marker-${modelsArray[2].barcode_value}`);
        var distance1=this.getDistance(marker1,marker2);
        var distance2=this.getDistance(marker1,marker3);
        if (distance1<1.25&&distance2<1.25){
          if(compound!==undefined){
            var barcodeValue=modelsArray[0].barcode_value;
            this.showCompound(compound,barcodeValue);
          }
          else{
            messageText.setAttribute("visible",true)
          }
        }
        else{
          messageText.setAttribute("visible",false);
        }
       
      }
    }
  },
  //Calculate distance between two position markers
  getDistance: function (elA, elB) {
    return elA.object3D.position.distanceTo(elB.object3D.position);
  },
  
  getCompound: function () {
    for (var el of modelsArray) {
      if (A.includes(el.model_name)) {
        var compound = el.model_name;
        for (var i of modelsArray) {
          if (B.includes(i.model_name)) {
            compound += i.model_name;
            return { name: compound, value: el.barcode_value };
          }
          
        }
      }
    }
  },
  showCompound: function (compound) {
    modelsArray.map(item => {
      var el = document.querySelector(`#${item.model_name}-${item.barcode_value}`);
      el.setAttribute("visible", false);
    });
    //Show Compound
    var compound = document.querySelector(`#${compound.name}-${compound.value}`);
    compound.setAttribute("visible", true);
  },
  getCompounds: function () {
    // NOTE: Use ngrok server to get json values
    return fetch("js/compoundList.json")
      .then(res => res.json())
      .then(data => data);
  },
});
