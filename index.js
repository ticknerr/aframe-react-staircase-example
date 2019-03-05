import React from 'react';
import ReactDOM from 'react-dom';
import 'aframe';
import {Entity, Scene} from 'aframe-react';
import 'aframe-animation-component';
import 'aframe-environment-component';
import {Box, Light, Camera, Text} from 'aframe-react-components';
import 'aframe-event-set-component';

// Remove stubborn lighting from environment
AFRAME.registerComponent('remove-lighting', {
	
	dependencies: ['environment'],
	
	update: function() {
		var lights = this.el.querySelectorAll('[light]');
		
		for (var i = 0; i < lights.length; i++) {			
			if(lights[i].className != "customlight") {
				lights[i].removeAttribute('light');
			}
		}
	}
	
});

class World extends React.Component {
	constructor(props) {
		super(props);	 
		this.state = {
			solved: false, rise: 0.10, run: 0.14, stepcount: 2
		}
		this.moresteps = this.moresteps.bind(this);
		this.lesssteps = this.lesssteps.bind(this);
		this.widertread = this.widertread.bind(this);
		this.narrowertread = this.narrowertread.bind(this);
		this.shorterrise = this.shorterrise.bind(this);
		this.higherrise = this.higherrise.bind(this);
	}
	moresteps(e) {
		if (this.state.stepcount < 18) {
			let nextsteps = this.state.stepcount;
			nextsteps++;
			this.setState({stepcount: nextsteps});
		}
	}
	lesssteps(e) {
		if (this.state.stepcount > 2) {
			let nextsteps = this.state.stepcount;
			nextsteps--;
			this.setState({stepcount: nextsteps});
		}
	}
	widertread(e) {
		if (this.state.run < 0.4) {
			let nextrun = this.state.run;
			nextrun = nextrun + 0.02;
			this.setState({run: Math.round(nextrun*100)/100});
		}
	}
	narrowertread(e) {
		if (this.state.run > 0.1) {
			let nextrun = this.state.run;
			nextrun = nextrun - 0.02;
			this.setState({run: Math.round(nextrun*100)/100});
		}
	}
	higherrise(e) {
		if (this.state.rise < 0.3) {
			let nextrise = this.state.rise;
			nextrise = nextrise + 0.02;
			this.setState({rise: Math.round(nextrise*100)/100});
		}
	}
	shorterrise(e) {
		if (this.state.rise > 0.04) {
			let nextrise = this.state.rise;
			nextrise = nextrise - 0.02;
			this.setState({rise: Math.round(nextrise*100)/100});
		}
	}
	render() {
		
		const slope = Math.round((2*this.state.rise + this.state.run)*1000);
		const actualrun=Math.round(this.state.run*1000);
		const actualrise=Math.round(this.state.rise*1000);		

		let feedback = "";
		
		if (this.state.rise == 0.18 && ((this.state.run == 0.28) || (this.state.run == 0.26)) && ((this.state.stepcount == 15) || (this.state.stepcount == 14))) {
			
			feedback = "CONGRATULATIONS, you have created the ideal staircase.";
		}				
		else if (slope >= 610 && slope <= 640 ) {
			
			// handle some variations due to step count - which doesn't come in to the check calculation
			switch (true) {
				case (this.state.stepcount<14): 
					feedback = "HINT: I like your measurements.. but.. need some more treads?";
					break;
				case (this.state.stepcount>15):
					feedback = "HINT: I like your measurements.. but if you add too many treads you'll need a landing, which we want to avoid.";
					break;
				case (slope < 600):
					feedback = "HINT: For this staircase, it would work best with a higher slope relationship.";
				default:
					feedback = "HINT: Your staircase is looking goooooood! A small tweak might lead to perfection.. ";
			}
		}
		else {

			if (this.state.rise == 0.1 && this.state.un == 0.14 && this.state.stepcount == 2) {
				feedback="HINT: Modify the stairs by clicking the orange buttons above.";
			}
			else if (this.state.rise > 0.18) { 
				feedback = "HINT: That is quite a steep riser and the climb could feel tiring. Try lowering the riser";
			}
			else if (this.state.run > 0.28) {
				feedback = "HINT: That is quite a wide going and the climb could feel tiring. Try narrowing the going";
			}
			else if (this.state.rise < 0.16) {
				feedback = "HINT: If you have a riser this small, the staircase will be tiring or you might end up needing a landing.";
			}	
			else if (this.state.run < 0.24) {
				feedback = "HINT: Your going seems to be a bit too small. Hint: try increasing the going";
			}
			else {
				feedback = "HINT: Consider your measurements, could you create a more ideal riser or going?";
			}								
		}			
		
		return (
			<Scene shadow={{type: "basic"}} remove-lighting 
				environment={{
					grid: "none",
					preset: "forest", 
					shadow: true,			
					skyColor: "#6bc9ff",
					playArea: 8,
					lighting: "none",
					groundColor: "#3b6d30",
					groundColor2: "#598752"}} >					
				
				<Camera id="camera" 
					look-controls={true}
					user-height="1.7" >
						<Entity
							primitive="a-cursor"
							material={{ color: 'white', shader: 'flat', opacity: 0.75 }}
							geometry={{ radiusInner: 0.001, radiusOuter: 0.002 }}
							position={{x:0,y:0,z:-0.1}}
							event-set__1={{
								_event: 'mouseenter',
								material: {color: "orange"}
							}}
							event-set__2={{
								_event: 'mouseleave',
								material: {color: "white"}
							}}
							event-set__3={{
								_event: 'mouseenter',
								scale: {x: 1.2, y:1.2, z:1.2}
							}}
							event-set__4={{
								_event: 'mouseleave',
								scale: {x: 1, y:1, z:1}
							}}
							fuseTimeout={1000}
							raycaster={{
								objects: ".clickable",
								near: 0,
								far: 30,
							}}
						/>
				</Camera>

				<Box id="glass" geometry={{width: 0.6, height: 0.15, depth: 0.01}} position={{x: 0, y: 1.4, z: -0.45}} rotation={{x: -50, y: 0, z: 0}} material={{transparent: true, opacity: 0.1, side: "front", color:"turquoise"}}  >
				
					<Entity id="staircaseUI" position={{x: 0, y: -0.024, z: 0.004}} >
					
						<Box id="ui-moresteps" class="clickable" events={{click: this.moresteps}} geometry={{width: 0.1, height: 0.1, depth: 0.001}} 
							src="textures/ui-AddTread.png" repeat="1 1" side="front" material={{transparent: true}} position={{x: -0.25, y: 0, z: 0}} />		
					
						<Box id="ui-lesssteps" class="clickable" events={{click: this.lesssteps}} geometry={{width: 0.1, height: 0.1, depth: 0.001}} 
							src="textures/ui-RemoveTread.png" repeat="1 1" side="front"  material={{transparent: true}} position={{x: -0.15, y: 0, z: 0}} />		
		
						<Box id="ui-widertread" class="clickable" events={{click: this.widertread}} geometry={{width: 0.1, height: 0.1, depth: 0.001}} 
							src="textures/ui-MoreGoing.png" repeat="1 1" side="front"  material={{transparent: true}} position={{x: -0.05, y: 0, z: 0}} />		
		
						<Box id="ui-narrowertread" class="clickable" events={{click: this.narrowertread}} geometry={{width:0.1, height: 0.1, depth: 0.001}} 
							src="textures/ui-LessGoing.png" repeat="1 1" side="front" material={{transparent: true}} position={{x: 0.05, y: 0, z: 0}} />		
		
						<Box id="ui-higherrise" class="clickable" events={{click: this.higherrise}} geometry={{width: 0.1, height: 0.1, depth: 0.001}} 
							src="textures/ui-MoreRise.png" repeat="1 1" side="front" material={{transparent: true}} position={{x: 0.15, y: 0, z: 0}} />
									
						<Box id="ui-shorterrise" class="clickable" events={{click: this.shorterrise}} geometry={{width: 0.1, height: 0.1, depth: 0.001}} 
							src="textures/ui-LessRise.png" repeat="1 1" side="front"  material={{transparent: true}} position={{x: 0.25, y: 0, z: 0}} />
							
						<Entity id="stats" 
							text={{value: `Slope relationship is: ${slope}. Treads: ${this.state.stepcount}. Riser: ${actualrise}mm. Going: ${actualrun}mm.`, color: "white", wrapCount: 100}} 
							position={{x: 0.015, y: 0.081, z: 0.002}} rotation={{x: 0, y: 0, z: 0}} scale={{x:0.6, y:0.6, z:1}}  />
						
						<Entity id="feedback" text={{value: `${feedback}`, color: "white", wrapCount: 100 }} 
							position={{x: 0.015, y: 0.061, z: 0.003}} rotation={{x: 0, y: 0, z: 0}} scale={{x:0.6, y:0.6, z:1}} />
																		
					</Entity>
				</Box>

				<Entity laser-controls
					raycaster={{
						objects: ".clickable",
						near: 0,
						far: 5
					}} />

				<Box id="ncc" 
					geometry={{width: 0.6, height: 0.456, depth: 0.02}} 
					rotation={{x: 270, y: 0, z: 0}} 
					position={{x: 0, y: 0.03, z: -1.344}} 
					scale={{x:1.5, y:1.5, z:1}}
					src="textures/nccstairs.png" repeat="1 1" />

				<Entity id="directionalLight" class="customlight" primitive="a-light" light={{type: "point", castShadow:true, intensity:0.4}} position={{x:-2.25,y:13,z:4.25}} />
				<Entity id="ambientLight" class="customlight" primitive="a-light" type="ambient" color="#fff" intensity="0.6" />
				
				<House rise={this.state.rise} run={this.state.run} stepcount={this.state.stepcount} />
									
			</Scene>
		)
	}
}

