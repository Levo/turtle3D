
var gl;
var n;
var u_ViewMatrix;
var u_ProjMatrix;
var viewMatrix;
var projMatrix;
var u_LightColor;
var u_lightPosition;
var u_AmbientLight;
var u_modelMatrix;
var modelMatrix;
var u_normalMatrix;
var normalMatrix;
var canvas;
var a_Position;
var rotate = true;
var turtle = new turtle(0.0, 0.0, 0.0);
var reader = new reader();

var vertices = new Float32Array([
  0.0, 0.0, 0.0,   0.0, 0.0, 0.0,  
]);

var colors = new Float32Array([
  0.0, 0.0, 0.0,   0.0, 0.0, 0.0,  
]);
reader.decode();

var eye = new Vector4(0.0, 5.0, 25.0);
var up = new Vector4(0.0, 1.0, 0.0);
var nUp = new Vector4(0.0, 1.0, 0.0);
var r = new Vector4(0.0, 0.0, 0.0);
var at = new Vector4(0.0, 5.0, 0.0);
var view = new Vector4(0.0, 0.0, 0.0);

var frustum = {
  l : -1.0,
  r :  1.0,
  b : -1.0,
  t :  1.0,
  n :  1.0,
  f :  100.0
}

// Vertex shader program
var VSHADER_SOURCE = 
  'attribute vec4 a_Position;\n' + 
  'attribute vec4 a_Color;\n' + 
  'attribute vec4 a_Normal;\n' +        // Normal
  'uniform mat4 u_ViewMatrix;\n' +
  'uniform mat4 u_ProjMatrix;\n'+
  'uniform mat4 u_normalMatrix;\n'+
  'uniform mat4 u_modelMatrix;\n'+
  'uniform vec3 u_LightColor;\n' +     // Light color
  'uniform vec3 u_lightPosition;\n'+   // Light position
  'uniform vec3 u_LightDirection;\n' + // Light direction (in the world coordinate, normalized)
  'varying vec4 v_Color;\n' +
  'uniform vec3 u_AmbientLight;\n' + // Ambient light  
  'void main() {\n' +
  '  vec4 vertexPosition = u_modelMatrix * a_Position;\n' +
  '  vec3 lightDirection = normalize(u_lightPosition - vec3(vertexPosition));\n'+
  '  gl_Position = u_ProjMatrix * u_ViewMatrix * u_modelMatrix * a_Position;\n' +
  // Make the length of the normal 1.0
  '  vec3 normal = normalize(vec3(u_normalMatrix * a_Normal));\n' +
  '  vec3 ambient = u_AmbientLight * a_Color.rgb;\n' + 
  // Dot product of the light direction and the orientation of a surface (the normal)
  '  float nDotL = max(dot(lightDirection, normal), 0.0);\n' +
  // Calculate the color due to diffuse reflection
  '  vec3 diffuse = u_LightColor * a_Color.rgb * nDotL;\n' +
  '  vec3 specular =  u_LightColor * a_Color.rgb * (vec3((2.0*nDotL*normal) - lightDirection));\n'+
  '  v_Color = a_Color;\n' +
  '}\n';

// Fragment shader program
var FSHADER_SOURCE = 
  '#ifdef GL_ES\n' +
  'precision mediump float;\n' +
  '#endif\n' +
  'varying vec4 v_Color;\n' +
  'void main() {\n' +
  '  gl_FragColor = v_Color;\n' +
  '}\n';


function calculateView(){

  view.e.x = at.e.x - eye.e.x;
  view.e.y = at.e.y - eye.e.y;
  view.e.z = at.e.z - eye.e.z;

  view.normalize();

}

function calculateR(){

  up.normalize();
  r.cross(view,up);

}

function calculateUp(){


  nUp.cross(r, view);

}

function setViewMatrix(mat){

  // Set the view matrix based of r,up,view
  mat.elements[0] = r.e.x;  mat.elements[4] = r.e.y;  mat.elements[8]  = r.e.z;  mat.elements[12] = 0;
  mat.elements[1] = nUp.e.x;  mat.elements[5] = nUp.e.y;  mat.elements[9]  = nUp.e.z;  mat.elements[13] = 0;
  mat.elements[2] = -view.e.x;  mat.elements[6] = -view.e.y;  mat.elements[10] = -view.e.z;  mat.elements[14] = 0;
  mat.elements[3] = 0;  mat.elements[7] = 0;  mat.elements[11] = 0;  mat.elements[15] = 1;
  // Translate eye to the origin
  mat.translate(-eye.e.x, -eye.e.y, -eye.e.z);

}

function setProjMatrix(mat){

  var left   = frustum.l;
  var right  = frustum.r;
  var bottom = frustum.b;
  var top    = frustum.t;
  var near   = frustum.n;
  var far    = frustum.f;

  var E = (2*near)/(right-left);
  var F = (2*near)/(top-bottom);
  var A = (right + left)/(right - left);
  var B = (top + bottom)/(top - bottom);
  var C = -(far + near)/(far - near);
  var D = (-2*far*near)/(far - near);

  mat.elements[0] = E;  mat.elements[4] = 0;  mat.elements[8]  = A;  mat.elements[12] = 0;
  mat.elements[1] = 0;  mat.elements[5] = F;  mat.elements[9]  = B;  mat.elements[13] = 0;
  mat.elements[2] = 0;  mat.elements[6] = 0;  mat.elements[10] = C;  mat.elements[14] = D;
  mat.elements[3] = 0;  mat.elements[7] = 0;  mat.elements[11] = -1; mat.elements[15] = 0;

}

