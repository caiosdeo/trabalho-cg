// Loading the statue
// loadPLYFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);

// Loading the statue
// loadPLYFile('./objects', 'cow', false, 2.0);

function loadPLYFile(scene, modelPath, modelName, visibility, desiredScale, desiredPosition){

  var loader = new THREE.PLYLoader( );
  loader.load( modelPath + modelName + '.ply', function ( geometry ) {

    geometry.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial({color:"rgb(120,120,120)"});
    var obj = new THREE.Mesh( geometry, material );

    obj.name = modelName;
    obj.visible = visibility;
    obj.castShadow = true;
    obj.position.copy(desiredPosition);

    var obj = normalizeAndRescale(obj, desiredScale);

    scene.add( obj );

  }, onProgress, onError);
}

function normalizeAndRescale(obj, newScale){
  var scale = getMaxSize(obj); // Available in 'utils.js'
  obj.scale.set(newScale * (1.0/scale),
                newScale * (1.0/scale),
                newScale * (1.0/scale));
  return obj;
}

function onError(error) {console.error( error );};

function onProgress ( ) {};