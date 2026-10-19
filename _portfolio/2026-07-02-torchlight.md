---
title: "Torchlight: Deep Learning Framework from Scratch"
cover: "/images/projects/torchlight/image.png"
category: "Deep Learning Frameworks"
url: "https://github.com/ajeetkbhardwaj/torchlight"
tags: ["deep-learning", "c", "autodiff", "framework", "cuda"]
excerpt: "A deep learning framework built from scratch in C."
---

## Overview

Torchlight is a miniature deep-learning framework implemented in C from the ground up: tensors, automatic differentiation (forward and reverse mode), optimizers, and a training loop. Inspired by the experience of building the MATRIX linear-algebra kernels, it strips PyTorch down to its essentials.

## What I built

- **Tensor library:** n-dimensional arrays with broadcasting, views, and manual memory management (arena allocators per forward pass).
- **Autodiff:** forward-mode via dual numbers and reverse-mode via a tape recording operations for backpropagation.
- **Optimizers:** SGD and Adam, plus common loss functions and activation layers.
- **Training loop:** batched training with gradient checks validated against finite differences.

## Outcome

Training small networks from scratch confirmed that reverse-mode autodiff is careful bookkeeping rather than magic, and that explicit ownership and bounded memory are what make a framework fast enough to actually train. The lessons carried directly into later ML-systems work.
