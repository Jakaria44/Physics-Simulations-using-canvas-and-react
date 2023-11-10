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