const House = (props) => (
	
	<Entity id="house"
		rotation={{x: 0, y: -90, z: 0}} 	
		position={{x: 1.125, y: 0, z: -0.5}}
		>
			
		<Entity id="houseStructure" shadow={{cast: true, receive: true}} roughness="0.5" >
			<Box id="topFloor" geometry={{width: 8, height: 0.25, depth: 10}} position={{x:-9, y:2.6, z:0}} repeat="16 20" src="textures/wood.jpg" color="peru" />	
			<Box id="backWall" geometry={{width: 9.5, height: 2.7, depth: 0.25}} position={{x:-8.25, y:4.075, z:-4.875}} color="ivory" />
			<Box id="sideWall" geometry={{width: 0.25, height: 2.7, depth: 10}} position={{x:-12.875, y:4.075, z:0}} color="ivory" />
			<Box id="landing" geometry={{width: 1.5, height: 0.25, depth: 5}} position={{x:-4.25, y:2.6, z:-2.5}} repeat="3 10" src="textures/wood.jpg" color="peru" />
		</Entity>
			
		<Entity id="lowerStructure" shadow={{cast: true, receive: true}}>	
			<Entity id="supportPoles" metalness="0.3" color="#f1f1f1" roughness="0.3" >

				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-5.125, y:1.375, z:4.875}} />
				<Box geometry={{width: 0.015, height: 3.65, depth: 0.015}} position={{x:-6.5, y:1.35, z:4.875}} rotation={{x:0, y:0, z: 50}} />
				<Box geometry={{width: 0.015, height: 3.65, depth: 0.015}} position={{x:-6.5, y:1.35, z:4.875}} rotation={{x:0, y:0, z: -50}} />
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-7.8, y:1.375, z:4.875}} />					
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-10.4, y:1.375, z:4.875}} />					
				<Box geometry={{width: 0.015, height: 3.1, depth: 0.015}} position={{x:-11.6, y:1.35, z:4.875}} rotation={{x:0, y:0, z: 50}} />
				<Box geometry={{width: 0.015, height: 3.1, depth: 0.015}} position={{x:-11.6, y:1.35, z:4.875}} rotation={{x:0, y:0, z: -50}} />
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-12.8, y:1.375, z:4.875}} />					

				<Box geometry={{width: 0.015, height: 5.3, depth: 0.015}} position={{x:-12.8, y:1.35, z:2.475}} rotation={{x:66, y:0, z: 0}} />
				<Box geometry={{width: 0.015, height: 5.3, depth: 0.015}} position={{x:-12.8, y:1.35, z:2.475}} rotation={{x:-66, y:0, z: 0}} />

				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-5.125, y:1.375, z:-0.125}} />
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-12.8, y:1.375, z:0}} />					

				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-5.125, y:1.375, z:-4.875}} />
				<Box geometry={{width: 0.015, height: 3.65, depth: 0.015}} position={{x:-6.5, y:1.35, z:-4.875}} rotation={{x:0, y:0, z: 50}} />
				<Box geometry={{width: 0.015, height: 3.65, depth: 0.015}} position={{x:-6.5, y:1.35, z:-4.875}} rotation={{x:0, y:0, z: -50}} />
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-3.625, y:1.375, z:-0.125}} />					
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-3.625, y:1.375, z:-4.875}} />					
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-7.8, y:1.375, z:-4.875}} />					
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-10.4, y:1.375, z:-4.875}} />					
				<Box geometry={{width: 0.015, height: 3.1, depth: 0.015}} position={{x:-11.6, y:1.35, z:-4.875}} rotation={{x:0, y:0, z: 50}} />
				<Box geometry={{width: 0.015, height: 3.1, depth: 0.015}} position={{x:-11.6, y:1.35, z:-4.875}} rotation={{x:0, y:0, z: -50}} />
				<Box geometry={{width: 0.125, height: 2.69, depth: 0.125}} position={{x:-12.8, y:1.375, z:-4.875}} />					

				<Box geometry={{width: 0.015, height: 5.3, depth: 0.015}} position={{x:-3.6, y:1.35, z:-2.5}} rotation={{x:66, y:0, z: 0}} />
				<Box geometry={{width: 0.015, height: 5.3, depth: 0.015}} position={{x:-3.6, y:1.35, z:-2.5}} rotation={{x:-66, y:0, z: 0}} />

			</Entity>
			
			<Box id="groundFloor" geometry={{width: 15, height: 0.25, depth: 12}} position={{x:-7, y:-0.1, z:0}} repeat="20 10" src="textures/concrete.jpg" roughness="0.5" color="#cccccc" />
		
		</Entity>
		
		<Staircase rise={props.rise} run={props.run} stepcount={props.stepcount} />
		
	</Entity> // end of building level 1
)



