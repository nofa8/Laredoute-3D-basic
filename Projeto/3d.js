import { OrbitControls } from 'three/addons/controls/OrbitControls.js' 
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js' //novo
import * as THREE from 'three'; 

/* cena... */

let on = 0;
let butt = document.getElementById('3Dbutton');
let onNoff = document.getElementById('the_section');
let a_luz = document.getElementById('luz');
let a_ocultar = document.getElementById('Ocultar');
let myCanvas = document.getElementById('myCanvas');
let as_cores = document.getElementById('div_cor');
let as_cores2 = document.getElementById('div_cor2');
let o_resetar = document.getElementById('Reset');
let in_cor = document.getElementById('cores');
let in_cor2 = document.getElementById('cores2');
let esquecivel = document.getElementById('pdp-infos');
let intensidadeLuz = document.getElementById('intensidadeLuz');
let back = document.getElementById('backStyle');
let medidas = document.getElementById('Medidas');
let novo = document.getElementById('material_mesa');

let cena = new THREE.Scene()
cena.background = new THREE.Color('#E6E6FA'); //Cor Lavender.

let mixers = new THREE.AnimationMixer(cena);
let raycaster = new THREE.Raycaster();
let rato = new THREE.Vector2();

let anima_GE= null; //Gaveta Esquerda
let anima_PE= null; //Porta Esquerda
let anima_PD= null; //Porta Direira
let anima_GD= null; //Gaveta Direita


let anima_plane= null; //Plane
let anima_plane1= null; //Plane
let anima_parede= null; //Parede Esquerda
let anima_paredeD= null; //Parede Direita
let anima_poster = null //Plane

let alterrr = null; //Para Alterar o Material
let alterrr_material = null;

let extra = null;

let elementosOcultaveis = ['Poster', 'Tapete_secretaria',
                            'Parede','ParedeL','Plane',
                            "Plantita",'Plane002',"Grande_PC",
                            
                            "Largura","Profundidade","Altura",
                            "Largura_texto","Profundidade_texto","Altura_texto"];
let ocultaveis = []; //Para Ocultar
let extras = []; //Extras
let animaveis = []; //
let elementosObrigatorios= ['Gaveta_E','Gaveta_D','Porta_D','Porta_E',
                            'Tampo','Tampo_2','Nicho',"Pés"]; //Objetos Obrigatorios
let elementos_material_alterar =[];
let cor_base = null; 
let macaco = null;
let macaco_material = null;
let macaco_2 = null;
let macaco_2_material = null;
let macaco_3 = null;
let macaco_3_material = null;

//Light 
let luzAmbiente = null;
let luzPonto = null;
let luzDirecional = null;



/* geometria...  (novo)*/
let carregador = new GLTFLoader()
carregador.load(
    'model/projeto.gltf', 
    function ( gltf ) {
        cena.add( gltf.scene )
        cena.traverse(function(element){
            if (elementosOcultaveis.indexOf(element.name) != -1){
                if (elementosOcultaveis.indexOf(element.name) > 7){
                    element.visible = false;
                    extras.push(element);
                }
                else{
                    ocultaveis.push(element)
                }
            }else if(element.name ==='Tampo'){
                alterrr = element;
                alterrr_material = element.material;
                cor_base = element.material.color;
            }else if((-1 < elementosObrigatorios.indexOf(element.name) )&& (elementosObrigatorios.indexOf(element.name) < 4)){
                animaveis.push(element);
                if (elementosObrigatorios.indexOf(element.name) < 2) {
                    elementos_material_alterar.push(element);
                }
            }
            else if( elementosObrigatorios.indexOf(element.name) != -1 ){
                elementos_material_alterar.push(element);
            }

            

            if (element.isMesh) {
                element.receiveShadow = true;
                element.castShadow = true;
                if (element.name === elementosOcultaveis[4]){
                    extra = element;
                }else if(element.name == "Suzanne001"){
                    macaco = element;
                    macaco_material = element.material.color;
                }else if(element.name == "Suzane_Esfera"){
                    macaco_2 = element;
                    macaco_2_material = element.material.color;
                }
                else if(element.name == "Suzanne"){
                    macaco_3 = element;
                    macaco_3_material = element.material.color;
                }
            }
        });

        anima_plane = animacao('PlaneAnim', anima_plane, gltf);
        anima_paredeD = animacao('ParedeAnim', anima_paredeD, gltf);
        anima_parede = animacao('ParedeLAnim', anima_parede, gltf);
        anima_plane1 = animacao("Plane.002Anim", anima_plane1, gltf);
        anima_poster = animacao("TudoAMexer", anima_poster,gltf);
        anima_GE = animacao('Gaveta_E', anima_GE, gltf);
        anima_GD = animacao('Gaveta_D', anima_GD, gltf);
        anima_PE = animacao('PortaE', anima_PE, gltf);
        anima_PD = animacao('PortaD', anima_PD, gltf);
    }  
)





