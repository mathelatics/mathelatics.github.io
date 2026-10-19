---
title: "HHL Quantum Algorithm for the Wave PDE"
category: "Quantum Algorithms"
url: "https://github.com/ajeetkbhardwaj/qwave-hhl"
tags: ["quantum", "quantum-algorithms", "hhl", "qiskit", "pde"]
excerpt: "Harrow–Hassidim–Lloyd (HHL) quantum linear-systems algorithm applied to the wave equation, implemented in Qiskit. Demonstrates quantum phase estimation and controlled rotations to solve a discretized PDE on a quantum circuit."
---

## Overview

The wave equation describes how disturbances propagate through a medium, and solving it numerically means solving a large linear system \(A x = b\) that arises from a spatial discretization. Classically this costs \(O(N^3)\) with direct methods or \(O(N \kappa)\) with iterative solvers. The HHL algorithm promises exponential speedup in the system size \(N\) when the matrix \(A\) is sparse and well-conditioned.

## What I built

I implemented the HHL algorithm in Qiskit to solve a 1D wave PDE discretized with finite differences:

- **Matrix encoding:** the finite-difference Laplacian of the wave operator is encoded as a sparse, Hermitian matrix \(A\).
- **Quantum Phase Estimation (QPE):** eigenvalues of \(A\) are estimated on an ancilla register using controlled-\(e^{iAt}\) unitaries built via Trotterization.
- **Controlled rotation:** an ancilla qubit is rotated by an angle proportional to \(1/\lambda\), encoding the inverse eigenvalues.
- **Inverse QPE and measurement:** uncompute the eigenvalue register and measure the solution register to obtain \(|x\rangle\).

## Results

The quantum circuit reproduces the classical finite-difference solution for small system sizes (\(N = 2^n\), \(n \le 4\) qubits) within shot-noise tolerance. As expected, the QPE precision and circuit depth dominate the error budget — the approach is a proof of concept rather than a practical PDE solver on today's NISQ hardware.

## Caveats

- State preparation of \(|b\rangle\) and readout of \(|x\rangle\) can erase the theoretical speedup unless the data is already quantum-native.
- The algorithm requires a well-conditioned, s-sparse \(A\); ill-conditioned wave matrices need preconditioning.