class Staircase extends React.Component {
	constructor(props) {
		super(props);
	}
	render() {
		
		// the basic measurements input by the user, used to make each step
		const rise = this.props.rise;
		const run = this.props.run;
		const count = this.props.stepcount;
			
		// create an array of steps, based on the measurements above
		var steps = [];
		for (var s=0; s<count; s++) {
			
			var stepWidth = 1.5;
			var triangleLeft = stepWidth * -0.5 + 0.3;
			var triangleRight = stepWidth * 0.5 - 0.3;
			
			var posy = (s * rise) + (0.5 * rise);
			var posz = -(s * run) - (0.5 * run);
			
			var stringerA = "0 1 0";
			var stringerB = "0 -1 0";
			var stringerC = "2 -1 0";
			
			var stringerY = posy-rise;
			var stringerZ = posz+run*0.5;
			var stringerS = run/2 + " " + rise/2 + " 1";
						
			steps.push(
				<Entity>
				
					<Entity primitive="a-box" 
						width={stepWidth} 
						height="0.05" 
						depth={run} 
						position={{ x:0, y:posy-(rise/2), z:posz }} 
						geometry={{buffer: false, skipCache: true }} 
						roughness="1" 
						color="sienna"
						src="textures/wood.jpg" 
						repeat="3 1"
						roughness="0.5" />
					
					<Entity primitive="a-triangle" 
						rotation="0 -90 180" 
						scale={stringerS}
						geometry={{ vertexA: stringerA, vertexB: stringerB, vertexC: stringerC, buffer: false, skipCache: true }}
						position={{x: triangleLeft, y:stringerY, z:stringerZ}} 
						metalness="0.3" material={{color:"#f1f1f1"}} roughness="0.3" 
						side="double" />

					<Entity primitive="a-triangle" 
						rotation="0 -90 180" 
						scale={stringerS}
						geometry={{ vertexA: stringerA, vertexB: stringerB, vertexC: stringerC, buffer: false, skipCache: true }}
						position={{x: triangleRight, y:stringerY, z:stringerZ}} 
						 metalness="0.3" material={{color:"#f1f1f1"}} roughness="0.3" 
						side="double" />
							
				</Entity>
			)
			
		}		
				
		return(
			
			<Entity id="staircase" rotation={{x: 0, y:0, z:0}} position={{x:-4.25, y:0.175, z:run*count}}  shadow={{cast: true, receive: false}} >
				{steps}					
			</Entity>
			
		)
	}
}

ReactDOM.render(<World />,document.getElementById("app"));
// if you want to re-enable enter-vr-mode use document.body