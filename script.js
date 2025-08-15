* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    height: 100vh;
    background: linear-gradient(270deg, #89f7fe, #66a6ff, #ff9a9e, #fad0c4);
    background-size: 800% 800%;
    animation: gradientBG 15s ease infinite;
    display: flex;
    justify-content: center;
    align-items: center;
}

@keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}

.app {
    text-align: center;
    background: rgba(255, 255, 255, 0.2);
    padding: 20px;
    border-radius: 20px;
    backdrop-filter: blur(10px);
    width: 350px;
    animation: popIn 1s ease;
}

@keyframes popIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
}

.title {
    color: white;
    margin-bottom: 20px;
    font-size: 26px;
    text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
}

.search-box {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
}

.search-box input {
    padding: 10px;
    border-radius: 10px 0 0 10px;
    border: none;
    outline: none;
    font-size: 16px;
}

.search-box button {
    padding: 10px;
    border-radius: 0 10px 10px 0;
    border: none;
    background: #ff758c;
    color: white;
    cursor: pointer;
    transition: 0.3s;
}

.search-box button:hover {
    background: #ff527b;
}

.weather-card {
    background: rgba(255, 255, 255, 0.3);
    padding: 20px;
    border-radius: 15px;
    animation: fadeIn 1.5s ease;
}

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
}

.icon {
    font-size: 50px;
    margin-bottom: 10px;
    animation: bounce 2s infinite;
}

@keyframes bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
}

h2 {
    font-size: 28px;
    margin: 10px 0;
}

h3 {
    font-size: 20px;
    font-weight: 400;
    color: #333;
}

p {
    font-size: 16px;
    color: #444;
}
