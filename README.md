# Against the Clock ⏰

"Against the Clock" is a 2-player, turn-based trivia game built with vanilla JavaScript, HTML, and CSS. Players compete to answer a set number of questions as quickly as possible. The winner is determined not just by the number of correct answers, but by the time left on their clock, which is then used to calculate a final "money" prize.

*(Optional: Add a screenshot of your game here)*
`![Screenshot of the Against the Clock game interface]`

---

## 🚀 Key Features

* **2-Player Turn-Based Gameplay:** Player 1 completes their round, and then Player 2 takes their turn to beat their score.
* **Time-Based Competition:** Each player has a personal countdown timer. The player with the most correct answers wins. If scores are tied, the player with the most time *remaining* wins.
* **Dynamic Question Loading:** All trivia questions are loaded asynchronously from an external `questions.json` file using the browser's `fetch` API.
* **Unique Rounds:** To ensure fairness, each player receives a unique, randomized set of questions for their round, drawn from the main question pool.
* **Randomized Winnings:** A random prize amount is chosen at the start of each game. The winner's "winnings" are calculated by multiplying their remaining time by this random money value.
* **Configurable Game Settings:** A hidden settings panel allows the user to change the `TOTAL_TIME` and the `QUESTIONS_PER_PLAYER` for a customized game experience.
* **Clean UI:** Styled with CSS Grid for the answer layout and uses Google Fonts and Material Icons for a clean, modern look.

---

## 🛠 Tech Stack

* **HTML5**
* **CSS3** (CSS Grid, Flexbox, Google Fonts)
* **JavaScript (ES6+)**
* **JSON** (for question data)
* **Fetch API** (for asynchronous data loading)

---

## 🕹️ How to Play

1.  Open the `index.html` file in your web browser.
2.  *(Optional)* Click the settings icon in the top-left corner to set your preferred round time and number of questions.
3.  Click **"Start Player 1"**.
4.  Answer all the questions before the timer runs out.
5.  Click **"Start Player 2"**.
6.  Player 2 completes their round.
7.  The winner is announced, and their winnings are calculated!
8.  Click **"New Round"** or **"Reset"** to play again.

*(Note: Because this game uses the `fetch` API to load `questions.json`, it must be run from a web server. Opening the `index.html` file directly from your local file system may cause a CORS error.)*

