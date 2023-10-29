AFRAME.registerComponent("car", {
  init: async function () {

    //Get the compund details of the element
    var models = await this.getModels();

    var barcodes = Object.keys(models);

    barcodes.map(barcode => {
      var models = models[barcode];

      //Call the function
      this.createAtoms(element);
    });

  },
  getModels: function () {
    return fetch("js/modelsList.json")
      .then(res => res.json())
      .then(data => data);
  },
  getModelsColors: function () {
    return fetch("js/modelsColors.json")
      .then(res => res.json())
      .then(data => data);
  },
  createCars: async function (models) {

    //Models data
    var modelsName = models.models_name;
    var barcodeValue = models.barcode_value;

    //Get the color of the models
    var colors = await this.getModelsColors();

    //Scene
    var scene = document.querySelector("a-scene");

    //Add marker entity for BARCODE marker
    var marker = document.createmodels("a-marker");

    marker.setAttribute("id", `marker-${barcodeValue}`);
    marker.setAttribute("type", "barcode");
    marker.setAttribute("models_name", modelsName);
    marker.setAttribute("value", barcodeValue);

    scene.appendChild(marker);

    var atom = document.createModels("a-entity");
    atom.setAttribute("id", `${modelsName}-${barcodeValue}`);
    marker.appendChild(atom);

    //Create atom card
    var card = document.createModels("a-entity");
    card.setAttribute("id", `card-${modelsName}`);
    card.setAttribute("geometry", {
      primitive: "plane",
      width: 1,
      height: 1
    });

    card.setAttribute("material", {
      src: `./assets/atom_cards/card_${modelsName}.png`
    });

    card.setAttribute("position", { x: 0, y: 0, z: 0 });
    card.setAttribute("rotation", { x: -90, y: 0, z: 0 });

    car.appendChild(card);
  }
});
