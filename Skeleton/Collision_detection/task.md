Our hero is moving, and the enemies are in hot pursuit! 
However, you might have noticed something strange: everyone is ghosting through each other. 
In this task, we will ground our game in reality by implementing collision detection.

We've prepared the agent prompt with technical details on how to handle these physical interactions.

So, what are the key concepts for this step?

### Defining boundaries
In a 3D world, "touching" isn't as simple as it looks. While Three.js offers a simple `Box3` (bounding box), 
these are often too large and boxy for our rounded characters, leading to "invisible wall" moments. 
Instead, we want to look at the actual shape of the models to determine where they start and end.

### Collision rules
We need to enforce some basic laws of physics for our characters:
- Enemy vs. Enemy: Enemies should respect each other's personal space! They shouldn't be able to occupy the same spot on the map.
- Enemy vs. Player: Our hero shouldn't be able to walk through an enemy, and an enemy shouldn't be able to phase through our hero.

### Integration in the loop
The best time to check for collisions is during the update phase of our animation loop.
1. Calculate the intended next position for the player or enemy.
2. Run a check against all other relevant objects in the scene.
3. If the path is clear, move. If not, stay put.

### Tuning the "hitbox"
Not all models are the same size and shape. It is not always easy to precisely define the boundaries of models. 
We will spend little effort on this for now.
But to give you fine-grained control, we will use a constant to define the collision distance.
This allows you to decide if the collision happens the moment the models touch or if they can get a little closer before stopping.
![](images/bounding_boxes.png)

### Putting it all together
Use the specification from the `spec.md` file to implement the collision logic. 
It will update the movement methods for both your `Player` and `Enemy` logic to include these safety checks.

Once implemented, your game should feel much more solid: no more overlapping enemies or walking through monsters!
![](images/collision.gif)

Try to adjust the collision distance manually or ask the agent to better understand what customization options you have 
and make the interface the way you want it.
