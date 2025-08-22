 
const canvas = document.getElementById("networkCanvas");
const ctx = canvas.getContext("2d");

canvas.width = canvas.parentElement.clientWidth;
canvas.height = canvas.parentElement.clientHeight;

window.addEventListener("resize", () => {
  canvas.width = canvas.parentElement.clientWidth;
  canvas.height = canvas.parentElement.clientHeight;
  drawNodes();
});

let nodes = []; 
let selectedNode = null; 
let isDragging = false;


class Node {
  constructor(x, y, label) {
    this.x = x;
    this.y = y;
    this.radius = 25;
    this.label = label;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#58a6ff";
    ctx.fill();
    ctx.strokeStyle = "#f5f5f5";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.closePath();

    
    ctx.fillStyle = "#fff";
    ctx.font = "14px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.label, this.x, this.y + 4);
  }

  isClicked(mx, my) {
    const dx = mx - this.x;
    const dy = my - this.y;
    return dx * dx + dy * dy <= this.radius * this.radius;
  }
}

function drawNodes() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  nodes.forEach(node => node.draw(ctx));
}


document.getElementById("addNode").addEventListener("click", () => {
  const x = Math.random() * (canvas.width - 100) + 50;
  const y = Math.random() * (canvas.height - 100) + 50;
  const label = "Node " + (nodes.length + 1);
  nodes.push(new Node(x, y, label));
  drawNodes();
});


canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  nodes.forEach(node => {
    if (node.isClicked(mx, my)) {
      selectedNode = node;
      isDragging = true;
    }
  });
});

canvas.addEventListener("mousemove", (e) => {
  if (isDragging && selectedNode) {
    const rect = canvas.getBoundingClientRect();
    selectedNode.x = e.clientX - rect.left;
    selectedNode.y = e.clientY - rect.top;
    drawNodes();
  }
});

canvas.addEventListener("mouseup", () => {
  isDragging = false;
  selectedNode = null;
});
