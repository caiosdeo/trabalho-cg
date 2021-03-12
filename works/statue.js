// Loading the statue
// loadPLYFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);

// Loading the statue
// loadPLYFile('./objects', 'cow', false, 2.0);

function loadPLYFile(scene, modelPath, modelName, visibility, desiredScale, desiredPosition, texture=null){

  var loader = new THREE.PLYLoader( );
  loader.load( modelPath + modelName + '.ply', function ( geometry ) {

    geometry.computeVertexNormals();
    if(texture != null){
      var material = new THREE.MeshPhongMaterial({map:texture,side:THREE.DoubleSide});
    }else{
      var material = new THREE.MeshPhongMaterial({color:"rgb(120,120,120)"});
    }
    var obj = new THREE.Mesh( geometry, material );

    obj.name = modelName;
    obj.visible = visibility;
    obj.castShadow = true;
    obj.position.copy(desiredPosition);

    var obj = normalizeAndRescale(obj, desiredScale);

    scene.add( obj );

  }, onProgress, onError);
}

function loadOBJFile(scene, modelPath, modelName, visibility, desiredScale, desiredPosition, texture=null, objName=modelName){

  let objLoader = new THREE.OBJLoader();

  var mtlLoader = new THREE.MTLLoader();
  mtlLoader.load( modelPath + modelName + '.mtl', function (materials) {

    materials.preload();

    objLoader
      .setMaterials(materials)
      .load(modelPath + modelName + '.obj', function(object){

        object.position.copy(desiredPosition);

        object.traverse(function (child) {  
            if (child instanceof THREE.Mesh) {
                child.material.map = texture;
            }
        });

        object.name = objName;
        object.visible = visibility;
        object.castShadow = true;

        object = normalizeAndRescale(object, desiredScale);
        scene.add(object);
      });

  });

}

function normalizeAndRescale(obj, newScale){
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function onError(error) {console.error( error );};

function onProgress ( xhr ) {

  console.log((xhr.loaded / xhr.total * 100) + '% loaded')

};