'use strict';

var gl;
var program;
var points = [];
var numDivisions = 4;
var _gasket = true;

var originalTriangle = [
  vec2(-(Math.sqrt(3)/2), -0.5),
  vec2(0, 1),
  vec2((Math.sqrt(3)/2), -0.5)
];

var resetPoints = function() {
  points = [];
};

var addTriangle = function(bottomLeft, topMiddle, bottomRight) {
  points.push(bottomLeft, topMiddle, bottomRight);
};

var calculateMidPoint = function(vec2PointA, vec2PointB) {
  return mix(vec2PointA, vec2PointB, 0.5);
};

var divideTriangle = function(a, b, c, count) {
  var ab, ac, bc;
  if (count === 0) {
      addTriangle(a, b, c);
  }
  else {
    ab = calculateMidPoint(a, b);
    ac = calculateMidPoint(a, c);
    bc = calculateMidPoint(b, c);

    divideTriangle(a, ab, ac, count-1);
    divideTriangle(c, ac, bc, count-1);
    divideTriangle(b, bc, ab, count-1);
  }
};

var render = function() {
  var newPoints = points.map(function(vertex) {
    return vec2(vertex[0], vertex[1]);
  });

  loadBuffer(newPoints);
  var colorLocation = gl.getUniformLocation(program, "u_color");

  gl.clear(gl.COLOR_BUFFER_BIT);

  // Full triangles
  gl.uniform4f(colorLocation, 1, 0, 0, 1);
  gl.drawArrays(gl.TRIANGLES, 0, points.length);

  // Borders
  gl.uniform4f(colorLocation, 0, 0, 0, 1);
  for (var i=0; i<points.length; i+=3) {
    gl.drawArrays( gl.LINE_LOOP, i, 3);
  }
};

var loadBuffer = function(data) {
  var bufferId = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  gl.bufferData(gl.ARRAY_BUFFER, flatten(data), gl.STATIC_DRAW);

  var vPosition = gl.getAttribLocation(program, 'vPosition');
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(vPosition);
};

var doDivide = function(numDivisions) {
  resetPoints();
  divideTriangle(originalTriangle[0], originalTriangle[1], originalTriangle[2], numDivisions);
};

var updateTriangle = function(evt) {
  doDivide(document.getElementById('numDivisions').valueAsNumber);
  var fills = document.getElementsByName('fill');
  for (var i = 0; i < fills.length; i++) {
    if (fills[i].checked) {
        _fill = fills[i].value;
        break;
    }
  }
  render();
};

window.onload = function init() {
  // Handlers
  document.getElementById('settings').addEventListener('change', updateTriangle);

  // Initialization
  var canvas = document.getElementById('gl-canvas');
  gl = WebGLUtils.setupWebGL(canvas);
  if ( !gl ) {
    alert('WebGL isn`t available');
  }

  gl.viewport(0, 0, canvas.width, canvas.height);

  // Shaders
  program = initShaders(gl, 'vertex-shader', 'fragment-shader');
  gl.useProgram( program );

  gl.clearColor(0.0, 0.0, 0.0, 0.0);
  divideTriangle(originalTriangle[0], originalTriangle[1], originalTriangle[2], numDivisions);
  render();
};
