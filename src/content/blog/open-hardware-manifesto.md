---
title: An Open-Hardware Manifesto for Quantum Labs
date: 2026-05-02
tags: [open science, hardware]
summary: Control electronics are the bottleneck of every quantum lab. Here's why we publish ours — schematics, firmware, BOM and all.
---

Three years ago we decided to publish everything: PCB layouts, FPGA firmware, calibration notebooks. People warned us. Here's what actually happened.

## What we shipped

- A 16-channel analog control board (`qublock-revC`)
- Firmware with `pulse scheduler` + readout demodulation
- A bill of materials under $2k per unit

```python
# Example: scheduling a driven reset pulse
sched.add("reset", freq=5.2e9, amp=0.35, t_start=0, t_stop=1.2e-6)
sched.compile(plan).upload(device="ch0")
```

## The results

1. **Two labs rebuilt our board in a week** instead of a year.
2. Someone found a ground-loop bug we'd lived with for months. PR merged, fixed.
3. Zero lost scoops. Citations went *up*.

## The honest caveats

- Maintenance is real work. Budget it.
- NDA pressure from tech-transfer offices is the hardest part, not the physics.

Openness is an *experiment* worth running at your institution. Report the negative results too — that's the science.
