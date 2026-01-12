Now that our hero can move, it's time to add some challenge! 
In this task, we will populate the world with enemies that will track and move towards the player.

To help you get started, we have added the technical requirements for the enemy logic to the agent prompt.

So, what are the key points to focus on?

### Enemy model
Just like the player, our enemies need a physical presence. 
We will create a new `Enemy.js` component. We'll use the `enemy.glb` model.
You can also rotate and scale the model to achieve the visual you want.

### Spawning logic
We don't want enemies just appearing out of thin air right on top of the player.
Instead, we'll set up spawn points at the corners of our map. Let's add a timer to spawn enemies at regular intervals.

### Enemy behavior: the chase
In every frame of our animation loop, each enemy needs to:
1. Calculate the direction toward the player's current position.
2. Update its coordinates to move a small step closer.
3. Rotate to face the player so they look like they are actively hunting our hero.

At this stage, enemies can overlap each other and do not inflict any damage yet.
We are focusing on the movement and spawning foundations first!

### Putting it all together
Use the specification from the `spec.md` file to implement the enemy system. It will create the `Enemy.js` component and update the main loop in `main.js` to manage the collection of enemies.

By the end of this task, you should see enemies appearing at the corners and converging on your position:

![](images/enemies.gif)

### Customize the Difficulty
The feel of the game changes drastically based on two numbers:
- Spawning Delay: How often do new enemies appear?
- Movement Speed: How fast can they run?

Try tweaking these constants! A high spawn rate with slow enemies creates a "horde" feel, while a few very fast enemies create a tense "hunter" vibe.

We used a ready-made 3D model `enemy.glb`: Armabee Evolved by Quaternius [Public Domain](https://creativecommons.org/publicdomain/zero/1.0/) via [Poly Pizza](https://poly.pizza/m/GcttdvsqsQ).

You can use it for now or replace it with your own.
