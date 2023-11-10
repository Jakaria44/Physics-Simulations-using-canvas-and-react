/**
 * 
 * @param {object} context  
 * @param {object} from object as {x,y} of initial position 
 * @param {object} to  object as {x,y} of initial position
 * @param {number} radius size of the arrow head
 * @param {string} color color of the arrow
 */

export default function drawArrow(context,from, to, radius, color){

  context.fillStyle=color;
  // Calculate the arrow direction
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  // Draw the line
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(to.x, to.y);
  context.stroke();

  // Draw the arrowhead
  context.beginPath();
  context.moveTo(to.x, to.y);
  context.lineTo(
    to.x - radius * Math.cos(angle - Math.PI / 6),
    to.y - radius * Math.sin(angle - Math.PI / 6)
  );
  context.lineTo(
    to.x - radius * Math.cos(angle + Math.PI / 6),
    to.y - radius * Math.sin(angle + Math.PI / 6)
  );
  context.closePath();
  context.fill();
  



}

/**
 * 
 * @param {context} context 
 * @param {object} from 
 * @param {number} angle 
 * @param {number} length 
 * @param {number} radius 
 * @param {string} color 
 */

export const drawArrowByAngle = (context,from, angle, length, radius, color) => {
  context.fillStyle=color;
  // Calculate the arrow direction
  const dx = length * Math.cos(angle);
  const dy = -length * Math.sin(angle);

  // Draw the line
  context.beginPath();
  context.moveTo(from.x, from.y);
  context.lineTo(from.x + dx, from.y + dy);
  context.stroke();

  // Calculate arrowhead angles
  const arrowAngle1 = angle + Math.PI / 6;
  const arrowAngle2 = angle - Math.PI / 6;


  // Draw the arrowhead
  context.beginPath();
  context.moveTo(from.x + dx, from.y + dy);
  context.lineTo(
    from.x + dx - radius * Math.cos(arrowAngle1),
    from.y + dy + radius * Math.sin(arrowAngle1)
  );  
  context.lineTo(
    from.x + dx - radius * Math.cos(arrowAngle2),
    from.y + dy + radius * Math.sin(arrowAngle2)
  );


  context.closePath();
  context.fill(); 

}
  