```javascript
// ----- Basic UI + game wiring -----
const HUMAN_COLOR = 'w'; // human plays white by default
const boardEl = document.getElementById('board');
const movesEl = document.getElementById('moves');
const statusText = document.getElementById('statusText');
const resultEl = document.getElementById('result');
const depthEl = document.getElementById('depth');
const depthLabel = document.getElementById('depthLabel');

const undoBtn = document.getElementById('undoBtn');
const resetBtn = document.getElementById('resetBtn');
const humanColorLabel = document.getElementById('humanColor');

const game = new Chess(); // from chess.js
let selectedSquare = null;

// piece maps (Unicode)
const whiteMap = {p:'♙',r:'♖',n:'♘',b:'♗',q:'♕',k:'♔'};
const blackMap = {p:'♟',r:'♜',n:'♞',b:'♝',q:'♛',k:'♚'};

depthEl.addEventListener('input', ()=>{depthLabel.textContent = depthEl.value});
undoBtn.addEventListener('click', ()=>{game.undo();game.undo();updateBoard();});
resetBtn.addEventListener('click', ()=>{game.reset();updateBoard(); resultEl.style.display='none';statusText.textContent='Game reset';});

humanColorLabel.textContent = HUMAN_COLOR === 'w' ? 'White' : 'Black';

// board rendering (a1 bottom-left)
function renderBoard(){
  boardEl.innerHTML = '';
  const board = game.board(); // 8x8 array [rank][file] with 0..7
  for(let r=7;r>=0;r--){
    for(let f=0;f<8;f++){
      const sq = String.fromCharCode(97+f) + (r+1);
      const cell = document.createElement('div');
      cell.className = 'square ' + (((r+f)%2===0)?'light':'dark');
      cell.dataset.square = sq;
      cell.addEventListener('click', onSquareClick);
      const piece = board[r][f];
      if(piece){
        const symbol = pieceSymbol(piece);
        cell.textContent = symbol;
      }
      boardEl.appendChild(cell);
    }
  }
  highlightLegal();
}

function pieceSymbol(piece){
  return piece.color === 'w' ? whiteMap[piece.type] : blackMap[piece.type];
}

function onSquareClick(e){
  const sq = e.currentTarget.dataset.square;
  // select -> move pattern
  if(selectedSquare){
    // attempt move
    const moves = game.moves({square: selectedSquare, verbose:true});
    const found = moves.find(m=>m.to === sq);
    if(found){
      // if promotion, promote to queen
      game.move({from:selectedSquare,to:sq,promotion:found.promotion||'q'});
      selectedSquare = null;
      updateBoard();
      if(game.game_over()) return endGameCheck();
      window.setTimeout(makeAIMove, 250);
      return;
    }
    // otherwise change selection or deselect
    const piece = game.get(sq);
    if(piece && piece.color === game.turn()) selectedSquare = sq;
    else selectedSquare = null;
  } else {
    const piece = game.get(sq);
    if(piece && piece.color === game.turn()) selectedSquare = sq;
  }
  highlightLegal();
}

function highlightLegal(){
  document.querySelectorAll('.square').forEach(s=>s.classList.remove('highlight'));
  if(!selectedSquare) return;
  const sqEl = document.querySelector(`[data-square='${selectedSquare}']`);
  if(sqEl) sqEl.classList.add('highlight');
  const moves = game.moves({square:selectedSquare});
  moves.forEach(m=>{
    const el = document.querySelector(`[data-square='${m}']`);
    if(el) el.classList.add('highlight');
  });
}

function updateBoard(){
  renderBoard();
  renderMoves();
  statusText.textContent = describeStatus();
}

function renderMoves(){
  const history = game.history({verbose:true});
  movesEl.innerHTML = '';
  for(let i=0;i<history.length;i+=2){
    const num = (i/2)+1;
    const w = history[i] ? history[i].san : '';
    const b = history[i+1] ? history[i+1].san : '';
    const row = document.createElement('div');
    row.textContent = `${num}. ${w} ${b}`;
    movesEl.appendChild(row);
  }
}

function describeStatus(){
  if(game.in_checkmate()) return `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
  if(game.in_stalemate()) return 'Stalemate';
  if(game.in_draw()) return 'Draw';
  if(game.in_check()) return 'Check';
  return (game.turn() === HUMAN_COLOR ? 'Your move' : "AI thinking...");
}

function endGameCheck(){
  updateBoard();
  resultEl.style.display = 'block';
  if(game.in_checkmate()){
    resultEl.textContent = `Checkmate — ${game.turn() === 'w' ? 'Black' : 'White'} wins`;
  } else if(game.in_stalemate()){
    resultEl.textContent = 'Stalemate — Draw';
  } else if(game.in_threefold_repetition()){
    resultEl.textContent = 'Threefold repetition — Draw';
  } else if(game.insufficient_material()){
    resultEl.textContent = 'Insufficient material — Draw';
  } else {
    resultEl.textContent = 'Game over';
  }
}

// ----- AI (minimax with alpha-beta using chess.js move generator) -----

const pieceValues = {p:100,n:320,b:330,r:500,q:900,k:20000};

function evaluateBoard(g){
  // simple material evaluation from White's perspective
  const board = g.board();
  let score = 0;
  for(let r=0;r<8;r++){
    for(let f=0;f<8;f++){
      const p = board[r][f];
      if(p){
        const val = pieceValues[p.type];
        score += (p.color === 'w' ? val : -val);
      }
    }
  }
  return score;
}

function minimax(g, depth, alpha, beta, isMaximizing){
  if(depth === 0 || g.game_over()){
    return evaluateBoard(g);
  }
  const moves = g.moves({verbose:true});
  if(isMaximizing){
    let maxEval = -Infinity;
    for(const m of moves){
      g.move(m);
      const evalScore = minimax(g, depth-1, alpha, beta, false);
      g.undo();
      if(evalScore > maxEval) maxEval = evalScore;
      if(evalScore > alpha) alpha = evalScore;
      if(beta <= alpha) break; // beta cutoff
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for(const m of moves){
      g.move(m);
      const evalScore = minimax(g, depth-1, alpha, beta, true);
      g.undo();
      if(evalScore < minEval) minEval = evalScore;
      if(evalScore < beta) beta = evalScore;
      if(beta <= alpha) break; // alpha cutoff
    }
    return minEval;
  }
}

function chooseBestMove(g, depth){
  const moves = g.moves({verbose:true});
  let bestMove = null;
  if(g.turn() === 'w'){
    let bestScore = -Infinity;
    for(const m of moves){
      g.move(m);
      const score = minimax(g, depth-1, -Infinity, Infinity, false);
      g.undo();
      if(score > bestScore){ bestScore = score; bestMove = m; }
    }
  } else {
    let bestScore = Infinity;
    for(const m of moves){
      g.move(m);
      const score = minimax(g, depth-1, -Infinity, Infinity, true);
      g.undo();
      if(score < bestScore){ bestScore = score; bestMove = m; }
    }
  }
  return bestMove;
}

function makeAIMove(){
  if(game.game_over()) return endGameCheck();
  const depth = parseInt(depthEl.value,10);
  statusText.textContent = 'AI thinking...';
  // small delay so UI updates
  window.setTimeout(()=>{
    const best = chooseBestMove(game, depth);
    if(best){
      game.move(best);
      updateBoard();
      if(game.game_over()) endGameCheck();
    } else {
      // no legal move
      endGameCheck();
    }
  }, 50);
}

// start with render
updateBoard();

// If AI is black and white moves first (human white), no need to auto move. If human chose black, we'd call makeAIMove at start.
```

---

