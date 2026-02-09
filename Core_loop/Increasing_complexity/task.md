Finally, to keep the game interesting, we need to support increasing difficulty. As the player scores more points, the world should gently push back — enemies get bolder, faster, and more frequent, while our hero gains experience and becomes stronger with every step forward.

We’ve prepared the agent prompt with technical details on how to adjust the game difficulty based on the current score.

So, what are the key concepts for this step?

### Speed and pressure
As the score grows, the world should start to feel a bit more intense. Enemies become harder to ignore, and our hero has to react faster to stay in control. In this block, we’ll tune the overall pace of the game:
* `Enemy Spawn Delay` – Enemies should appear more often.
* `Enemy Movement Speed` – Enemies should move faster.
* `Player Movement Speed` – The hero should also move a little faster.

### Attacks and responsiveness
If the game only made enemies faster, it would quickly feel unfair. To keep things playable, we’ll also give the hero a small boost in how attacks work, so the player can keep up as the pressure rises:
* `Player Attack Delay` – The hero's attack speed should increase slightly.
* `Player Attack Distance` – The hero's attack range should also be slightly increased.

### Scaling logic
Instead of hard jumps in difficulty, we’ll scale everything gradually. You’ll calculate a difficulty factor based on the current score using a growth speed constant, and then change the parameters linearly with that factor. One important detail is that enemy parameters should scale a bit faster than player parameters — the hero shouldn’t just "outgrow" the enemies, the challenge should stay alive as the score climbs.

### Animation loop integration
Dynamic difficulty only works if it stays up to date. Recalculate the difficulty factor and the updated parameters in each frame inside the animation loop using the current score, and apply the new speeds and delays to the enemy systems and the player systems. This way, the game smoothly adapts in real time as the player’s score increases.

### Putting it all together
Use the specification from the `spec.md` file to implement the increasing complexity system. It will recalculate a difficulty factor from the current score and apply the updated spawn delays, movement speeds, and attack timing/range in the animation loop.

Please note that the complexity and feel of the game depend a lot on the ratio between these parameters. Try changing this dependency and select the ideal balance for your game. You should get something like this:
![](images/speed.gif)
