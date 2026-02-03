One of the main reward in the game is amount of score. Just remember how often have you heard someone boast that they scored more points in a game than all their friends? Let's add this to our game. Since the increase in points should be proportional to the amount of effort expended by the player, we need to take into account the time the player stays alive and the number of enemies defeated as rewards.

We've prepared the agent prompt with technical details on how to implement this scoring system.

So, what do we need to pay attention to?
### Scoring logic
The score should reflect both how long the player survives and how many enemies they defeat — but not equally. Surviving is important, however simply running around and avoiding danger is easier than actually taking down an enemy. Defeating enemies requires more effort and risk, so it should be rewarded much more.

Let’s set the rules:
- **survival reward** will add 1 point for every 10 seconds the player stays alive.
- **kill reward** will add 10 points for each enemy defeated.

Track survival time and continuously update the score during the game.
### Score UI
Now that we have rules for calculating score, it’s important to actually see it during the game. Add a small score display at the top of the screen and keep it visible while the player is moving around. Update the text whenever the score changes so the player gets instant feedback, and make sure the number shown is always rounded down to a clean whole value.

### Customize the difficulty
Game balance often comes down to a couple of simple numbers. To make scoring easy to adjust, let’s keep the rewards as constants from the start.

Set up two constants `SCORE_PER_SECOND=0.1` (which equals 1 point per 10 seconds) and `SCORE_PER_KILL=10`, so you can rebalance the game later without rewriting the logic. If the score grows too slowly or too quickly, just tweak these values and see how the gameplay feel changes.

### Putting it all together
Use the specification from the `spec.md` file to implement the scoring system. It should handle time-based scoring, add points for defeated enemies, and keep the score display updated on screen.

Try changing the code manually or ask Junie to better understand what customization options you have. You should get something like this:

![](images/score.gif)