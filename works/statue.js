// Loading the statue
// loadOBJFile('../objects/','Thai_Female_Sandstone_V2.2',true,1.5);

  function loadOBJFile(modelPath, modelName, visibility, desiredScale)
  {
    currentModel = modelName;

    var manager = new THREE.LoadingManager( );

    var mtlLoader = new THREE.MTLLoader( manager );
    mtlLoader.setPath( modelPath );
    mtlLoader.load( modelName + '.mtl', function ( materials ) {
         materials.preload();

         var objLoader = new THREE.OBJLoader( manager );
         objLoader.setMaterials(materials);
         objLoader.setPath(modelPath);
         objLoader.load( modelName + ".obj", function ( obj ) {
           obj.name = modelName;
           obj.visible = visibility;
           // Set 'castShadow' property for each children of the group
           obj.traverse( function (child)
           {
             child.castShadow = true;
           });

           obj.traverse( function( node )
           {
             if( node.material ) node.material.side = THREE.DoubleSide;
           });

           var obj = normalizeAndRescale(obj, desiredScale);
           var obj = fixPosition(obj);

           scene.add ( obj );
           objectArray.push( obj );

         }, onProgress, onError );
    });
  }