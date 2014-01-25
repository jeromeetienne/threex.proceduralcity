// from @mrdoob http://www.mrdoob.com/lab/javascript/webgl/city/01/

var THREEx = THREEx || {}

THREEx.ProceduralCity	= function(){
	// build the base geometry for each building
	var geometry = new THREE.CubeGeometry( 1, 1, 1 );
	// translate the geometry to place the pivot point at the bottom instead of the center
	geometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
	// get rid of the bottom face - it is never seen
	geometry.faces.splice( 3, 1 );
	geometry.faceVertexUvs[0].splice( 3, 1 );
	// change UVs for the top face
	// - it is the roof so it wont use the same texture as the side of the building
	// - set the UVs to the single coordinate 0,0. so the roof will be the same color
	//   as a floor row.
	geometry.faceVertexUvs[0][2][0].set( 0, 0 );
	geometry.faceVertexUvs[0][2][1].set( 0, 0 );
	geometry.faceVertexUvs[0][2][2].set( 0, 0 );
	geometry.faceVertexUvs[0][2][3].set( 0, 0 );

	// buildMesh
	var buildingMesh= new THREE.Mesh( geometry );

	this.createBuilding	= function(){
		return buildingMesh
	}

	//////////////////////////////////////////////////////////////////////////////////
	//		buildingTexture							//
	//////////////////////////////////////////////////////////////////////////////////
			
	// generate the texture
	var buildingTexture		= new THREE.Texture( generateTextureCanvas() );
	buildingTexture.anisotropy	= renderer.getMaxAnisotropy();
	buildingTexture.needsUpdate	= true;
	
	
	//////////////////////////////////////////////////////////////////////////////////
	//		lamp								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var lampGeometry= new THREE.CubeGeometry( 0.1, 3, 0.1)
	var lampMesh	= new THREE.Mesh(lampGeometry)
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	var nBlockX	= 10
	var nBlockZ	= 10
	var blockSizeX	= 50
	var blockSizeZ	= 50
	var blockDensity= 20
	var roadW	= 8
	var roadD	= 8
	var buildingMaxW= 15
	var buildingMaxD= 15
	var sidewalkW	= 2
	var sidewalkH	= 0.1
	var sidewalkD	= 2
	var lampDensityW= 4
	var lampDensityD= 4
	var lampH	= 3

	this.createSquareGround	= function(){
		var geometry	= new THREE.PlaneGeometry( 1, 1, 1 );
		var material	= new THREE.MeshLambertMaterial({
			color	: 0x222222
		})
		var ground	= new THREE.Mesh(geometry, material)
		ground.lookAt(new THREE.Vector3(0,1,0))
		ground.scale.x	= (nBlockZ)*blockSizeZ
		ground.scale.y	= (nBlockX)*blockSizeX
		
		return ground
	}
	this.createSquareLamps	= function(){
		var object3d	= new THREE.Object3D()
		
		var lampGeometry= new THREE.CubeGeometry(1,1,1)
		lampGeometry.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 0.5, 0 ) );
		var lampMesh	= new THREE.Mesh(lampGeometry)

		var lightsGeometry	= new THREE.Geometry();
		var lampsGeometry	= new THREE.Geometry();
		for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
			for( var blockX = 0; blockX < nBlockX; blockX++){
				// lampMesh.position.x	= 0
				// lampMesh.position.z	= 0
				function addLamp(position){
					//////////////////////////////////////////////////////////////////////////////////
					//		light								//
					//////////////////////////////////////////////////////////////////////////////////
					
					var lightPosition	= position.clone()
					lightPosition.y		= sidewalkH+lampH+0.1
					// set position for block
					lightPosition.x		+= (blockX+0.5-nBlockX/2)*blockSizeX
					lightPosition.z		+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

					lightsGeometry.vertices.push(lightPosition );
					//////////////////////////////////////////////////////////////////////////////////
					//		head								//
					//////////////////////////////////////////////////////////////////////////////////
					
					// set base position
					lampMesh.position.copy(position)
					lampMesh.position.y	= sidewalkH+lampH
					// add poll offset				
					lampMesh.scale.set(0.2,0.2,0.2)
					// colorify
					for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
						lampMesh.geometry.faces[i].color.set('white' );
					}					
					// set position for block
					lampMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					lampMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					// merge it with cityGeometry - very important for performance
					THREE.GeometryUtils.merge( lampsGeometry, lampMesh )	
								
					//////////////////////////////////////////////////////////////////////////////////
					//		poll								//
					//////////////////////////////////////////////////////////////////////////////////
					
					// set base position
					lampMesh.position.copy(position)
					lampMesh.position.y	+= sidewalkH
					// add poll offset				
					lampMesh.scale.set(0.1,lampH,0.1)
					// colorify
					for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
						lampMesh.geometry.faces[i].color.set('grey' );
					}					
					// set position for block
					lampMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					lampMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					// merge it with cityGeometry - very important for performance
					THREE.GeometryUtils.merge( lampsGeometry, lampMesh )	
								
					//////////////////////////////////////////////////////////////////////////////////
					//		base								//
					//////////////////////////////////////////////////////////////////////////////////		
					// set base position
					lampMesh.position.copy(position)
					lampMesh.position.y	+= sidewalkH
					// add poll offset				
					lampMesh.scale.set(0.12,0.4,0.12)
					// colorify
					for(var i = 0; i < lampMesh.geometry.faces.length; i++ ) {
						lampMesh.geometry.faces[i].color.set('maroon' );
					}					
					// set position for block
					lampMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					lampMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					// merge it with cityGeometry - very important for performance
					THREE.GeometryUtils.merge( lampsGeometry, lampMesh );					
				}
				// south							
				var position	= new THREE.Vector3()
				for(var i = 0; i < lampDensityW+1; i++){
					position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW)
					position.z	= -0.5*(blockSizeZ-roadD-sidewalkD)
					addLamp(position)
				}
				// north
				for(var i = 0; i < lampDensityW+1; i++){
					position.x	= (i/lampDensityW-0.5)*(blockSizeX-roadW-sidewalkW)
					position.z	= +0.5*(blockSizeZ-roadD-sidewalkD)
					addLamp(position)
				}
				// east
				for(var i = 1; i < lampDensityD; i++){
					position.x	= +0.5*(blockSizeX-roadW-sidewalkW)
					position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD)
					addLamp(position)
				}
				// west
				for(var i = 1; i < lampDensityD; i++){
					position.x	= -0.5*(blockSizeX-roadW-sidewalkW)
					position.z	= (i/lampDensityD-0.5)*(blockSizeZ-roadD-sidewalkD)
					addLamp(position)
				}


			}
		}
		
		// build the lamps Mesh
		var material	= new THREE.MeshLambertMaterial({
			vertexColors	: THREE.VertexColors
		});
		var lampsMesh	= new THREE.Mesh(lampsGeometry, material );
		object3d.add(lampsMesh)
	
		//////////////////////////////////////////////////////////////////////////////////
		//		comment								//
		//////////////////////////////////////////////////////////////////////////////////
		
		var texture	= THREE.ImageUtils.loadTexture( "../images/lensflare2_alpha.png" );
		var material	= new THREE.ParticleBasicMaterial({
			map		: texture,
			size		: 8, 
			transparent	: true
		});
		var lightParticles	= new THREE.ParticleSystem( lightsGeometry, material );
		lightParticles.sortParticles = true;
		object3d.add( lightParticles );

		return object3d
	}
	this.createSquareCarLights	= function(){
		var carLightsDensityD	= 4
		var carW		= 1
		var carH		= 2

		var geometry	= new THREE.Geometry();
		var position	= new THREE.Vector3()
		position.y	= carH/2
		
		var colorFront		= new THREE.Color('white')
		var colorBack		= new THREE.Color('red')

		for( var blockX = 0; blockX < nBlockX; blockX++){
			for( var blockZ = 0; blockZ < nBlockZ; blockZ++){	
				function addCarLights(position){
					//////////////////////////////////////////////////////////////////////////////////
					//		comment								//
					//////////////////////////////////////////////////////////////////////////////////
					
					var positionL	= position.clone()
					positionL.x	+= -carW/2
					// set position for block
					positionL.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					positionL.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					geometry.vertices.push( positionL );
					geometry.colors.push( colorFront )

					var positionR	= position.clone()
					positionR.x	+= +carW/2
					// set position for block
					positionR.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					positionR.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					geometry.vertices.push( positionR );
					geometry.colors.push( colorFront )

					//////////////////////////////////////////////////////////////////////////////////
					//		comment								//
					//////////////////////////////////////////////////////////////////////////////////
					position.x	= -position.x
					
					var positionL	= position.clone()
					positionL.x	+= -carW/2
					// set position for block
					positionL.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					positionL.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					geometry.vertices.push( positionL );
					geometry.colors.push( colorBack )

					var positionR	= position.clone()
					positionR.x	+= +carW/2
					// set position for block
					positionR.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
					positionR.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ
					geometry.vertices.push( positionR );
					geometry.colors.push( colorBack )
				}
				// east
				for(var i = 0; i < carLightsDensityD+1; i++){
					position.x	= +0.5*blockSizeX-roadW/4
					position.z	= (i/carLightsDensityD-0.5)*(blockSizeZ-roadD)
					addCarLights(position)
				}
			}
		}
		//////////////////////////////////////////////////////////////////////////////////
		//		comment								//
		//////////////////////////////////////////////////////////////////////////////////

		var object3d	= new THREE.Object3D
		
		var texture	= THREE.ImageUtils.loadTexture( "../images/lensflare2_alpha.png" );
		var material	= new THREE.ParticleBasicMaterial({
			map		: texture,
			size		: 6, 
			transparent	: true,
			vertexColors	: THREE.VertexColors
		});
		var particles	= new THREE.ParticleSystem( geometry, material );
		particles.sortParticles = true;
		object3d.add(particles)
		
		return object3d
	}
	this.createSquareSideWalks	= function(){
		var buildingMesh= this.createBuilding()
		var sidewalksGeometry= new THREE.Geometry();
		for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
			for( var blockX = 0; blockX < nBlockX; blockX++){
				// set position
				buildingMesh.position.x	= (blockX+0.5-nBlockX/2)*blockSizeX
				buildingMesh.position.z	= (blockZ+0.5-nBlockZ/2)*blockSizeZ

				buildingMesh.scale.x	= blockSizeX-roadW
				buildingMesh.scale.y	= sidewalkH
				buildingMesh.scale.z	= blockSizeZ-roadD

				// merge it with cityGeometry - very important for performance
				THREE.GeometryUtils.merge( sidewalksGeometry, buildingMesh );					
			}
		}		
		// build the mesh
		var material	= new THREE.MeshLambertMaterial({
			color	: 0x444444
		});
		var sidewalksMesh	= new THREE.Mesh(sidewalksGeometry, material );
		return sidewalksMesh
	}
	this.createSquareBuildings	= function(){
		var buildingMesh= this.createBuilding()
		var cityGeometry= new THREE.Geometry();
		for( var blockZ = 0; blockZ < nBlockZ; blockZ++){
			for( var blockX = 0; blockX < nBlockX; blockX++){
					for( var i = 0; i < blockDensity; i++){
						// set position
						buildingMesh.position.x	= (Math.random()-0.5)*(blockSizeX-buildingMaxW-roadW-sidewalkW)
						buildingMesh.position.z	= (Math.random()-0.5)*(blockSizeZ-buildingMaxD-roadD-sidewalkD)

						// add position for the blocks
						buildingMesh.position.x	+= (blockX+0.5-nBlockX/2)*blockSizeX
						buildingMesh.position.z	+= (blockZ+0.5-nBlockZ/2)*blockSizeZ

						// put a random scale
						buildingMesh.scale.x	= Math.min(Math.random() * 5 + 10, buildingMaxW);
						buildingMesh.scale.y	= (Math.random() * Math.random() * buildingMesh.scale.x) * 3 + 4;
						buildingMesh.scale.z	= Math.min(buildingMesh.scale.x, buildingMaxD)

						this.colorifyBuilding(buildingMesh)

						// merge it with cityGeometry - very important for performance
						THREE.GeometryUtils.merge( cityGeometry, buildingMesh );					
					}
			}		
		}
		
		// build the city Mesh
		var material	= new THREE.MeshLambertMaterial({
			map		: buildingTexture,
			vertexColors	: THREE.VertexColors
		});
		var cityMesh	= new THREE.Mesh(cityGeometry, material );
		return cityMesh
	}

	this.createSquareCity	= function(){
		var object3d		= new THREE.Object3D()
		
		var carLightsMesh	= this.createSquareCarLights()
		object3d.add(carLightsMesh)
		
		var lampsMesh		= this.createSquareLamps()
		object3d.add(lampsMesh)

		var sidewalksMesh	= this.createSquareSideWalks()
		object3d.add(sidewalksMesh)
		
		var buildingsMesh	= this.createSquareBuildings()
		object3d.add(buildingsMesh)	

		var groundMesh	= this.createSquareGround()
		object3d.add(groundMesh)	
		
		return object3d
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	this.createMrDoobCity	= function(){
		var buildingMesh= this.createBuilding()
		var cityGeometry= new THREE.Geometry();
		for( var i = 0; i < 20000; i ++ ){
			// put a random position
			buildingMesh.position.x	= Math.floor( Math.random() * 200 - 100 ) * 10;
			buildingMesh.position.z	= Math.floor( Math.random() * 200 - 100 ) * 10;
			// put a random rotation
			buildingMesh.rotation.y	= Math.random()*Math.PI*2;		

			// put a random scale
			buildingMesh.scale.x	= Math.random() * Math.random() * Math.random() * Math.random() * 50 + 10;
			buildingMesh.scale.y	= (Math.random() * Math.random() * Math.random() * buildingMesh.scale.x) * 8 + 8;
			buildingMesh.scale.z	= buildingMesh.scale.x

			this.colorifyBuilding(buildingMesh)
			// merge it with cityGeometry - very important for performance
			THREE.GeometryUtils.merge( cityGeometry, buildingMesh );
		}
		// build the mesh
		var material	= new THREE.MeshLambertMaterial({
			map		: buildingTexture,
			vertexColors	: THREE.VertexColors
		});
		var cityMesh	= new THREE.Mesh(cityGeometry, material );
		return cityMesh
	}
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	
	// base colors for vertexColors. light is for vertices at the top, shaddow is for the ones at the bottom
	var light	= new THREE.Color( 0xffffff )
	var shadow	= new THREE.Color( 0x303050 )
	this.colorifyBuilding	= function(buildingMesh){
		// establish the base color for the buildingMesh
		var value	= 1 - Math.random() * Math.random();
		var baseColor	= new THREE.Color().setRGB( value + Math.random() * 0.1, value, value + Math.random() * 0.1 );
		// set topColor/bottom vertexColors as adjustement of baseColor
		var topColor	= baseColor.clone().multiply( light );
		var bottomColor	= baseColor.clone().multiply( shadow );
		// set .vertexColors for each face
		var geometry	= buildingMesh.geometry;		
		for ( var j = 0, jl = geometry.faces.length; j < jl; j ++ ) {
			if ( j === 2 ) {
				// set face.vertexColors on root face
				geometry.faces[ j ].vertexColors = [ baseColor, baseColor, baseColor, baseColor ];
			} else {
				// set face.vertexColors on sides faces
				geometry.faces[ j ].vertexColors = [ topColor, bottomColor, bottomColor, topColor ];
			}
		}		
	}
	
	return
	
	//////////////////////////////////////////////////////////////////////////////////
	//		comment								//
	//////////////////////////////////////////////////////////////////////////////////
	

	function generateTextureCanvas(){
		// build a small canvas 32x64 and paint it in white
		var canvas	= document.createElement( 'canvas' );
		canvas.width	= 32;
		canvas.height	= 64;
		var context	= canvas.getContext( '2d' );
		// plain it in white
		context.fillStyle	= '#ffffff';
		context.fillRect( 0, 0, 32, 64 );
		// draw the window rows - with a small noise to simulate light variations in each room
		for( var y = 2; y < 64; y += 2 ){
			for( var x = 0; x < 32; x += 2 ){
				var value	= Math.floor( Math.random() * 64 );
				context.fillStyle = 'rgb(' + [value, value, value].join( ',' )  + ')';
				context.fillRect( x, y, 2, 1 );
			}
		}

		// build a bigger canvas and copy the small one in it
		// This is a trick to upscale the texture without filtering
		var canvas2	= document.createElement( 'canvas' );
		canvas2.width	= 512;
		canvas2.height	= 1024;
		var context	= canvas2.getContext( '2d' );
		// disable smoothing
		context.imageSmoothingEnabled		= false;
		context.webkitImageSmoothingEnabled	= false;
		context.mozImageSmoothingEnabled	= false;
		// then draw the image
		context.drawImage( canvas, 0, 0, canvas2.width, canvas2.height );
		// return the just built canvas2
		return canvas2;
	}
}