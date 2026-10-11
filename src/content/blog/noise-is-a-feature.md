---
title: Noise Is a Feature, Not a Bug
date: 2026-08-14
tags: [quantum error correction, research]
summary: Why the errors we fight every day in the lab are exactly what makes fault tolerance possible — and what that teaches us about resilience.
---

Every first-year grad student in my lab gets the same assignment: take a surface-code patch, inject noise, watch the logical error rate fall as you grow the code distance $d$. It feels like magic the first time. It shouldn't.

## Errors are local; information is global

A physical qubit decoheres on a timescale $T_2 \approx 100\,\mu s$. But a *logical* qubit encoded across $n = d^2$ physical qubits can live arbitrarily long — as long as errors stay sparse and independent:

$$P_{\text{logical}} \sim \left( \frac{p}{p_{\text{th}}} \right)^{\lfloor (d+1)/2 \rfloor}$$

The beautiful part: **the decoder doesn't need to prevent errors. It only needs them to be rare enough to be correctable.** Fault tolerance turns noise from an enemy into fuel.

| Code distance | Physical error rate | Logical error rate |
|:---:|:---:|:---:|
| d=3 | 1e-3 | ~1e-5 |
| d=7 | 1e-3 | ~1e-11 |
| d=11 | 1e-3 | ~1e-17 |

## The queer-lab parallel

I think about this a lot when people ask whether identity belongs in a physics department. Exclusion is noise — local, specific, correctable. You don't fix it by pretending the channel is perfect. You fix it by adding redundancy: mentors, visibility, community, policy. Each one is a syndrome measurement telling you where the error happened.

- [x] Measure the syndrome honestly
- [x] Apply the correction even when it's tedious
- [ ] Stop romanticizing "clean" channels (they don't exist)

> Resilience isn't the absence of errors. It's a code that knows how to fix them.

*Further reading: Fowler et al., Surface codes (2012); our lab's[notes repo](https://github.com).*
