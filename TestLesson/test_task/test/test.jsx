import { jest } from '@jest/globals';
import {customizeError} from "../../../utils.js";

// Minimal DOM setup
document.body.innerHTML = '<canvas class="game"></canvas>';

// Provide basic window props used by the renderer
Object.defineProperty(window, 'devicePixelRatio', { value: 1, configurable: true });
Object.defineProperty(window, 'innerWidth', { value: 800, configurable: true });
Object.defineProperty(window, 'innerHeight', { value: 600, configurable: true });

// Mock three.js so no real WebGL context is needed
const setPixelRatio = jest.fn();
const setSize = jest.fn();

jest.unstable_mockModule('three', () => ({
    __esModule: true,
    WebGLRenderer: jest.fn(() => ({ setPixelRatio, setSize })),
}));

// Import the module under test after mocks
const { Renderer } = await import('../../../game/src/components/Renderer.js');
const THREE = await import('three');

test('Renderer initializes WebGLRenderer with the game canvas', () => {
    try{

    const canvas = document.querySelector('canvas.game');
    expect(canvas).not.toBeNull();

    const renderer = Renderer();

    // It should return the created renderer-like object
    expect(renderer).toBeTruthy();

    // Verify WebGLRenderer was constructed with the expected options
    expect(THREE.WebGLRenderer).toHaveBeenCalledTimes(1);
    const callArg = THREE.WebGLRenderer.mock.calls[0][0];
    // Avoid deep-matching the canvas to prevent circular ref traversal
    expect(callArg).toEqual(expect.objectContaining({ alpha: true, antialias: true }));
    expect(callArg.canvas).toBe(canvas);

    // And sizing methods are invoked
    expect(setPixelRatio).toHaveBeenCalledWith(window.devicePixelRatio);
    expect(setSize).toHaveBeenCalledWith(window.innerWidth, window.innerHeight);
    } catch(e) {
        customizeError(e, "Renderer failed to initialize WebGLRenderer");
        throw e;
    }
});
