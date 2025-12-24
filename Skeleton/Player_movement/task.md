> TODO: Experiment with prompts

* `setAnimationLoop()` with callback where you need to
    * Update object positions/rotations
    * Check collisions (will be in next tasks)
    * Handle input
    * Re-render everything
* `queueMove`, `addEventListener` -- collecting the input
* Processing the input: for the animation you need to always keep the state: what movement are you handle now, what is the progress, when it is finished.
* Movement logic: let's add jump as a move (`Math.sin`)

Try changing the code manually or ask Junie to better understand what customization options you have. You should get something like this:

> GIF with player moving around