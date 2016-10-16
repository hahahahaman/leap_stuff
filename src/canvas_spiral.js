var canvas = document.getElementById("picture");
var width = canvas.width; // = window.innerWidth;
var height = canvas.height;// = window.innerHeight;
var ctx = canvas.getContext("2d");
var shapes = 50;

ctx.translate(width/2,height/2);
ctx.save();

Leap.loop(function(obj) {
    if (obj.hands.length < 1) return;

    var str = "";
    for (var i in obj.handsMap) {
        var hand = obj.handsMap[i];

        var pos = hand.palmPosition;
        // var pos = hand.sphereCenter;
        // var palm_vel = hand.palmVelocity;
        var radius = hand.sphereRadius;
        // for(var i = 0; i<3; i++){
        //     palm_vel[i] = Math.trunc(Math.abs(palm_vel[i]))/5;
        // }

        var norm = hand.palmNormal;

        ctx.restore();
        ctx.fillStyle = "rgba(255,255,255,0.4)";
        // ctx.fillStyle = "rgba(" + palm_vel[0] + "," + palm_vel[1] + "," + palm_vel[2] + ",0.4)";
        ctx.fillRect(-width/2,-height/2,width,height);
        ctx.save();


        ctx.translate(pos[0], pos[1]);
        for (var i = 0; i<shapes; i++) {
            var saturation = Math.round(Math.abs(pos[2]+10));
            ctx.fillStyle = "hsl(" + (i/shapes)* 360 + "," + saturation + "%,40%)";

            ctx.translate(Math.round(i*0.2),0);
            ctx.rotate(norm[1]*Math.PI/5);
            // ctx.fillRect(0,0,1+i*Math.abs(norm[1]),1+i*Math.abs(norm[0]));
            ctx.beginPath();
            ctx.arc(0, 0, i, 0, Math.PI);
            // ctx.fillStyle = 'green';
            ctx.fill();
            // ctx.lineWidth = 0;
            // ctx.strokeStyle = '#003300';
            // ctx.stroke();
        }
        // ctx.save();

        ctx.setTransform(1,0,0,1,0,0);
        hand.fingers.forEach(function (finger){
            var tip_pos = finger.tipPosition;
            var dir = finger.direction;
            // ctx.fillStyle = "rgba(255,255,0,1)";
            ctx.fillStyle = "rgba("+ Math.trunc(Math.abs(dir[0]*255)) + "," + Math.trunc(Math.abs(dir[1]*255)) + "," + Math.trunc(Math.abs(dir[2]*255)) + ",0.6)";
            ctx.fillRect(tip_pos[0]+width/2,tip_pos[2]+height/2, 10, 10);
        });


        str += "<p>" +
            // "<strong>Roll:</strong> " + hand.roll() +
            // "<br/><strong>Pitch:</strong> " + hand.pitch() +
            // "<br/><strong>Yaw:</strong> " + hand.yaw() +
            "<br/><strong>Palm Position:</strong> " + hand.palmPosition +
            "<br/><strong>Palm Normal:</strong> " + hand.palmNormal +
            "<br/><strong>Sphere Center:</strong> " + hand.sphereCenter +
            "<br/><strong>Palm Velocity:</strong> " + hand.palmVelocity +
            "<br/><strong>Sphere Center:</strong> " + hand.sphereCenter +
            "<br/><strong>Sphere Radius:</strong> " + hand.sphereRadius +
            "</p>";
    }
    console.log(str);
    document.getElementById('out').innerHTML = str;
});
