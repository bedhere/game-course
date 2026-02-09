It's time to stop running and start fighting back! Now that enemies are chasing you and respect your physical space, 
we need to give our hero a way to clear the path. In this task, we will implement a player attack mechanism.

We've prepared the agent prompt with the technical specifications for the attacking logic.

Here is what we’ll be focusing on:

### Triggering the attack
We’ll use the **Space** key to trigger our hero's power. However, to keep the game balanced, 
we can't let the player spam attacks infinitely. 
We will implement a cooldown—a short delay (starting at 1 second) during which the player cannot attack again.

### Visualizing the area of effect
The player needs to know exactly where their attack hits: we will create a yellow circle around the player.
This circle should only stay visible for a brief moment, giving the player immediate feedback that their command was registered.

### Combat Logic: who gets hit?
When the attack is triggered, we need to perform a "radius check."
- The radius we define a constant distance representing the reach of our hero's attack.
- The check: we look at all active enemies and calculate their distance from the player.
- The result: if an enemy is inside the attack circle, they are removed from the scene and our tracking list. Poof! Gone!

### The animation loop integration
Just like movement and spawning, the attack cooldown needs to be tracked in the animation loop.
We need to decrease the remaining cooldown time with every frame until it reaches zero, allowing the hero to strike once more.

### Putting it all together
Use the specification from the `spec.md` file to build the attack system. 
It will handle the keyboard input for the Space key and implement the logic to clean up "defeated" enemies from your arrays and the scene.

By the end of this task, you’ll be able to clear out those pesky enemies with a well-timed blast:
![](images/attack.gif)

The feel of the attack depends on the balance between risk and reward. Try playing with these numbers:
- Attack radius: does our hero have a short-range strike or a massive shockwave?
- Cooldown time: how often can the player use their power?
- Visuals: you could even try changing the color or adding a "fade-out" animation to the circle to make it look more polished.
