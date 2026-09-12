export const posts = [
  {
    slug: "ai-ml-learning-roadmap",
    title: "From Mathematical Foundations to Autonomous Agents: My AI/ML Roadmap",
    date: "OCT 2026",
    readTime: "6 MIN READ",
    excerpt: "A structured walkthrough of transitioning from core calculus and linear algebra to building fine-tuned LLM workflows, retrieval-augmented systems, and high-performance inference pipelines.",
    tags: ["AI/ML", "PyTorch", "LLMs", "Systems"],
    content: `Building deep competence in AI/ML is rarely a straight line. When I began structuring my learning trajectory, I wanted to avoid the common trap of only chaining together pre-trained black boxes without understanding the underlying math, computational costs, or numerical stability considerations.

Here is the systematic roadmap I followed, from matrix operations to production agent architectures.

---

### Phase 1: Mathematical Intuition & First Principles
Before importing PyTorch or TensorFlow, you need comfort with how gradients actually propagate:

- **Multivariable Calculus**: Partial derivatives, gradient vectors, Jacobians, and Hessians.
- **Linear Algebra**: Eigenvalues, singular value decomposition (SVD), matrix factorizations, and tensor dimensionality.
- **Probability & Statistics**: Maximum Likelihood Estimation (MLE), Bayesian priors, and variance reduction techniques.

\`\`\`python
# Intuitive manual gradient step
def step(weights, gradients, learning_rate=0.01):
    return weights - (learning_rate * gradients)
\`\`\`

> *"If you cannot implement backpropagation with raw NumPy matrices, you don't truly understand what your deep learning framework is doing under the hood."*

---

### Phase 2: Neural Architectures & Custom Implementations
Moving from theory to practice required building foundational architectures from scratch:

1. **Multi-Layer Perceptrons (MLPs)**: Forward passes, cross-entropy loss, and Xavier/He weight initialization.
2. **Convolutional Networks (CNNs)**: Spatial feature extractors, pooling mechanisms, and receptive field math.
3. **Transformers**: Scaled dot-product attention, multi-head projections, and causal masking:

$$\\text{Attention}(Q, K, V) = \\text{softmax}\\left(\\frac{QK^T}{\\sqrt{d_k}}\\right)V$$

---

### Phase 3: The Modern LLM Stack & Agentic Systems
Modern engineering is centered on practical deployment:

- **Quantization & Inference Optimization**: 4-bit/8-bit quantization (bitsandbytes, AWQ, GGUF) and KV cache optimization.
- **Retrieval-Augmented Generation (RAG)**: Hybrid sparse/dense retrieval, hierarchical chunking, and re-ranking models.
- **Agentic Workflows**: Multi-turn tool usage, reflection patterns, and robust failure recovery.

### What Comes Next
The frontier is moving rapidly toward **test-time compute**, formal verification, and continuous self-correction. Engineering reliable autonomous workflows requires treating LLMs as stochastic microservices within deterministic state machines.`,
  },
  {
    slug: "building-realtime-orbital-portfolio",
    title: "Engineering an Elastic 3D Orbital Portfolio with Three.js & GSAP",
    date: "SEP 2026",
    readTime: "8 MIN READ",
    excerpt: "Deep dive into combining React Three Fiber, custom GSAP spring interpolation, and low-latency Socket.io telemetry into a cohesive interactive galaxy.",
    tags: ["Three.js", "React", "GSAP", "Creative Coding"],
    content: `Portfolios are often treated as static résumés. With this project, my goal was to create an exploratory interface—an interactive cybernetic galaxy that feels physical, responsive, and alive in both dark and light modes.

Here is a look behind the architectural decisions that made this possible without sacrificing 60 FPS performance on lower-tier hardware.

---

### 1. The Three.js WebBackground Architecture
Rather than rendering heavy textured meshes, the interactive background relies on **parametric particle webs** and custom shaders:

- **Particle Coordinates**: 650 vertices generated along Fibonacci spheres.
- **Interconnected Web**: Dynamic LineSegments computed via nearest-neighbor distance thresholds with spatial bucket grids.
- **Pointer Gravity**: A subtle lerp-based mouse attractor that warps particle velocities without causing jarring jumps:

\`\`\`javascript
useFrame((state, delta) => {
  const targetX = (mouse.x * viewport.width) / 2;
  const targetY = (mouse.y * viewport.height) / 2;
  coreRef.current.position.x += (targetX - coreRef.current.position.x) * 0.05;
  coreRef.current.position.y += (targetY - coreRef.current.position.y) * 0.05;
});
\`\`\`

---

### 2. Dual-Mode Material Strategy
Most 3D web experiences break or hide entirely when users toggle into light mode. To support both themes seamlessly:

- The 3D scene listens to custom dispatch events from the theme controller.
- Particle point materials, line buffers, and central core meshes dynamically transition between glowing neon tones (\`#ff2d55\`, \`#8bb8e8\`) in dark mode and high-contrast deep slate (\`#17202b\`, \`#0a1017\`) in light mode.
- Ambient lighting coefficients scale inversely with canvas background luminosity to maintain depth perception.

---

### 3. Elastic Spring Cursor Physics
The cursor is not a single styled div. It uses a **two-tier physics engine**:

1. A zero-latency 12px precision tracker that mirrors raw hardware coordinates.
2. An elastic trailing blob driven by GSAP spring tweens (\`elastic.out(1, 0.5)\`) that stretches and rotates based on immediate pointer velocity.
3. When hovering interactive targets (\`.cursor-can-hover\`), the blob morphs into an inverted bounding rectangle with magnetic snapping.

> *"Interactive polish is the difference between an application that feels like a webpage and one that feels like an instrument."*`,
  },
  {
    slug: "crafting-accessible-radial-gestures",
    title: "Designing Physics-Based Radial Gestures: Beyond the Basic Context Menu",
    date: "AUG 2026",
    readTime: "5 MIN READ",
    excerpt: "How to craft a press-and-hold radial reaction picker with proximity magnification, velocity dampening, and seamless keyboard accessibility.",
    tags: ["UI/UX", "Physics", "Accessibility", "Frontend"],
    content: `Default browser context menus are functional, but utilitarian. For power users and creative interfaces, circular (radial) menus offer a distinct mathematical advantage: **Fitts's Law**.

Because all menu options are situated at equal radii from the cursor's invocation point, the average time to acquire any given target is virtually identical.

---

### 1. The Press-and-Hold Mechanic
Traditional context menus trigger on instant click. For nuanced interactions like reaction pickers, a press-and-hold gesture unlocks dual utility:

- **Quick Click**: Opens the radial action disk (Copy Email, Theme Toggle, GitHub, React).
- **Press & Hold on 'React'**: Spawns an expanded secondary constellation of 6 emoji reactions (\`😀\`, \`❤️\`, \`😢\`, \`😭\`, \`🤩\`, \`🔥\`).

\`\`\`javascript
// Tracking drag distance vs duration
const duration = performance.now() - pressState.startTime;
const isHighIntensity = pressState.hasDragged || duration > 200;
\`\`\`

---

### 2. Drag-to-Magnify (Facebook-Style Proximity)
While holding the pointer down, moving toward any emoji smoothly scales it up (\`1.55x\`) using GSAP while neighboring reactions gracefully return to their base scale.

To ensure buttery-smooth 60fps interaction without layout thrashing:
- Reaction coordinates are projected via inline offsets (\`left: \${rx}px; top: \${ry}px\`).
- GSAP exclusively touches \`scale\` transforms without conflicting with positional \`translate\` styles.
- A radial threshold buffer prevents rapid jitter at the boundary between two adjacent reactions.

---

### 3. Inclusive Keyboard Fallback
Physical pointer gestures must never lock out assistive technology or keyboard-centric users:

- Focusing the 'React' option and pressing \`Enter\` or \`Space\` opens the reaction ring.
- Arrow keys (\`ArrowRight\`, \`ArrowLeft\`, \`ArrowUp\`, \`ArrowDown\`) cycle through the reactions with visible high-contrast focus rings.
- Pressing \`Enter\` on a focused emoji fires the reaction with full particle burst feedback.
- \`Escape\` safely cancels and returns focus to the origin.

> *"Great gesture design isn't just about fun animations; it's about predictable physics and respectful fallbacks."*`,
  },
];