/* camara.. */
let camara = new THREE.PerspectiveCamera( 50, (window.innerWidth)/ (window.innerHeight*6/7), 0.01, 1000 )
camara.position.set(0,2,4)
camara.lookAt(0,2,0)

/* renderer... */
let renderer = new THREE.WebGLRenderer({antialias: true, canvas: myCanvas})
renderer.setSize( window.innerWidth, window.innerHeight*6/7 )
renderer.setClearColor("#222222");


butt.addEventListener('click',function(){
    if (on == 1){
        on = 0;
        //Retirar 3D
        a_ocultar.style.visibility = 'hidden';
        a_luz.style.visibility = 'hidden';
        as_cores.style.visibility = 'hidden';
        as_cores2.style.visibility = 'hidden';
        intensidadeLuz.style.visibility = 'hidden';
        medidas.style.visibility = 'hidden';
        novo.style.visibility = 'hidden';
        o_resetar.style.visibility = 'hidden';
        onNoff.style.visibility = 'visible';//"hidden"
        esquecivel.style.visibility = 'visible';
        myCanvas.style.visibility = 'hidden';
        butt.innerHTML= "3D";
        
        return;
    };
    on= 1;
    onNoff.style.visibility = 'hidden';//"visible"
    esquecivel.style.visibility = 'hidden';

    as_cores.style.visibility = 'visible';
    as_cores2.style.visibility = 'visible';
    a_ocultar.style.visibility = 'visible';
    a_luz.style.visibility = 'visible';
    novo.style.visibility = 'visible';
    medidas.style.visibility = 'visible';
    intensidadeLuz.style.visibility = 'visible';
    o_resetar.style.visibility = 'visible';
    myCanvas.style.visibility = 'visible';    
    butt.innerHTML= "2D";
    animar();

        
});


var controls = new OrbitControls(camara, renderer.domElement); 
controls.enableDamping = true; 
controls.autoRotate = true; 
controls.autoRotateSpeed = 1.8; 
controls.maxDistance = 2.6; 
controls.minDistance = 0; 
controls.zoomSpeed = 0.4; 
controls.target = new THREE.Vector3(0, .56, 0); 
controls.enablePan = false; 


function animacao(nome, acao, gltf) {
    let anim = THREE.AnimationClip.findByName( gltf.animations, nome );    
    acao = mixers.clipAction( anim );
    acao.clampWhenFinished = true; 
    acao.setLoop(THREE.LoopOnce);
    return acao;
}


let oculto= false;
function mudarVisibilidade() {
    for (let i = 0; i < ocultaveis.length; i++) {
        ocultaveis[i].visible =oculto ;
    }    
    if (oculto) {
        oculto = false;
        a_ocultar.innerHTML = "Ocultar";
    }
    else {
        oculto=true;
        a_ocultar.innerHTML = "Mostrar";
    }
    
    
}
a_ocultar.addEventListener('click', mudarVisibilidade);

window.addEventListener('resize', function(){
    camara.aspect = window.innerWidth / (window.innerHeight*6/7)
    camara.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight*6/7 )
    renderer.render(cena, camara);
});

