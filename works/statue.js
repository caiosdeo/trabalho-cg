// Loading the statue
// loadOBJFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);
// loadFBXFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);
// loadPLYFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);

// Loading the statue
// loadFBXFile('./objects', 'raptor', false, 2.5);
// loadPLYFile('./objects', 'cow', false, 2.0);

function loadPLYFile(modelPath, modelName, visibility, desiredScale)
{
  var loader = new THREE.PLYLoader( );
  loader.load( modelPath + modelName + '.ply', function ( geometry ) {

    geometry.computeVertexNormals();

    var material = new THREE.MeshPhongMaterial({color:"rgb(255,120,50)"});
    var obj = new THREE.Mesh( geometry, material );

    obj.name = modelName;
    obj.visible = visibility;
    obj.castShadow = true;

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);

    scene.add( obj );
    objectArray.push( obj );

    }, onProgress, onError);
}

function loadFBXFile(modelPath, modelName, visibility, desiredScale)
{
  var loader = new THREE.FBXLoader( );
  loader.load( modelPath + modelName + '.fbx', function ( object ) {
    var obj = object;
    obj.name = modelName;
    obj.visible = visibility;
    obj.traverse( function ( child ) {
      if ( child ) {
         child.castShadow = true;
      }
    });
    obj.traverse( function( node )
    {
      if( node.material ) node.material.side = THREE.DoubleSide;
    });

    var obj = normalizeAndRescale(obj, desiredScale);
    var obj = fixPosition(obj);

    scene.add ( obj );
    objectArray.push( obj );

    }, onProgress, onError);
}