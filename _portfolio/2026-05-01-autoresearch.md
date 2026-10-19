---
title: "AutoResearch: Autonomous ML Research Framework"
category: "AI Systems"
url: "https://github.com/ajeetkbhardwaj/automlresearch"
tags: ["ai-systems", "automl", "autonomous-research", "machine-learning", "llm"]
excerpt: "Autonomous machine learning research framework for AI agents."
---

## Overview

AutoResearch is a framework that lets AI agents carry out machine-learning research loops autonomously: hypothesis generation, experiment design, code execution, result analysis, and iteration — with a human in the loop only for high-level direction.

## What I built

- **Research agent loop:** an LLM agent proposes experiments, writes training/evaluation code, runs it, and interprets metrics to form the next hypothesis.
- **Experiment tracking:** structured logging of hyperparameters, metrics, and artifacts so each iteration is reproducible.
- **Safety guardrails:** sandboxed code execution and resource limits so agents cannot run away with compute or data.

## Outcome

The framework demonstrates an end-to-end closed loop for ML experimentation, cutting down the manual overhead of running ablations and tuning, while exposing the reliability challenges of letting agents write and execute their own code.