in_cor.addEventListener('change', function(event){
    alterrr.material.color = new THREE.Color(event.target.value.slice(0,7));
    alterrr.material.transparent = true;
    alterrr.material.opacity = event.target.value.length != 9 ? 1: (parseInt(event.target.value.slice(7),16) /255 );
});
in_cor2.addEventListener('change', function(event){
    
    if (event.target.value.length == 9){
        renderer.setClearColor( event.target.value.slice(0,7) , (parseInt(event.target.value.slice(7),16) /255 ));
        cena.background= null     
        extra.material.color = new THREE.Color(event.target.value.slice(0,7));
        extra.material.transparent = true;
        extra.material.opacity = (parseInt(event.target.value.slice(7),16) /255 );         
    }else{
         cena.background = new THREE.Color(event.target.value.slice(0,7));
         extra.material.color = new THREE.Color(event.target.value.slice(0,7));
         extra.material.opacity = 1;

    }
});
o_resetar.addEventListener('click', function(event){
    reset_e_normal();
    novo.selectedIndex = 0;
    in_cor.value = 'Cor da Secretária';
    in_cor2.value = 'Cor do Fundo';
    luzAmbiente.copy(new THREE.AmbientLight('white'));
    luzAmbiente.intensity = 4;
    cena.background = new THREE.Color('#E6E6FA');
    a_luz.selectedIndex = 0;
    back.style.background = 'white'; 
    back.style.color = 'black';
    intensidadeLuz.selectedIndex = 4;
    document.getElementById('intesiLuz').value = 4;
    if (ocultaveis[0].visible == false) {
        mudarVisibilidade();
    }

    if (extras[0].visible == true) {
        medidas_s();
    }

   let reset = document.getElementsByClassName('clr-field')
   for (let i = 0; i < reset.length; i++) {
        reset.item(i).style.color = "rgb(255,255,255)";
   }
});



myCanvas.addEventListener('click', function(event){
    let limit = event.target.getBoundingClientRect();
    controls.autoRotate = false;
    controls.maxDistance = 10;
    controls.update();

    rato.x = 2 * (event.clientX - limit.left) / parseInt(myCanvas.style.width) - 1;
    rato.y = 1 - 2 * (event.clientY - limit.top) / parseInt(myCanvas.style.height);
    //camara.update();
    raycaster.setFromCamera(rato, camara);
    let intersetados = raycaster.intersectObjects(animaveis); 
    if (intersetados.length > 0) {
        if (intersetados[0].object.parent.name == elementosObrigatorios[0]){
            ativar( anima_GE ); //gaveta esquerda
        }
        else if (intersetados[0].object.parent.name == elementosObrigatorios[1]){
            ativar( anima_GD ); //gaveta direita
        }
        else if (intersetados[0].object.parent.name == elementosObrigatorios[2]){
            ativar( anima_PD ); //porta direita
        }
        else if (intersetados[0].object.parent.name == elementosObrigatorios[3]){
            ativar( anima_PE ); //porta esquerda
        }
        
    }
});

medidas.addEventListener('click', medidas_s);

let lastval = new Array(4);


function trocar_materiais(event){
    let onde = 0;
    if (event.target.value == 0){
        onde = 0;
        normal();
    }
    else if (event.target.value == 1){
        onde = 1;
        segunda_opcao();
    }
    else if(event.target.value == 2 ){
        onde = 2;
        terceira_opcao();
    }else{
        onde = 3;
        quarta_opcao(); 
    }
    in_cor.value = "#"+lastval[onde].getHexString() ;
    document.getElementsByClassName('clr-field')[0].style.color = lastval[onde].getStyle();
};

function reset_e_normal(){ 
    macaco.material.color = macaco_material;
    macaco.material.opacity = 1;
    macaco.material.transparent = false;
    
    macaco_3.material.color = macaco_2_material;
    macaco_3.material.opacity = 1;
    macaco_3.material.transparent = false;

    macaco_2.material.color = macaco_3_material;
    macaco_2.material.opacity = 1;
    macaco_2.material.transparent = false;

    alterrr_material.color = cor_base;
    alterrr_material.opacity = 1;
    alterrr_material.transparent = false;
    normal();

}
function normal(){
    for(let i = 0; i < elementos_material_alterar.length; i++){
        if (elementos_material_alterar[i].isMesh){
            elementos_material_alterar[i].material = alterrr_material;
        }
        else{
            elementos_material_alterar[i].traverse(function(element){
                element.material = alterrr_material
            })
        }
    }
    lastval[0] = alterrr_material.color;
    alterrr.material = alterrr_material;
}
function segunda_opcao(){
    for(let i = 0; i < elementos_material_alterar.length; i++){
        if (elementos_material_alterar[i].isMesh){
            elementos_material_alterar[i].material = macaco.material;
        }
        else{
            elementos_material_alterar[i].traverse(function(element){
                element.material = macaco.material;
                
            })
        }
    }
    lastval[1] = macaco.material.color;
    alterrr.material = macaco.material
}
function terceira_opcao(){
    for(let i = 0; i < elementos_material_alterar.length; i++){
        if (elementos_material_alterar[i].isMesh){
            elementos_material_alterar[i].material = macaco_2.material;
        }
        else{
            elementos_material_alterar[i].traverse(function(element){
                element.material = macaco_2.material
            })
        }
    }
    lastval[2] = macaco_2.material.color;
    alterrr.material = macaco_2.material
}
function quarta_opcao(){
    
    for(let i = 0; i < elementos_material_alterar.length; i++){
        if (elementos_material_alterar[i].isMesh){
            elementos_material_alterar[i].material = macaco_3.material;
        }
        else{
            elementos_material_alterar[i].traverse(function(element){
                element.material = macaco_3.material
            })
        }
    }
    lastval[3] = macaco_3.material.color;
    alterrr.material = macaco_3.material
}

