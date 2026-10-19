---
title: "Quantum Error Correction — Surface Code"
category: "Quantum Error Correction"
url: "https://github.com/ajeetkbhardwaj/surface-code-qec"
tags: ["quantum", "quantum-error-correction", "surface-code", "qec", "quantum-algorithms"]
excerpt: "Surface-code quantum error correction: stabilizer measurements, syndrome extraction, and minimum-weight perfect matching decoding for fault-tolerant quantum computation."
---

## Overview

Physical qubits are noisy, and fault-tolerant quantum computation requires quantum error correction (QEC). The surface code is a leading QEC architecture: it encodes a logical qubit in a 2D lattice of physical qubits, uses only nearest-neighbor stabilizer measurements, and has a high error threshold (~1%).

## What I built

I simulated a distance-\(d\) surface code with the following pipeline:

- **Stabilizers:** plaquette (Z-type) and star (X-type) operators defined on the lattice edges.
- **Syndrome extraction:** measure stabilizers to obtain a binary error syndrome; bit-flip and phase-flip errors appear as defects (anyons) on the lattice.
- **Decoding:** pair defects via minimum-weight perfect matching (MWPM) on a graph whose edge weights are derived from the physical error rate \(p\), then apply a correction.
- **Logical error rate:** estimate the probability of a logical failure as a function of distance \(d\) and physical error rate \(p\) to demonstrate the threshold behavior.

## Results

The simulator shows the expected threshold: below a critical physical error rate, increasing the code distance suppresses the logical error rate exponentially. Above threshold, larger codes perform worse — the hallmark of a QEC threshold.
