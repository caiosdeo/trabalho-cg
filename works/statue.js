// Loading the statue
// loadPLYFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);

// Loading the statue
// loadPLYFile('./objects', 'cow', false, 2.0);

function loadPLYFile(scene, modelPath, modelName, visibility, desiredScale){

  var loader = new THREE.PLYLoader( );
  loader.load( modelPath + modelName + '.ply', function ( geometry ) {

    geometry.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial({color:"rgb(120,120,120)"});
    var obj = new THREE.Mesh( geometry, material );

    obj.name = modelName;
    obj.visible = visibility;
    obj.castShadow = true;

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);

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

function fixPosition(obj){
 // Fix position of the object over the ground plane
  var box = new THREE.Box3().setFromObject( obj );
  if(box.min.y > 0)
    obj.translateY(-box.min.y);
  else
    obj.translateY(-1*box.min.y);
  return obj;
}

function onError(error) {console.error( error );};

function onProgress ( ) {};