novo.addEventListener('change', trocar_materiais);

function medidas_s(){
    ativar(anima_plane); 
    ativar(anima_plane1); 
    ativar(anima_parede);
    ativar(anima_paredeD);
    ativar(anima_poster);
    
    controls.autoRotate = false;
    controls.update;

    renderer.render(cena,camara)

    if (extras[0].visible == false) {
        for (let i = 0; i < extras.length ; i++ ){
            extras[i].visible = true;
        }
    }else{
        for (let i = 0; i < extras.length ; i++ ){
            extras[i].visible = false;
        }
    }

};


function ativar(action){
    if (action.isScheduled()){
        action.paused = true;
        action.timeScale = -action.timeScale;
        action.paused = false;        
    }
    action.play();
}





// Renderizar e animar
let delta = 0;			  // tempo desde a última atualização
let relogio = new THREE.Clock(); // componente que obtém o delta
let latencia_minima = 1 / 60;    // tempo mínimo entre cada atualização
function animar() {
    if (on == 0){
        return;
    }
    requestAnimationFrame(animar);  // agendar animar para o próximo animation frame
    controls.update()
    
    delta += relogio.getDelta();    // acumula tempo que passou desde a ultima chamada de getDelta

    if (delta  < latencia_minima)   // não exceder a taxa de atualização máxima definida
        return;                     
    renderer.render( cena, camara )
    mixers.update(delta)

    delta = delta % latencia_minima;// atualizar delta com o excedente
}


function luzes(cena) {
    /* luzes... */
    luzAmbiente = new THREE.AmbientLight( "white" )
    luzAmbiente.intensity = 4
    cena.add(luzAmbiente)
    
    /* point light */
    luzPonto = new THREE.PointLight( "white" )
    luzPonto.position.set( 0, 4, 2)
    luzPonto.intensity= 25 		
    cena.add( luzPonto )

    // auxiliar visual
    /*
    const lightHelper1 = new THREE.PointLightHelper( luzPonto, 0.2 )
    cena.add( lightHelper1 )
    */
    /* directional light*/
    luzDirecional = new THREE.DirectionalLight( "white" );
    luzDirecional.position.set( 5, 5, 2 ); //aponta na direção de (0, 0, 0)
    luzDirecional.intensity= 1
    cena.add( luzDirecional );
    // auxiliar visual
    /*
    const lightHelper2 = new THREE.DirectionalLightHelper( luzDirecional, 0.2 )
    cena.add( lightHelper2 )
    */
}

luzes(cena)

a_luz.addEventListener('change', (event) =>{
    let intense = luzAmbiente.intensity;
    if (event.target.value == 0){
        luzAmbiente.copy(new THREE.AmbientLight('white'));
        back.style.backgroundColor = 'white';
        back.style.color = 'black';
    }else if(event.target.value == 1){
        luzAmbiente.copy(new THREE.AmbientLight('#eedd82'));
        back.style.backgroundColor = '#eedd82';
        back.style.color = '#0066A3';
    }else{
        luzAmbiente.copy(new THREE.AmbientLight('#0066A3'));
        back.style.backgroundColor = '#0066A3';
        back.style.color = '#eedd82'
    }
    luzAmbiente.intensity = intense;
    intensidadeLuz.selectedIndex = intense;

});

intensidadeLuz.addEventListener('change', (event)=>{
    luzAmbiente.intensity =  event.target.value;

});