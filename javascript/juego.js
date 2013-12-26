
var Q = new Quintus({
	development:true
});

//indicar que modulo se desa usar audio, gravedad, etc.

Q.include("Scenes, Sprites, 2D, Input, Anim, Touch");

//indicar en que canvas se pinta el juego

Q.setup("juego");

//para detectar los controles es !tener habilitado el modulo de Input en Q.include

Q.controls();

//el metodo load solicita los recursoso y pide que hacer con el metodo function
Q.load("mapa_escena1.tmx, mosaicos_escenario.png, mosaicos_mario_enano.png, mosaicos_enemigos_32x32.png, mosaicos_enemigos_32x46.png", function(){
	
	
	//argumento 1 = id, arg 2 imagen fuente de mosaico, arg 3 tamaño de los cuadros
	Q.sheet("escenario", "mosaicos_escenario.png", {
		tileH:32,
		tileW:32
	});
	
	//definicon del mosaico de mario "fuera del load"

Q.sheet("mario_enano", "mosaicos_mario_enano.png", {
		tileH:30,
		tileW:30
	});


//enemigo 1

Q.sheet("gomba", "mosaicos_enemigos_32x32.png", {
		tileH:32,
		tileW:32
	});
	
	//enemigo2
	
	Q.sheet("tortugaVerde", "mosaicos_enemigos_32x46.png", {
		tileH:46,
		tileW:32
	});
	
	
	//una vez que esten listos los recursos carag la escena 1
	Q.stageScene("escena1");
	
});

//animacion del mario
Q.animations("mario_camina", {
	caminar:{
		frames:[4, 5, 8], //se seleccionan los frames que se mostraran del mosaico
		rate:1/6,    //velocidad de reproduccion 6 frames por segundo en este ejemplo, por fracciones
		loop:false 
	},
	quieto:{
		frames:[1], //se seleccionan los frames que se mostraran del mosaico
		rate:1/2,    // velocidad de reproduccion 2 veces por segundo
		loop:false 
	},
	saltar:{
		frames:[2], //se seleccionan los frames que se mostraran del mosaico
		rate:1/2,    // velocidad de reproduccion 2 veces por segundo
		loop:false 
	}
	
	
	
});
	
	//animacion de gomba
	Q.animations("goomba_anim", {
	camina:{
		frames:[0, 1], //se seleccionan los frames que se mostraran del mosaico
		rate:1/4,    //velocidad de reproduccion 6 frames por segundo en este ejemplo, por fracciones
		loop:true 
	}

});

//animacion de tortugaverde
Q.animations("tortuga_verde_anim", {
	caminar:{
		frames:[0, 1], //se seleccionan los frames que se mostraran del mosaico
		rate:1/4,    //velocidad de reproduccion 6 frames por segundo en este ejemplo, por fracciones
		loop:false
	}	

});

//definicion de la clase del mario
Q.Sprite.extend("Mario", {
	
	init:function(p){
		this._super(p, {
			sheet:"mario_enano",
			sprite: "mario_camina",
			frame:1,
			x: 100,
			y: 50,
			jumpSpeed:-600
		});
		
		//se le pueden agregar componentes a los personajes en este caso gravedad
		
		this.add("2d, platformerControls, animation");
		
	},
	step: function(){
		if(this.p.vx > 0 && this.p.vy === 0){
			
			this.p.flip = false;//invierte la imagen horizontal con "x" tambien se pueed vertical
			this.play("caminar");
		
		} else if(this.p.vx < 0 && this.p.vy === 0){
			
			this.p.flip = "x";
			this.play("caminar");
		
		} else if(this.p.vx === 0 && this.p.vy === 0){
			
			this.play("quieto");
			
		} else if(this.p.vy !== 0){
			
			this.play("saltar");
			
		}
		
	}
	
});

Q.Sprite.extend("Gomba", {
	
	init:function(p){
		this._super(p, {
			sheet:"gomba",
			sprite: "goomba_anim",
			frame:0,
			x: 100,
			y: 50,
			vx: 50,
		
		
		});
		
		//se le pueden agregar componentes a los personajes en este caso gravedad
		
		this.add("2d, aiBounce, animation");
		this.play("camina");
	}
	
});

Q.Sprite.extend("TortugaVerde", {
	
	init:function(p){
		this._super(p, {
			sheet:"tortugaVerde",
			sprite:"tortuga_verde_anim",
			frame:0,
			vx: 100,
		});
		
		//se le pueden agregar componentes a los personajes en este caso gravedad
		
		this.add("2d, aiBounce, animation");
	},
	
	step: function(){
		if(this.p.vx > 0){
			
			this.p.flip = "x";
			this.play("caminar");
		
		} else if(this.p.vx < 0){
			
			this.p.flip = false;//invierte la imagen horizontal con "x" tambien se pueed vertical
			this.play("caminar");
		
		} 
		
	}
	
});


//para definir una escena se usa:

Q.scene("escena1", function(stage){//el objeto de la funcion para esceneario puede ser como sea
	
	var cielo = new Q.TileLayer({
		
		dataAsset:"mapa_escena1.tmx",
		layerIndex:0,
		sheet:"escenario",   //mismo que Q.sheet
		type: Q.SPRITE_NONE
	});
	
	stage.insert(cielo);
	
	var nubes = new Q.TileLayer({
		
		dataAsset:"mapa_escena1.tmx",
		layerIndex:1,
		sheet:"escenario",   //mismo que Q.sheet
		type: Q.SPRITE_NONE
		
	});
	
	stage.insert(nubes);
	
	var colisiones = new Q.TileLayer({
		
		dataAsset:"mapa_escena1.tmx",
		layerIndex:2,
		sheet:"escenario",   //mismo que Q.sheet
			
	});
	
	stage.collisionLayer(colisiones);
	
	var mario = stage.insert(new Q.Mario({
		x:300
	}));
	
	stage.add("viewport").follow(mario,{
		x:true,
		y:true,
		
	},{
		minX:32,
		maxX:colisiones.p.w,
		minY:0,
		maxY:colisiones.p.h
	});
	
	stage.insert(new Q.Gomba());
	
	stage.insert(new Q.TortugaVerde({
		x:150,
		y:50
	}));
	
});
