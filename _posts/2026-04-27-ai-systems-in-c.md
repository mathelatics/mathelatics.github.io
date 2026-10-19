---
title: "Building AI Systems in C: A Ground-Up Perspective"
date: 2026-04-27
cover: "/images/posts/blog_autodiff_dual_numbers.jpg"
excerpt: "Lessons from building systems (and a deep-learning framework) from scratch in C."
tags: ["ai-systems", "c", "autodiff", "deep-learning"]
---
Most machine-learning code runs on top of PyTorch, JAX, or TensorFlow — enormous systems where a single `loss.backward()` hides millions of lines of engineering. Building a small deep-learning framework from scratch in C strips all of that away. What remains is surprisingly little: arrays, loops, and the chain rule. That is the point. When you implement everything yourself, there is nowhere for misunderstanding to hide.

![Derivatives flowing through computation]({{ '/images/posts/blog_autodiff_dual_numbers.jpg' | relative_url }})
*Automatic differentiation turns calculus into plumbing: every value carries its derivative along with it.*

## 1. Dual numbers: derivatives without symbolic math

The cleanest way to get exact derivatives in C is the dual-number trick. Extend every scalar `x` into a pair `(x, x')`, where the second slot carries the derivative, and define arithmetic on pairs:

```c
typedef struct { double val; double grad; } Dual;

Dual dual_mul(Dual a, Dual b) {
    return (Dual){ a.val * b.val, a.val * b.grad + a.grad * b.val };
}
```

That second line *is* the product rule, executable. Compose these operations and derivatives propagate automatically — forward-mode autodiff in under fifty lines. No computation graph, no tape, no framework. This is also how I prototyped gradient checks before writing the reverse-mode pass: slow, but obviously correct, which makes it a perfect oracle for testing the fast path.

## 2. Memory is the real framework

In Python, tensors appear from nowhere and vanish into the garbage collector. In C, every buffer is a decision: who allocates, who owns, who frees, and how long does it live? A few patterns carried the whole design:

- **Arenas per forward pass.** Activations needed during backprop are bump-allocated from a per-iteration arena and discarded wholesale afterward. One pointer reset replaces hundreds of frees.
- **Explicit ownership.** Each tensor struct records whether it owns its storage or borrows it. Views (slices, transposes) borrow; only owners free.
- **No hidden allocations in hot loops.** If a function allocates, its name says so. Backprop must run in bounded memory, so temporaries are preallocated workspaces.

These are systems-engineering habits, but they directly determine whether a training loop runs for ten minutes or ten hours.

## 3. Backprop is bookkeeping, not magic

Reverse-mode differentiation is often taught as something mysterious. Implemented in C, it is revealed as careful bookkeeping: each operation records its inputs during the forward pass, then applies the corresponding vector-Jacobian product in reverse topological order. Debugging it taught me more than any textbook chapter — the standard ritual of comparing analytic gradients against finite differences (`(f(x+h) − f(x−h)) / 2h`) catches sign errors, transposition bugs, and broadcasting mistakes within seconds.

## 4. What I took away

1. **Frameworks compress understanding.** Rebuilding the compressed parts restores it.
2. **Correctness first, speed second.** A slow oracle (dual numbers, finite differences) makes a fast implementation trustworthy.
3. **C punishes vagueness.** Every lifetime, shape, and stride must be stated explicitly — and that explicitness is exactly what makes the resulting system reliable.
4. **Mathematics ports directly.** The chain rule, linear algebra, and numerical analysis in the thesis literature map line-for-line onto C once the data layout is fixed.

If you work in ML and have never built the stack beneath your framework, I recommend it: pick dual numbers, an arena allocator, and a weekend. You will return to PyTorch with far better instincts about what it is doing on your behalf — and what it costs.