function setModelMatrix(mat, matIn){

  mat.elements[0] = matIn.elements[0];  mat.elements[4] = matIn.elements[4];  mat.elements[8]  = matIn.elements[8];  mat.elements[12] = matIn.elements[12];
  mat.elements[1] = matIn.elements[1];  mat.elements[5] = matIn.elements[5];  mat.elements[9]  = matIn.elements[9];  mat.elements[13] = matIn.elements[13];
  mat.elements[2] = matIn.elements[2];  mat.elements[6] = matIn.elements[6];  mat.elements[10] = matIn.elements[10];  mat.elements[14] = matIn.elements[14];
  mat.elements[3] = matIn.elements[3];  mat.elements[7] = matIn.elements[7];  mat.elements[11] = matIn.elements[11];  mat.elements[15] = matIn.elements[15];

}

var angle = 0.0;

function main() {

  // Retrieve <canvas> element
  canvas = document.getElementById('webgl');

  gl = getWebGLContext(canvas);

  initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)

  initArrayBuffer(gl, colors, 3, 'a_Color');

  draw();

}

function initArrayBuffer (gl, data, num, attribute) {
  // Create a buffer object
  var buffer = gl.createBuffer();
  if (!buffer) {
    console.log('Failed to create the buffer object');
    return false;
  }
  // Write date into the buffer object
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  // Assign the buffer object to the attribute variable
  var a_attribute = gl.getAttribLocation(gl.program, attribute);
  if (a_attribute < 0) {
    console.log('Failed to get the storage location of ' + attribute);
    return false;
  }
  gl.vertexAttribPointer(a_attribute, 3, gl.FLOAT, false, 0, 0);
  // Enable the assignment of the buffer object to the attribute variable
  gl.enableVertexAttribArray(a_attribute);

  return true;
}



function initVertexBuffers(gl) {

  var n = vertices.length/3; // The number of vertices

  // Create a buffer object
  var vertexBuffer = gl.createBuffer();
  if (!vertexBuffer) {
    console.log('Failed to create the buffer object');
    return -1;
  }

  // Bind the buffer object to target
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  // Write date into the buffer object
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

　// Assign the buffer object to a_Position variable
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

  // Enable the assignment to a_Position variable
  gl.enableVertexAttribArray(a_Position);

  return n;
}

/*
  Redraw scene after camera view changes
*/
function draw(){
  if(rotate){
    angle += 1.0;
  }

  n = initVertexBuffers(gl);

  gl.clearColor(0, 0, 0, 1);  
  gl.enable(gl.DEPTH_TEST);


  u_ViewMatrix = gl.getUniformLocation(gl.program, 'u_ViewMatrix');
  u_ProjMatrix = gl.getUniformLocation(gl.program, 'u_ProjMatrix');
  u_LightColor = gl.getUniformLocation(gl.program, 'u_LightColor');
  u_lightPosition = gl.getUniformLocation(gl.program, 'u_lightPosition');
  u_AmbientLight = gl.getUniformLocation(gl.program, 'u_AmbientLight');
  u_modelMatrix = gl.getUniformLocation(gl.program, 'u_modelMatrix');
  u_normalMatrix = gl.getUniformLocation(gl.program, 'u_normalMatrix');

  a_Position = gl.getAttribLocation(gl.program, 'a_Position');


  /*
    Set the model matrix
  */
  modelMatrix = new Matrix4();
  modelMatrix.setTranslate(0,0.0,0);
  modelMatrix.rotate(angle, 0, 1, 0);

  gl.uniformMatrix4fv(u_modelMatrix, false, modelMatrix.elements);

  normalMatrix = new Matrix4();
  normalMatrix.setInverseOf(modelMatrix);
  normalMatrix.transpose();

  gl.uniformMatrix4fv(u_normalMatrix, false, normalMatrix.elements);


  // Set the ambient light source
  gl.uniform3f(u_AmbientLight, 0.2, 0.2, 0.2);

  // Set the light color
  gl.uniform3f(u_LightColor, 1.0, 1.0, 1.0);

  gl.uniform3f(u_lightPosition, 2.5, 0.0, 2.5);

  viewMatrix = new Matrix4();
  projMatrix = new Matrix4();

  calculateView();
  calculateR();
  calculateUp();

  // Set the view matrix
  setViewMatrix(viewMatrix);

  // Set the proj matrix
  setProjMatrix(projMatrix);

  // Pass the view matrix
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // Pass the projection matrix
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);     // Clear <canvas>

  gl.drawArrays(gl.LINE_STRIP , 0, n);


  window.requestAnimationFrame(draw);
}




